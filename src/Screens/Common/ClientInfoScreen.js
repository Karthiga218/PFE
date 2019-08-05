import React, { Component } from 'react';
import { createAppContainer, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Platform, StyleSheet, CameraRoll, Dimensions, Image, Alert,TouchableOpacity, PickerIOS,Keyboard,KeyboardAvoidingView,TouchableWithoutFeedback,ActionSheetIOS,TouchableHighlight, Modal, Picker, View, TextInput } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../../Styles/styles';
import { connect } from 'react-redux';
import { ListItem, Input, Button, Text ,Divider,Overlay} from 'react-native-elements';
import RadioSelector from '../../Components/RadioSelector';
import addressCheck from '../../COF_GIS';
import { ScrollView } from 'react-native-gesture-handler';

class ClientInfoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ClientName: '',
            AddressLine2: '',
           // Borough: "(Required)",
            //ZipCode: '',
            isVisible:true,
            loading:false,
            showIOSPicker:false,
        }

        // this.updateStatus = this.updateStatus.bind(this);
    }

    static navigationOptions = () => ({
        headerTitle: <View style={{width:"100%",flexDirection:"row",justifyContent:"center"}}><Text  style={{color:"white",fontSize:20}}>Client's Info</Text></View>,
        headerTintColor: "white",
        headerTitleStyle: {
            color: "white"
        },
        headerStyle: {
            backgroundColor: '#e61616',

        },
        headerRight:<View></View>,
    });


    // updateStatus(answer){
    // if(answer === 'Yes'){
    //     return this.setState({status:true})
    // }else{
    //     return this.setState({status:false})
    // }
    // }

    async addJobToDB(cofNum,clientName,clientAddress1,clientAddress2,clientBorough,clientZip,location){
        if(clientBorough === '(Optional)'){
            clientBorough = '';
        }
        this.setState({loading:true})
        const jobData ={cofNum:cofNum,
                        clientName:clientName,
                        clientAddress1:clientAddress1,
                        clientAddress2:clientAddress2,
                        clientBorough:clientBorough,
                        clientZip:clientZip,
                        gpsCoords:[`${location.Latitude}`,`${location.Longitude}`],                
        }
        console.log(JSON.stringify(jobData))
        return await 
        fetch("https://devoci.fdnycloud.org/test/fdnyintegrations/cof/addjob",{
            method:'POST',
            headers:{
                "apikey": "d1257624-1749-4768-84a6-fbe526d6407f",
                'Content-Type': 'application/json'
              },
              body:JSON.stringify(jobData),
        }).then((response) => response.json(), (err) => console.log(err)).then(resp=>{this.setState({loading:false});this.props.addClient(clientAddress1,clientName,clientAddress2,clientBorough,clientZip,resp.jobId);this.props.navigation.navigate('RHTasks', { JobId: this.props.JobsCounter-1 })})
    }






    AddClientAndNavToTask(cofNum,ServiceAddress, ClientName, AddressLine2,Borough,ZipCode,gpsCoords) {
        this.addJobToDB(cofNum,ClientName,ServiceAddress,AddressLine2,Borough,ZipCode,gpsCoords)
        // this.props.addClient(ServiceAddress, ClientName, AddressLine2,Borough,ZipCode);
        //  this.props.navigation.navigate('RHTasks', { JobId: this.props.JobsCounter })

    }

    async confirmLocation(Latitude, Longitude) {
        
        let params = {
            longitude: Longitude,
            latitude: Latitude,
            distance: 500,
        }
        console.log(params)
        let result = await nearestAddress(params);
        this.setState({loading:false})
        console.log(result)
        this.props.saveNearestAddress(result);
    }

    async handlecheckAddress(){
        let params ={
            borough:"Queens",
            house_number:"221-28",
            street_name:'Horace Harding Expy',
            longitude:`${this.props.Location.Longitude}`,
            latitude:`${this.props.Location.Latitude}`,
        }
        console.log(params)
        let result = await addressCheck(params);
        console.log("Your distance to the client",result)
    }


    openActionSheetios(){
        ActionSheetIOS.showActionSheetWithOptions(
            {
              options: options=['Bronx', 'Brooklyn','Manhattan','Queens','Staten Island','Cancel'],
              //destructiveButtonIndex: 4,
              cancelButtonIndex: 5,
            //   title:'Select borough...',
              
            },
            (buttonIndex) => { console.log(options[buttonIndex])
                if(buttonIndex !== 5){
             
              this.setState({Borough:options[buttonIndex]})}
            },
          );
    }
    toggleIOSPicker(){
        this.setState({showIOSPicker:!this.state.showIOSPicker})
    }


    render() {
        let bottomContinueButtonStyle = (Platform.OS ==='ios')? styles.bottomContinueButtoniOS :styles.bottomContinueButtonAndroid;
        let boroughPicker = (Platform.OS === 'ios')? (
            <TouchableOpacity onPress={() => this.openActionSheetios()} style={{ borderBottomColor: "grey", justifyContent:"space-between",borderBottomWidth: 1, marginLeft: 10, marginRight: 10, flex:2}}>
            <Text h4 h4Style={{ fontSize: 14, color: "black",fontWeight:"bold" }}>Borough</Text>
            <View>
                {
                    this.state.Borough ==='(Optional)'? <Text style={{fontSize:20,marginBottom:10,color:"#C7C7CD"}}>{this.state.Borough}</Text>:<Text style={{fontSize:20,marginBottom:10}}>{this.state.Borough}</Text>
                }
               
            </View>
            
            </TouchableOpacity>
        ) :(
        
            <View style={{ borderBottomColor: "grey", borderBottomWidth: 1, marginLeft: 10, marginRight: 10, flex:2 }}>
            <Text h4 h4Style={{ fontSize: 14, color: "black",fontWeight:"bold" }}>Borough</Text>
           <Picker
                                selectedValue={this.state.Borough}
                                mode="dropdown"
                                style={{}}
                                itemStyle={{}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ Borough: itemValue })} >

                                <Picker.Item label = '(Required)' value={"(Required)"} color="#C7C7CD" />
                                <Picker.Item label="Bronx" value="Bronx" />
                                <Picker.Item label="Brooklyn" value="Brooklyn" />
                                <Picker.Item label="Queens" value="Queens" />
                                <Picker.Item label="Manhattan" value="Manhattan" />
                                <Picker.Item label="Staten Island" value="Staten Island" />

                            </Picker>
        </View>
        
        
        )




        let children = 
        <View style={{position:"absolute",bottom:10,width:'100%',backgroundColor:"#dedede"}} >
        <Picker
        selectedValue={this.state.Borough}
        style={{}}
        itemStyle={{}}
        onValueChange={(itemValue, itemIndex) => this.setState({ Borough: itemValue,showIOSPicker:false })} >

        <Picker.Item label="Bronx" value="Bronx" />
        <Picker.Item label="Brooklyn" value="Brooklyn" />
        <Picker.Item label="Queens" value="Queens" />
        <Picker.Item label="Manhattan" value="Manhattan" />
        <Picker.Item label="Staten Island" value="Staten Island" />

    </Picker>
        {/* <Button title="close" type='clear' onPress={()=>this.setState({showIOSPicker:false})}></Button> */}
    </View>





        // let children =<View>
        //     <View style={{marign: 10}}> 
        //         <Text style={{fontSize:20}}>Failed to find your location</Text>
        //     </View>
            
        //     <Divider />
        //     <View style={{margin:10}}>
        //         <Text style={{fontSize:14}}>Please check the address, Ensure GPS is enabled.</Text>
        //     </View>
        //     <View style={{margin:10}}>
        //         <Text style={{fontSize:14}}>Move closer to the client's addres and try again.</Text>
        //     </View>
        //     <Button type="clear" title="OK" raised onPress={()=>this.setState({isVisible:!this.state.isVisible})}/>
        // </View>;
        const {ServiceAddress,Borough,ZipCode,Location,CERT} = this.props;
        //const { ClientName, AddressLine2,Borough,ZipCode} = this.state;
        const { ClientName, AddressLine2,} = this.state;
        return (
            <TouchableWithoutFeedback onPress={(Platform.OS==='ios')? Keyboard.dismiss : null}>
               

                



            
            <View style={{ flex: 1, flexDirection: "column" }}>
        
                 <Spinner
          visible={this.state.loading}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />
        <Overlay isVisible={this.state.showIOSPicker} animationType='slide' overlayStyle={{position:"absolute",bottom:0,backgroundColor:"transparent",width:"100%",margin:0,padding:0}} children={children}  onBackdropPress={()=>this.setState({showIOSPicker:!this.state.showIOSPicker})} >

</Overlay>
                <Text style={{ fontSize: 16 ,color:"black",margin:10}}>Please enter the client's service information.</Text>
                <View style={styles.textPreview}>
                   
                    <Input autoFocus={true} label={"Client Name"} labelStyle={{ color: "black", fontSize: 14 }} placeholder={"Client's Name (Required)"} placeholderTextColor={"#C7C7CD"} containerStyle={{ marginBottom: 20 }}
                        onChangeText={(text) => this.setState({ ClientName: text })} />
                    <Input label={"Address Line 1"} labelStyle={{ color: "black", fontSize: 14 }} value={ServiceAddress} containerStyle={{ marginBottom: 20 }} editable={false} />
                    <Input inputContainerStyle={{}} label={"Address Line 2"} labelStyle={{ color: "black", fontSize: 14 }} containerStyle={{ marginBottom: 20 }} placeholder={"Floor, suite, apt (Optional)"} placeholderTextColor={"#C7C7CD"}
                        onChangeText={(text) => this.setState({ AddressLine2: text })} />
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        {/* <View style={{ borderBottomColor: "grey", borderBottomWidth: 1, marginLeft: 10, marginRight: 10, flex:2 }}>
                            <Text h4 h4Style={{ fontSize: 14, color: "black",fontWeight:"bold" }}>Borough</Text>
                            
                        </View> */}
                        {/* {boroughPicker} */}


                        {/* IOS picker */}
                        {/* +++++++++++++++++++++++++++++++++++++ option 1+++++++++++++++++++++ */}
                        {/* <TouchableOpacity onPress={() => this.openActionSheetios()} style={{ borderBottomColor: "grey", justifyContent:"space-between",borderBottomWidth: 1, marginLeft: 10, marginRight: 10, flex:2}}>
                        <Text h4 h4Style={{ fontSize: 14, color: "black",fontWeight:"bold" }}>Borough</Text>
                        <View>
                            {
                                this.state.Borough ==='(Optional)'? <Text style={{fontSize:20,marginBottom:10,color:"#C7C7CD"}}>{this.state.Borough}</Text>:<Text style={{fontSize:20,marginBottom:10}}>{this.state.Borough}</Text>
                            }
                           
                        </View>
                        
                        </TouchableOpacity> */}

                       {/* +++++++++++++++++++++++++++++++++++++ option 2+++++++++++++++++++++ */}
                       {/* <TouchableOpacity onPress={() => this.toggleIOSPicker()} style={{ borderBottomColor: "grey", justifyContent:"space-between",borderBottomWidth: 1, marginLeft: 10, marginRight: 10, flex:2}}>
                        <Text h4 h4Style={{ fontSize: 14, color: "black",fontWeight:"bold" }}>Borough</Text>
                        <View>
                            {
                                this.state.Borough ==='(Optional)'? <Text style={{fontSize:20,marginBottom:10,color:"grey"}}>{this.state.Borough}</Text>:<Text style={{fontSize:20,marginBottom:10}}>{this.state.Borough}</Text>
                            }
                           
                        </View>
                        
                        </TouchableOpacity> */}
                        
                        {/* <Input label={"ZipCode"} labelStyle={{ color: "black", fontSize: 14 }} placeholderTextColor={"#C7C7CD"} inputContainerStyle={{}} containerStyle={{ flex:1 }} placeholder={"(Optional)"} maxLength={5} onChangeText={(zipcode) => this.setState({ ZipCode: zipcode })} keyboardType="numeric" /> */}
                        <Input label={"Borough"} labelStyle={{ color: "black", fontSize: 14 }}  containerStyle={{ flex:2}}  value = {Borough}/> 
                        <Input label={"ZipCode"} labelStyle={{ color: "black", fontSize: 14 }}  containerStyle={{ flex:1 }}  value = {ZipCode}/> 


                    </View>
                    {/* <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ borderBottomColor: "grey", borderBottomWidth: 1, marginLeft: 10, marginRight: 10, flex:2 }}>
                            <Text h4 h4Style={{ fontSize: 14, color: "black",fontWeight:"bold" }}>Borough</Text>
                            
                        </View>
                        {boroughPicker}


                        IOS picker
                        +++++++++++++++++++++++++++++++++++++ option 1+++++++++++++++++++++
                        <TouchableOpacity onPress={() => this.openActionSheetios()} style={{ borderBottomColor: "grey", justifyContent:"space-between",borderBottomWidth: 1, marginLeft: 10, marginRight: 10, flex:2}}>
                        <Text h4 h4Style={{ fontSize: 14, color: "black",fontWeight:"bold" }}>Borough</Text>
                        <View>
                            {
                                this.state.Borough ==='(Optional)'? <Text style={{fontSize:20,marginBottom:10,color:"grey"}}>{this.state.Borough}</Text>:<Text style={{fontSize:20,backgroundColor:"lightyellow",marginBottom:10}}>{this.state.Borough}</Text>
                            }
                           
                        </View>
                        
                        </TouchableOpacity>

                       +++++++++++++++++++++++++++++++++++++ option 2+++++++++++++++++++++
                       <TouchableOpacity onPress={() => this.toggleIOSPicker()} style={{ borderBottomColor: "grey", justifyContent:"space-between",borderBottomWidth: 1, marginLeft: 10, marginRight: 10, flex:2}}>
                        <Text h4 h4Style={{ fontSize: 14, color: "black",fontWeight:"bold" }}>Borough</Text>
                        <View>
                            {
                                this.state.Borough ==='(Optional)'? <Text style={{fontSize:20,marginBottom:10,color:"grey"}}>{this.state.Borough}</Text>:<Text style={{fontSize:20,marginBottom:10}}>{this.state.Borough}</Text>
                            }
                           
                        </View>
                        
                        </TouchableOpacity>
                        
                        <Input label={"ZipCode"} labelStyle={{ color: "black", fontSize: 14 }} placeholderTextColor={"grey"} inputContainerStyle={{}} containerStyle={{ flex:1 }} placeholder={"(Optional)"} maxLength={5} onChangeText={(zipcode) => this.setState({ ZipCode: zipcode })} keyboardType="numeric" />


                    </View> */}
                    
                    
                </View>
               
                <Button type="solid" title="Continue" raised
                         buttonStyle={bottomContinueButtonStyle}
                         containerStyle={styles.bottomContinueButtonContainer}
                        disabled={this.state.ClientName.trim().length === 0 || this.state.Borough ==='(Required)'}
                        // onPress={() => this.props.navigation.navigate('PreSurvey')}
                        onPress={() => this.AddClientAndNavToTask(CERT,ServiceAddress, ClientName.trim(), AddressLine2,Borough,ZipCode,Location)}
                        //onPress={()=>console.log("add client ")}
                />

{/* <Button type="solid" title="Chenck distacnet" raised
                        buttonStyle={{ width: "100%" }}
                        
                        // onPress={() => this.props.navigation.navigate('PreSurvey')}
                        onPress={() => this.handlecheckAddress()}
                        //onPress={()=>console.log("add client ")}
                /> */}
              
                    
                
               
                

              
              
                

            </View>
           

            </TouchableWithoutFeedback>



    
        )
    }
}



const mapStateToProps = (state) => {
    return {
        ServiceAddress: state.RHJobsReducer.ServiceAddress,
        Borough: state.RHJobsReducer.Borough,
        ZipCode:state.RHJobsReducer.ZipCode,
        JobsCounter: state.RHJobsReducer.JobsCounter,
        CERT:state.DefaultReducer.CERT,
        Location:state.RHJobsReducer.Location,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addClient(ServiceAddress, ClientName, AddressLine2,Borough,ZipCode,RefId) {
            const action = {
                type: "Add_Job",
                ServiceAddress,
                ClientName,
                AddressLine2,
                Borough,
                ZipCode,
                RefId
            }
       
            dispatch(action)
        }
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(ClientInfoScreen)

// export default connect(null, null)(ClientInfoScreen)