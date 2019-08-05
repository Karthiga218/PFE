/* ************************************************************************
    This function returns a list of addresses within a specified distance
    of an input location. The output also includes the distance from the 
    input point.

        nearestAddress(params)

    The input object, params, can take the form of an object with the 
    following attributes:
        
        longitude [long, lon]   <float or string>
            The horizontal coordinate.
        latitude [lat]  <float or string>
            The vertical coordinate.
        distance [searchDistance, dist] <integer>
            How far from the starting point to search for valid address
            points. This value is an integer in feet. Defaults to 500.
        allFields <boolean> - optional
            When true, return all available field information. When false,
            returns only internally-defined list of fields. Defaults to false.
    
    e.g.
        params = {
            longitude: -73.984813,   //also accepts: long, lon
            latitude: 40.694406,     // also accepts: lat
            distance: 500            // also accepts: searchDistance, dist
        }

    The function makes two asyncrhonous calls to web services. Its output
    is a promise that resolves to a distance-sortedlist of objects 
    containing the street address, BIN, and distance from the starting
    point. 

        [{
            BIN: <integer>,
            distance: <double>, // the current output is feet
            stAddress: <string>, // the house number and street name
        }]

    The example above returns an array of 19 addresses, taking the
    following form:

        [
            {
                BIN: 3058185
                distance: 73.8
                stAddress: "311 BRIDGE ST"
            }, {
                BIN: 3058187
                distance: 169.62
                stAddress: "9 METROTECH CENTER"
            }
        ]

    Additional attributes are available. To see all available fields,
    set params.allFields to true before calling the function.

************************************************************************ */
function nearestAddress(params) {
    const serviceURL = 'https://devoci.fdnycloud.org/arcgis/rest/services/'
    const queryURL = serviceURL + 'Test/OpenData/MapServer/0/query' 
    const lengthURL = serviceURL + 'Utilities/Geometry/GeometryServer/lengths'
    const apikey = 'f0ef612b-ba87-4edf-9c36-b53a0cb01745'

    var longitude = params['longitude'] || params['long'] || params['lon'] 
    var latitude = params['latitude'] || params['lat'] 
    var searchDistance = params['searchDistance'] || params['distance']|| params['dist'] || 500
    var allFields = params['allFields'] || false

    //New request for all address points within the specified distance
    var pointReq = new XMLHttpRequest()

    //New request for finding the difference between the input coordinates and each located address point
    var distReq = new XMLHttpRequest()

    //The object defining the POST request URL-encoded form body for the point-location request.
    pointParams = encodeForm({
        geometry: [longitude,latitude],
        geometryType: 'esriGeometryPoint',
        inSR: '4326',
        outSR: '4326',
        spatialRel: 'esriSpatialRelIntersects',
        resultType: 'none',
        distance: searchDistance,
        units: 'esriSRUnit_Foot',
        returnGeodetic: true,
        outFields: '*',
        returnGeometry: true,
        f: 'json'
    })
    
    //Open the requests and add the necessary headers to pass the URL-encoded form and access the services behind the API Gateway
    pointReq.open('POST',queryURL)
    pointReq.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
    pointReq.setRequestHeader('apikey',apikey)
    
    distReq.open('POST',lengthURL)
    distReq.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
    distReq.setRequestHeader('apikey',apikey)
    
    //Returns a promise that resolves when both requests return
    return new Promise(function (resolve, reject) {
        var outObj = []

        //simple error-handling
        function requestError(error) {
            return reject(['Request Error',error])
        }

        pointReq.onerror = requestError
        distReq.onerror = requestError

        //when the point request returns, parse the list of address points for the second request
        pointReq.onload = function () {
            var pointJSON = JSON.parse(pointReq.response)

            //promise rejects if the first request successfully returns, but is an error
            if (pointJSON['error'] || !pointJSON['features']) {
                return reject(pointJSON['error'])
            
            //promise immediately resolves to an empty list if no points are found within the given radius
            } else if (pointJSON.features.length == 0) {
                return resolve([])

            //if at least one result was returned, format the second request
            } else {
                var pathList = []

                //creates a series of straight lines between the point of origin and each located address point
                pointJSON.features.forEach(function (feature) {
                    pathList.push({
                        paths: [[[longitude,latitude],[feature.geometry.x,feature.geometry.y]]]
                    })

                    outObj.push(feature.attributes)
                })

                //format the URL-encoded form for the second POST request
                distParams = {
                    sr: 4326,
                    lengthUnit: 9003,
                    calculationType: 'planar',
                    polylines: pathList,
                    f: 'json',
                }

                distReq.send(encodeForm(distParams))
            }                        
        }

        //when the distance request returns, format the output
        distReq.onload = function () {
            var distJSON = JSON.parse(distReq.response)

            //append the results of the distance query to the total results from the first
            outObj.map(function (item) {
                //distance is rounded to the nearest hundredth of a foot
                item['distance'] = Math.round(distJSON.lengths[outObj.indexOf(item)]*100)/100
                //concatenate the street address into a human-friendly format
                item['stAddress'] = [item.H_NO+item.HNO_SUFFIX,item.PRE_DIRECT,item.PRE_MODIFI,item.PRE_TYPE,item.ST_NAME,item.POST_TYPE,item.POST_DIREC,item.POST_MODIF].join(' ').replace(/\s+/ig,' ').trim()
            })

            //sort the entire result by the shortest distance
            outObj.sort(function (a,b) {return a.distance - b.distance})

            //filter the output fields to include only distance, street address, and BIN
            var resObj = []
            outObj.forEach(function (obj) {
                var thisObj = {}
                Object.keys(obj).filter(function (word) {
                    //this list controls which fields are output
                    return ['distance','stAddress','BIN'].includes(word)
                }).forEach(function (key) {
                    thisObj[key] = obj[key]
                })
                resObj.push(thisObj)
            })
            
            //if the allFields input parameter is true, return all output fields, otherwise return only those outlined above
            if (allFields) {
                return resolve(outObj)
            } else {
                return resolve(resObj)
            }
            
        }

        //send the first request, asynchronously triggering the rest
        pointReq.send(pointParams)
    })
}


