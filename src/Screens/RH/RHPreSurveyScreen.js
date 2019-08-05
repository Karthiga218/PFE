
import React, { Component } from 'react';
import { Platform, StyleSheet, CameraRoll, Dimensions, ScrollView, KeyboardAvoidingView, Image, Alert, TouchableOpacity, TouchableHighlight, Modal, Picker, FlatList, SectionList, View, Text, TextInput } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Button, Input, CheckBox, Divider } from 'react-native-elements';
import styles from '../../Styles/styles';
import ProgressCircle from 'react-native-progress-circle';
import RadioSelector from '../../Components/RadioSelector';
import { connect } from 'react-redux';
import DecalBarcodeReadScreen from '../Common/DecalBarcodeReadScreen';
import NetInfo from  '@react-native-community/netinfo';
import moment from 'moment';

// Modified code from presurvey screen. for testing without api, need address for presurvey screen


class PreSurveyScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ExistingDecal: "N/A",
            PreviousDecal: "",
            nonreadable: false,
            answer: null
        }
        // this.checkExistDecal = this.checkExistDecal.bind(this)
        this.updatePreviousDecal = this.updatePreviousDecal.bind(this)
        this.YesCheckBox = this.YesCheckBox.bind(this)
        this.NoCheckBox = this.NoCheckBox.bind(this)
    }

    updatePreviousDecal(data) {
        this.setState({ PreviousDecal: data })
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <View style={{width:"100%",flexDirection:"row",justifyContent:"center"}}><Text  style={{color:"white",fontSize:20}}>Rangehood Status</Text></View>,
            headerLeft:null,
            headerStyle: {
                backgroundColor: '#e61616',

            },
            headerRight: (
                <View style={{ flexDirection: "row",marginRight:20 }}><Text style={{ color: "white",fontSize:14 }} 
                // onPress={() => navigation.navigate("Tasks", { JobId: navigation.getParam("JobId") })}
                onPress={navigation.getParam('OffCameraAndExit')}

                >Exit</Text></View>
            )
        }


    };
    // checkExistDecal(answer) {
    //     if (answer === 'Yes') {
    //         return this.setState({ ExistingDecal: 'Yes',nonreadable:false ,PreviousDecal:""})
    //     } else {
    //         return this.setState({ ExistingDecal: 'No', nonreadable:false,PreviousDecal: "New Service" })
    //     }
    // }

    OffCameraAndExit=()=>{
        let JobId = this.props.navigation.getParam("JobId");
        this.props.TurnOffCamera();
        this.props.navigation.navigate("RHTasks",{JobId:JobId})
    }
    YesCheckBox() {
        this.setState({ answer: true, ExistingDecal: 'Yes', nonreadable: false, PreviousDecal: "" })
    }
    NoCheckBox() {
        this.setState({ answer: false, ExistingDecal: 'No', nonreadable: false, PreviousDecal: "New Service" })
    }





    handleAddTask(JobId, ExistingDecal, PreviousDecal, nonreadable){
        //update local store.
        this.props.addTask(JobId, ExistingDecal, PreviousDecal, nonreadable)
        //check network connection, update db if connected
        //this.addTaskToDB(JobId)
        NetInfo.fetch().then(state => {
            if(state.isConnected){
                this.addHoodTaskToDB(JobId);
                this.props.navigation.navigate('RHCleaningProcess', { JobId: JobId })
            }else{
                console.log("Not connected to any network, save task to local for now")
                this.props.navigation.navigate('RHCleaningProcess', { JobId: JobId })

            }
          }); 
    }





    async addHoodTaskToDB(JobId){
        
        let Job = this.props.Jobs[JobId];
        let taskIndex = Job.Tasks.length - 1;
        let task = Job.Tasks[taskIndex];

        const taskData =
        {
            JobId:Job.RefId,
            TaskId:(taskIndex).toString(),
            Status:task.Status,
            Compliance:null,
            Decal:task.Name,
            SurveyResult:task.SurveyResult,
            NewDecal:null,
            StartTime:moment(task.StartTime).format('MMM DD YYYY HH:mm:ss'),
            FinishTime:null,
            Precipitator:task.Precipitator


        }
        //console.log(JSON.stringify(taskData))
        // let testTestData = {
        //     JobId:"63",
        //     TaskId:"3",
        //     Status:"ACTIVE",
        //     Compliance:null,
        //     Decal:"123456",
        //     SurveyResult:{"Crit":null,"Critical":{},"NonCrit":null,"NonCritical":{}},
        //     NewDecal:null,
        //     StartTime:"Jul 15 2019 13:28:12",
        //     FinishTime:null,
        //     Precipitator:{"status":null,"service":null,"compliant":null}
        // };
         //console.log(testTestData)
        return await 
        fetch("https://devoci.fdnycloud.org/test/fdnyintegrations/cof/addhoodtask",{
            method:'POST',
            headers:{
                "apikey": "d1257624-1749-4768-84a6-fbe526d6407f",
                'Content-Type': 'application/json'
              },
              body:JSON.stringify(taskData),
            // body:JSON.stringify({
            //     "JId":"55",
            //     "TaskId":"10",
            //     "Status":"ACTIVE",
            //     "Compliance":null,
            //     "Decal":"123456",
            //     "SurveyResult":{"Crit":null,"Critical":{},"NonCrit":null,"NonCritical":{}},
            //     "NewDecal":null,
            //     "StartTime":"Jul 15 2019 13:28:12",
            //     "FinishTime":null,
            //     "Precipitator":{"status":null,"service":null,"compliant":null}
            // })
        })
//         .then(res => res.json())
// .then(response => console.log('Success:', JSON.stringify(response)))
        .catch((err) => console.error('Error:', err))
        // .then(()=>{
        //     // this.setState({loading:false});this.props.addClient(clientAddress1,clientName,clientAddress2,clientBorough,clientZip,resp.jobId)
        //     console.log("add task successfully")
        // })
        //.then((response)=>{console.error(response.statusText)})
// .then(response => console.log('Success:', JSON.stringify(response)))
 //.catch(error => console.error('Error:', error));
    }












    componentDidMount(){
        this.props.navigation.setParams({ OffCameraAndExit:this.OffCameraAndExit });
    }

    render() {
        let bottomContinueButtonStyle = (Platform.OS ==='ios')? styles.bottomContinueButtoniOS :styles.bottomContinueButtonAndroid;
        let JobId = this.props.navigation.getParam("JobId");
        // let barcodeScanIcon = <FontAwesome5 name={"barcode"} size={20} color={"black"} style={{ marginRight: 20 }}
        //     // onPress={()=>navigation.state.params.AddTaskAndNavToPreSurvey()}
        //     onPress={() => this.props.navigation.navigate('DecalBarcodeRead', { JobId: JobId })} />

        let { ExistingDecal, PreviousDecal, nonreadable } = this.state;
       
        let optionalQuestion = (this.state.ExistingDecal === "Yes") ? <View>
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "black" ,marginHorizontal:20}}>Enter or scan the old decal</Text>
            <View style={styles.textPreview}>
                <Input label={"Rangehood Decal"} labelStyle={{ color: "black" }} placeholder={"Enter existing decal"}
                    // leftIcon={barcodeScanIcon}
                    editable={!this.state.nonreadable}
                    value={this.state.PreviousDecal}
                    onChangeText={(text) => this.setState({ PreviousDecal: text })}></Input>

                {
                    <CheckBox iconRight title="The barcode is unreadable" checked={this.state.nonreadable} checkedColor="red"
                        onPress={() => this.setState({ nonreadable: !this.state.nonreadable, PreviousDecal: "" }, () => console.log(this.state))} />
                }
            </View>
            <Button type="outline" title="SCAN" raised
               buttonStyle={{ width: "100%"}}
               containerStyle={{marginHorizontal:80,marginVertical:10}}
                onPress={() => this.props.turnOnOldDecalCamera()}>
            </Button>
        </View> : <View></View>
        // let optionalButton = (this.state.ExistingDecal === "Yes") ? <Button type="outline" title="SCAN"
        //     buttonStyle={{ width: "80%" }}
        //     containerStyle={{ height: 80, flexDirection: "row", alignContent: "center", justifyContent: "center", width: "100%", borderTopColor: "rgb(242, 242, 242)", borderTopWidth: 0, paddingBottom: 10, paddingTop: 10 }}
        //     onPress={() => console.log("rescan decal")}>
        // </Button> : <View></View>


        return (

            this.props.ShowCamera === 2 ?
                <DecalBarcodeReadScreen updateDecal={this.updatePreviousDecal} /> 
                :
                <KeyboardAvoidingView keyboardVerticalOffset={64} style={{ flex: 1 }} enabled>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', borderBottomColor: "#d6d6d6", borderBottomWidth: 2, padding: 10 }}>
                        <ProgressCircle
                            percent={10}
                            radius={25}
                            borderWidth={5}
                            color="#4f962b"
                            shadowColor="#d6d6d6"
                            bgColor="#fff"
                        >
                            <Text style={{ fontSize: 10 }}>{'10%'}</Text>
                        </ProgressCircle>
                        <View >
                            <Text style={{ fontSize: 20, color: "black", paddingLeft: 10 }}>Is there an existing decal on the Rangehood?</Text>
                        </View>

                    </View>
                    <ScrollView>

                        <RadioSelector
                            title={""}
                            selection={["Yes, it has been serviced before.", "No, it is a new system."]}
                            // updateStatus={this.checkExistDecal}
                            answer={this.state.answer}
                            YesCheckBox={this.YesCheckBox}
                            NoCheckBox={this.NoCheckBox}
                        />


                        {optionalQuestion}

                    </ScrollView>
                    <Button type="solid" title="START SERVICING" raised
                        
                        disabled={!(this.state.PreviousDecal.length !==0 ||this.state.nonreadable ===true)}
                        containerStyle={styles.bottomContinueButtonContainer}
                        buttonStyle={bottomContinueButtonStyle}
                        // onPress={() => {
                        //     this.props.addTask(JobId, ExistingDecal, PreviousDecal, nonreadable);
                        //     this.props.navigation.navigate('RHCleaningProcess', { JobId: JobId })
                        // }}
                        onPress={()=>{this.handleAddTask(JobId,ExistingDecal, PreviousDecal, nonreadable)}}
                    >
                    </Button>
                    {/* {optionalButton} */}
                </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        //BarCodeResult:state.RHJobsReducer.BarCodeResult,
        ShowCamera: state.RHJobsReducer.ShowCamera,
        Jobs:state.RHJobsReducer.Jobs,
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        addTask(JobId, ExistingDecal, PreviousDecal, nonreadable) {
            if (nonreadable) {
                const action = {
                    type: "Add_Task",
                    JobId,
                    ExistingDecal,
                    PreviousDecal: "NON-READABLE",
                }
                dispatch(action)
            } else {
                const action = {
                    type: "Add_Task",
                    JobId,
                    ExistingDecal,
                    PreviousDecal,
                }
                dispatch(action)
            }
        },
        turnOnOldDecalCamera() {
            const action = {
                type: "Turn_On_Old_Decal_Camera",
            }
            dispatch(action)
        },
        TurnOffCamera() {
            const action = {
                type: "Turn_Off_Camera",
            }
            dispatch(action)
        }

    }

}
export default connect(mapStateToProps, mapDispatchToProps)(PreSurveyScreen)
