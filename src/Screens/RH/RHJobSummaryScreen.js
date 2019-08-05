
import React, { Component } from 'react';
import { Platform, StyleSheet, CameraRoll, Dimensions, Image, Alert, TouchableOpacity, TouchableHighlight, Modal, Picker, FlatList, SectionList, View, TextInput } from 'react-native';
import NetInfo from  '@react-native-community/netinfo';
import { Button, Input, CheckBox, Text,Divider,Overlay } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';


class JobSummaryScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading:false,
            isVisible:false,
            isConnected:null,
        }
    }

    static navigationOptions = () => ({
        headerTitle: <View style={{width:"100%",flexDirection:"row",justifyContent:"center"}}><Text  style={{right:"50%",color:"white",fontSize:20}}>Job Summary</Text></View>,
        headerTintColor: "white",
        headerTitleStyle: {
            color: "white"
        },
        headerStyle: {
            backgroundColor: '#e61616',

        },
    });


    handleSubmitJob(JobId){
        NetInfo.fetch().then(state=>{
            if(state.isConnected){
                this.submitJobtoDb(JobId);
                //this.props.navigation.navigate('RHClients')
            }else{
                this.setState({isVisible:true})
            }
        })
    }

    submitJobtoDb(JobId){


        let Job = this.props.Jobs[JobId];
        let RefId = Job.RefId;
        let tasksData = [];
        tasksData = Job.Tasks.map( i =>({
            JobId:RefId,
            TaskId:i.Index,
            Status:i.Status,
            Compliance:i.Result,
            Decal:i.Name,
            SurveyResult:i.SurveyResult,
            NewDecal:i.NewDecal,
            StartTime:moment(i.StartTime).format('MMM DD YYYY HH:mm:ss'),
            FinishTime:moment(new Date()).format('MMM DD YYYY HH:mm:ss'),
            Precipitator:i.Precipitator
        }))


        let jobData ={
            JobId:Job.RefId,
            Status:"Completed",
            Tasks:tasksData,
        }
        console.log(jobData,"data_JSON_length: ",JSON.stringify(jobData).length)
        console.log(JSON.stringify(jobData))
        //call update job api here and complete the job.

        fetch("https://devoci.fdnycloud.org/test/fdnyintegrations/cof/updatehoodjob",{
            method:'PUT',
            headers:{
                "apikey": "d1257624-1749-4768-84a6-fbe526d6407f",
                'Content-Type': 'application/json'
              },
              body:JSON.stringify(jobData),
        }).catch((err) => console.error('Error:', err)).then((response)=>response.json()).then(msg=>{console.log(msg);if(msg.status==='Success'){
            
            this.props.submitJob(JobId);
            Alert.alert(
                'Job Successfully Submitted.','',[{text:'Start a New Job',onPress:()=>this.props.navigation.navigate("RHClients")},{text:'EXIT',onPress:()=>this.props.navigation.navigate("LogIn")},{cancelable: false}]
            )
        }else{
                Alert.alert(
                    'Failed to submit the job.',
                    'Please try again.',
                    [
                      {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false},
                    
                  );
        }})








    }

    render() {
        const JobId = this.props.navigation.getParam("JobId");
        const Job = this.props.Jobs[JobId];
        const RefId = Job.RefId;
        let formatCreateTime= moment(Job.CreateTime).format('MM/DD/YYYY hh:mm A');
        //     const taskIndex = this.props.navigation.getParam("taskIndex");
        //     const JobId = this.props.navigation.getParam("JobId");
        //    let task = this.props.Jobs[JobId].Tasks[taskIndex]
        let numOfTotalPrecipitator = Job.Tasks.filter(i =>i.Precipitator.status ===true).length;
        let numofPrecipitatorServiced = Job.Tasks.filter(i =>i.Precipitator.service === true).length;
        let precipitatorServiceResult =(this.props.CertType === 'P64')? 
        (<View style={{
            backgroundColor: "white", borderColor: '#ddd',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 2,
            flex: 1,
        }}>

            {/* if not P64 not show, if P64 show how many Precipitator is serviced */}
    <View style={{ margin: 10 }}><Text style={{ fontSize: 14 }}>Precipitators</Text></View>
    <View style={{ margin: 10 }}><Text style={{ fontWeight: "bold", fontSize: 14 }}>{numofPrecipitatorServiced} of {numOfTotalPrecipitator}</Text></View>
    </View>) : <View style={{flex:1}}></View>
    let precipitatorTotalCompliant =
//     (this.props.CertType === 'P64')?
//     (<View style={{
//         backgroundColor: "white", borderColor: '#ddd',
//         shadowColor: 'rgb(242, 242, 242)',
//         shadowOffset: { width: 2, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 2,
//         elevation: 2,
//         flex: 1,
//         marginRight:20
//     }}>
// <View style={{ margin: 10 }}><Text style={{ fontSize: 16 }}>Precipitator Compliant</Text></View>
// <View style={{ margin: 10 }}><Text style={{ fontWeight: "bold", fontSize: 16 ,color:"red"}}>{Job.Tasks.filter(i=>i.Precipitator.compliant===true).length}</Text></View>
// </View>)
// :
null;
let children =<View>
            <View style={{marign: 10}}> 
                <Text style={{fontSize:20}}>Failed to submit.</Text>
            </View>
            
            <Divider />
            <View style={{margin:10}}>
                <Text style={{fontSize:14}}>Please enable the network connection of your device and try again. Or try later.</Text>
            </View>
            
            <Button type="clear" title="OK" raised onPress={()=>this.setState({isVisible:!this.state.isVisible})}/>
        </View>;
        return (

            <View style={{ padding: 20, backgroundColor: "white" }}>
                <Spinner
          visible={this.state.loading}
          textContent={'Submitting...'}
          textStyle={{color: '#FFF'}}
        />
         <Overlay isVisible={this.state.isVisible} children={children} height="30%" onBackdropPress={()=>this.setState({isVisible:!this.state.isVisible})} >

</Overlay>
                <View style={{flexDirection:"row"}}>
                    <View style={{flex:2}}>
                        <Text style={{fontSize:16,fontWeight:'bold'}}>FDNY REF ID#{RefId}</Text>
                        <Text style={{fontSize:16,fontWeight:'bold'}}>{Job.ClientName}</Text>
                        <Text>{Job.ServiceAddress},{Job.AddressLine2}</Text>
                        <Text>{Job.Borough}, NY {Job.ZipCode}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={{fontSize:16,fontWeight:'bold'}}>{formatCreateTime}</Text>

                    </View>
                </View>
                <Text style={{fontSize:16,fontWeight:'bold',marginVertical:20}}>Service</Text>
                <View style={{flexDirection:"row",justifyContent: "space-between", }}>
                    <View style={{
                            backgroundColor: "white", borderColor: '#ddd',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 2,
                            flex: 1,
                            marginRight:20
                        }}>
                    <View style={{ margin: 10 }}><Text style={{ fontSize: 14 }}>Rangehoods</Text></View>
                    <View style={{ margin: 10 }}><Text style={{ fontWeight: "bold", fontSize: 14 }}>{Job.Tasks.filter(i =>i!=null).filter(i=>i.Status==='COMPLETED').length}</Text></View>
                    </View>
                    {precipitatorServiceResult}
                </View>
                <View>
                    <Text style={{fontSize:16,fontWeight:'bold',marginVertical:20}}>Results</Text>
                    <View style={{flexDirection:"row",justifyContent: "space-between"}}>
                    <View style={{
                            backgroundColor: "white", borderColor: '#ddd',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 2,
                            flex: 1,
                            marginRight:20
                        }}>
                    <View style={{ margin: 10 }}><Text style={{ fontSize: 14 }}>Compliant</Text></View>
                    <View style={{ margin: 10 }}><Text style={{ fontWeight: "bold", fontSize: 14 ,color:"red"}}>{Job.Tasks.filter(i => i!=null).filter(i=>i.Result ==='Compliant').length}</Text></View>
                    </View>
                    <View style={{
                            backgroundColor: "white", borderColor: '#ddd',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 2,
                            flex: 1,
                        }}>
                    <View style={{ margin: 10 }}><Text style={{ fontSize: 14 }}>Non-Compliant</Text></View>
                    <View style={{ margin: 10 }}><Text style={{ fontWeight: "bold", fontSize: 14,color:"red" }}>{Job.Tasks.filter(i => i!=null).filter(i=>i.Result ==='Non-Compliant').length}</Text></View>
                    </View>
                    {precipitatorTotalCompliant}
                </View>
                </View>
                <View style={{flexDirection: "row", alignContent: "center", justifyContent: "center",marginVertical:30}}>




                    {
                        Job.Status==="COMPLETED" ? <Button type="solid" title="Exit" raised
                        buttonStyle={{ width: "100%", backgroundColor: "#fcbd1e" }}
                        onPress={() => {
                            //this.props.submitJob(JobId);
                            
                            this.props.navigation.navigate('RHClients')
                            //submit job and back to joblist screen
                            //need loog out?
                            //or keep job for 12 hours
                            
                        }}
                    //  ONPRESS  SAVE STATUS TO COMPLETED
                    />:<Button type="solid" title="SUBMIT JOB" raised
                    buttonStyle={{ width: "100%", backgroundColor: "#fcbd1e" }}
                    onPress={() => {
                        //this.props.submitJob(JobId);
                        this.handleSubmitJob(JobId)
                        //this.props.navigation.navigate('RHClients')
                        //submit job and back to joblist screen
                        //need loog out?
                        //or keep job for 12 hours
                        
                    }}
                //  ONPRESS  SAVE STATUS TO COMPLETED
                />
                    }
                {/* <Button type="solid" title="SUBMIT JOB" raised
                                        buttonStyle={{ width: "100%", backgroundColor: "#fcbd1e" }}
                                        onPress={() => {
                                            //this.props.submitJob(JobId);
                                            this.handleSubmitJob(JobId)
                                            //this.props.navigation.navigate('RHClients')
                                            //submit job and back to joblist screen
                                            //need loog out?
                                            //or keep job for 12 hours
                                            
                                        }}
                                    //  ONPRESS  SAVE STATUS TO COMPLETED
                                    /> */}

                </View>
                
            


            </View>



        );
    }
}
const mapStateToProps = (state) => {
    return {
        Jobs: state.RHJobsReducer.Jobs,
        CertType:state.DefaultReducer.CertType,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        
        submitJob(JobId){
            const action = {
                type:"Submit_Job",
                JobId
            }
            dispatch(action)
        } 

    }

}
export default connect(mapStateToProps, mapDispatchToProps)(JobSummaryScreen)