/* ************************************************************************
    This function returns the distance, in feet, between an input location
    and an input address. The first request utilizes GeoClient to geolocate
    the input address, if no result is found, the function fails.

        nearestAddress(params)

    The input object, params, can take the form of an object with the 
    following attributes:

        longitude [long, lon]   <float or string>
            The horizontal coordinate.
        latitude [lat]  <float or string>
            The vertical coordinate.
        borough <string>
            The whole borough name.
        house_number <string>
            The house number for the input address.
        street <string>
            The whole street name for the input address.
    
    The resulting output is a promise that results in a numeric value for
    the number of feet between the input location and the closest match
    for the input address.

************************************************************************ */
export default function addressCheck(params) {
    const serviceURL = 'https://devoci.fdnycloud.org/arcgis/rest/services/'
    const lengthURL = serviceURL + 'Utilities/Geometry/GeometryServer/lengths'
    const apikey = 'f0ef612b-ba87-4edf-9c36-b53a0cb01745'

    const queryURL = serviceURL + 'Test/OpenData/MapServer/0/query'

    return new Promise(function (resolve, reject) {
        //New request for all address points within the specified distance
        var pointReq = new XMLHttpRequest()

        var parameters = {
            app_id: '088eb80b',
            app_key: '4c4aa431a064a3046e5c978ac9dd1fbb',
            borough: params.borough,
            houseNumber: params.house_number,
            street: params.street_name
        }

        // query GeoClient for the address information
        var gcURL = 'https://api.cityofnewyork.us/geoclient/v1/address.json?'

        var geoReq = new XMLHttpRequest()
        geoReq.open('GET', gcURL + Object.keys(parameters).map(function (key) {return key + '=' + parameters[key]}).join('&'))
        geoReq.onload = (res) => {
            var parsedResponse = JSON.parse(geoReq.response)

            if (parsedResponse.address) {
                var attr = parsedResponse.address

                var pathList = [
                    {paths: [[[params.longitude,params.latitude],[attr.longitude,attr.latitude]]]},
                    {paths: [[[params.longitude,params.latitude],[attr.longitudeInternalLabel,attr.latitudeInternalLabel]]]},
                ]

                distParams = {
                    sr: 4326,
                    lengthUnit: 9003,
                    calculationType: 'planar',
                    polylines: pathList,
                    f: 'json',
                }

                //The object defining the POST request URL-encoded form body for the point-location request.
                pointParams = encodeForm({
                    geometryType: 'esriGeometryPoint',
                    where: "PHYSICALID = {PHYSICALID} AND H_NO LIKE '{H_NO}'".replace('{PHYSICALID}',attr.physicalId).replace('{H_NO}',attr.houseNumberIn),
                    outSR: '4326',
                    outFields: '*',
                    returnGeometry: true,
                    f: 'json'
                })
                
                //Open the requests and add the necessary headers to pass the URL-encoded form and access the services behind the API Gateway
                pointReq.open('POST',queryURL)
                pointReq.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
                pointReq.setRequestHeader('apikey',apikey)

                pointReq.onload = function () {
                    // for testing.....
                    //console.log(JSON.parse(pointReq.response).error)
                    if(JSON.parse(pointReq.response).hasOwnProperty("error")){
                        errMessage = JSON.parse(pointReq.response).error.message
                        return resolve(errMessage)
                    }
                    else{
                        var pointJSON = JSON.parse(pointReq.response)

                    pointJSON.features.forEach((feature) => {
                        pathList.push({
                            paths: [[[params.longitude,params.latitude],[feature.geometry.x,feature.geometry.y]]]
                        })
                    })

                    distParams.polylines = pathList
                    distReq.send(encodeForm(distParams))
                    }
                    
                }

                pointReq.onerror = function (err) {
                    console.error('pointReq error',err)
                    distReq.send(encodeForm(distParams))
                }

                pointReq.send(pointParams)

                //New request for finding the difference between the input coordinates and each located address point
                var distReq = new XMLHttpRequest()
                distReq.open('POST',lengthURL)
                distReq.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
                distReq.setRequestHeader('apikey',apikey)

                distReq.onload = function () {
                    var distJSON = JSON.parse(distReq.response)
                    return resolve(Math.min.apply( Math, distJSON.lengths))
                }
            }
        }

        geoReq.onerror = (err) => {
            console.error('geoReq error', err)
            reject(err)
        }

        geoReq.send()
    })
}


// This function encodes the user input into the Esri-specific URL-encoded format the REST endpoints expect
function encodeForm (object) {
    var formBody = [];
    for (var property in object) {
        var encodedKey = encodeURIComponent(property);
        
        var propVal = object[property]

        if (Array.isArray(propVal)) {
            var encodedValue = propVal.map(subEncode)
            if (typeof propVal[0] == 'object') {
                encodedValue = '[' + encodedValue.join(',') + ']'
            }
        }
        else if (typeof propVal == 'object') {
            var encodedValue = JSON.stringify(subEncode(propVal))
        }  else {
            var encodedValue = encodeURIComponent(propVal);
        }

        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    return formBody
}

//A nested function to handle recursion. The first iteration requires a different set of rulest han the subsequent iterations.
function subEncode(x) {
    if (Array.isArray(x)) {
        return x.map(subEncode)
    } else if (typeof x == 'object') {
        return Object.keys(x).map(function (k){
            var obj = {}
            obj[k] = subEncode(x[k])
            return JSON.stringify(obj)
        })
    } else {
        return x
    }
}