
import React, { Component } from 'react';
import { Platform, StyleSheet, CameraRoll, Dimensions, Image, Alert, TouchableOpacity, TouchableHighlight, Modal, Picker, FlatList, SectionList, View, TextInput } from 'react-native';

import { Button, Input, CheckBox, Text, Overlay,Divider } from 'react-native-elements';
import styles from '../../Styles/styles';
import ProgressCircle from 'react-native-progress-circle';
import { connect } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import _ from 'lodash';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class TaskSummaryScreen extends Component {
    constructor() {
        super();
        this.state = {
            showCriticalDeficiencies: false,
            showNonCriticalDeficiencies:false,
        }
    }

    static navigationOptions = () => ({
        headerTitle: <View style={{ width: "100%", justifyContent: "center", flexDirection: "row" }}><Text style={{ fontSize: 20, color: "white" }}>Service Summary</Text></View>,
        headerTintColor: "white",
        headerTitleStyle: {
            color: "white"
        },
        headerStyle: {
            backgroundColor: '#e61616',

        },
    });

    handleFinishTask(JobId,taskIndex){
        this.props.FinishTask(JobId, taskIndex);
        NetInfo.fetch().then(state => {
            if(state.isConnected){
                this.updateHoodtaskToDB(JobId,taskIndex);
                this.props.navigation.navigate('RHTasks', { JobId: JobId })
                
            }else{
                console.log("Not connected to any network, Finish task and save to local for now")
                this.props.navigation.navigate('RHTasks', { JobId: JobId })

            }
          }); 

    }


    async updateHoodtaskToDB(JobId,taskIndex){
        let Job = this.props.Jobs[JobId];
        
        let task = Job.Tasks[taskIndex];

        const taskData =
        {
            JobId:Job.RefId,
            TaskId:(taskIndex).toString(),
            Status:task.Status,
            Compliance:task.Result,
            Decal:task.Name,
            SurveyResult:task.SurveyResult,
            NewDecal:task.NewDecal,
            StartTime:moment(task.StartTime).format('MMM DD YYYY HH:mm:ss'),
            FinishTime:moment(task.FinishTime).format('MMM DD YYYY HH:mm:ss'),
            Precipitator:task.Precipitator


        }
        console.log(taskData)
        return await 
        fetch("https://devoci.fdnycloud.org/test/fdnyintegrations/cof/updatehoodtask",{
            method:'PUT',
            headers:{
                "apikey": "d1257624-1749-4768-84a6-fbe526d6407f",
                'Content-Type': 'application/json'
              },
              body:JSON.stringify(taskData),
        }).catch((err) => console.error('Error:', err)).then(()=>console.log("Update to db sucssesfully"))
        
    }





    render() {

        let finishButtonStyle = (Platform.OS ==='ios')? styles.bottomContinueButtoniOS :styles.bottomContinueButtonAndroid;
        if (this.props.Jobs.length === 0) {
            return null
        } else {

            const taskIndex = this.props.navigation.getParam("taskIndex");
            const JobId = this.props.navigation.getParam("JobId");
            const showButton = this.props.navigation.getParam("showButton");
            let task = this.props.Jobs[JobId].Tasks[taskIndex];
            let formatFinishTime= moment(task.FinishTime).format('MM/DD/YYYY hh:mm A');

            let criticalDeficienciesDetail = <DeficienciesDetails deficiencies={task.SurveyResult["Critical"]} type = {"Critical"}/>
            let nonCriticalDeficienciesDetail=<DeficienciesDetails deficiencies={task.SurveyResult["NonCritical"]} type = {"Non-Critical"}/>
            let deficienciesDetail = (this.state.showCriticalDeficiencies)? criticalDeficienciesDetail:(this.state.showNonCriticalDeficiencies)? nonCriticalDeficienciesDetail:<View></View>;
            
            return (
              
                    <View style={{ padding: 20, backgroundColor: "white" }}>
                        
                    <View>
                        <Text h4 h4Style={{color: "black",fontSize:18 }}>
                            Decal Number: {task.NewDecal}
                        </Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 10 }}>
                            <View style={{
                               backgroundColor: "white", borderColor: '#ddd',
                               shadowColor: '#000',
                               shadowOffset: { width: 0, height: 2 },
                               shadowOpacity: 0.25,
                               shadowRadius: 3.84,
                               elevation: 2,
                                flex: 0.5,
                                marginRight: 5,
                            }}>
                                <View style={{ margin: 5 }}><Text style={{ fontSize: 14 }}>Completed on</Text></View>
                                <View style={{ margin: 5 }}><Text style={{ fontWeight: "bold", fontSize: 14 }}>{formatFinishTime}</Text></View>
                            </View>
                            <View style={{
                                backgroundColor: "white", borderColor: '#ddd',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 2,
                                flex: 0.5,
                                marginLeft: 5
                            }}>
                                <View style={{ margin: 5 }}><Text style={{ fontSize: 14 }}>Pre-Existing Decal</Text></View>
                                <View style={{ margin: 5 }}><Text style={{ fontWeight: "bold", fontSize: 14 }}>{task.Name === "New Service" ? "No" : "Yes"}</Text></View>
                            </View>


                        </View>
                    </View>
                    <View>
                        <Text h4 h4Style={{ fontSize: 16, color: "black" }}>
                            Deficiencies
                    </Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 20 }}>
                            <TouchableOpacity style={{
                                backgroundColor: "white", borderColor: '#ddd',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 2,
                                flex: 0.5,
                                marginRight: 5,
                            }}
                            onPress={()=>this.setState({showCriticalDeficiencies:true})}
                            disabled={Object.keys(task.SurveyResult["Critical"]).length === 0}
                            >
                                <View style={{ margin: 10,flexDirection:"row" }}><Text style={{ fontSize: 14 }}>Critical</Text>
                                { (Object.keys(task.SurveyResult["Critical"]).length !== 0)?
                                <FontAwesome5  solid name={"info-circle"} color={"#e61616"} size={14} containerStyle={{marignLeft:10}} /> :null
                                }
                                </View>
                                <View style={{ margin: 10 }}><Text style={{ fontWeight: "bold", color: "red", fontSize: 14 }}>{Object.keys(task.SurveyResult["Critical"]).length}</Text></View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                backgroundColor: "white", borderColor: '#ddd',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 2,
                                flex: 0.5,
                                marginLeft: 5,
                            }}
                            disabled={Object.keys(task.SurveyResult["NonCritical"]).length === 0}
                            onPress={()=>this.setState({showNonCriticalDeficiencies:true})}
                            >
                                <View style={{ margin: 10 ,flexDirection:"row"}}><Text style={{ fontSize: 14 }}>Non-Critical</Text>
                                {(Object.keys(task.SurveyResult["NonCritical"]).length !==0)?
                                    <FontAwesome5 solid name={"info-circle"} color={"#e61616"} size={14} containerStyle={{marignLeft:10}} />:null
                                }
                                </View>
                                <View style={{ margin: 10 }}><Text style={{ fontWeight: "bold", fontSize: 14 }}>{Object.keys(task.SurveyResult["NonCritical"]).length}</Text></View>
                            </TouchableOpacity>


                        </View>
                    </View>
                    <View>
                        <Text h4 h4Style={{ fontSize: 16, color: "black" }}>
                            Details
                    </Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 20 }}>
                            <View style={{
                                backgroundColor: "white", borderColor: '#ddd',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 2,
                                flex: 1,
                            }}>
                                <View style={{ margin: 10 }}><Text style={{ fontSize: 14 }}>Pre-existing decal?<Text style={{ fontWeight: "bold" }}> {task.Name}</Text></Text></View>
                                <View style={{ margin: 10 }}><Text style={{ fontSize: 14 }}>Precipitator Serviced?<Text style={{ fontWeight: "bold" }}> {(task.Precipitator.service) ? 'Yes' : 'No'}</Text></Text></View>
                                <View style={{ margin: 10 }}><Text style={{ fontSize: 14 }}>Precipitator compliant?<Text style={{ fontWeight: "bold" }}> {(task.Precipitator.compliant) ? 'Yes' : 'No'}</Text></Text></View>
                            </View>



                        </View>
                    </View>

                    {
                        showButton && <Button type="solid" title="FINISH" 
                        buttonStyle={[finishButtonStyle,{backgroundColor:"#fcbd1e"}]}
                        containerStyle={{ height: 80, flexDirection: "row", alignContent: "center", justifyContent: "center", width: "100%", borderTopColor: "rgb(242, 242, 242)", borderTopWidth: 0, paddingBottom: 10, paddingTop: 10 }}
                        onPress={() => {
                            
                            this.handleFinishTask(JobId,taskIndex);
                            this.props.navigation.navigate('RHTasks', { JobId: JobId })
                        }}
                    
                    />

                    }
                    
                    <Overlay isVisible={this.state.showCriticalDeficiencies||this.state.showNonCriticalDeficiencies} children={deficienciesDetail} height="70%" onBackdropPress={()=>this.setState({showCriticalDeficiencies:false,showNonCriticalDeficiencies:false})} />
                   


                </View>


               
               

            );
        }
    }
}
const mapStateToProps = (state) => {
    return {
        Jobs: state.RHJobsReducer.Jobs
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        FinishTask(JobId, taskIndex) {
            const action = {
                type: "Finish_Task",
                JobId,
                taskIndex,
            }
            dispatch(action)
        },


    }

}
export default connect(mapStateToProps, mapDispatchToProps)(TaskSummaryScreen)


class DeficienciesDetails extends Component{

    render(){
        let {deficiencies,type} =this.props;
        let deficienciesNum= Object.keys(deficiencies).length;        
        return(
            <View>
                <View style={{flexDirection:'row',justifyContent:"center"}}><Text style={{fontSize:16}}><Text style={{color:"red"}}>{deficienciesNum}</Text> {type} Deficiencies </Text></View>
                <Divider />
                {
                    Object.entries(deficiencies).map(([key,value],index)=>{
                        let detail = value.filter(i =>i!=="Other").map((i,index)=>typeof(i)==="string"?  i :  `Comment: ${i.comment}`);
                        return (
                            <View key={index}>
                                <View style={{flexDirection:"row",justifyContent:"space-between",width:"100%",paddingHorizontal:10,paddingVertical:10}}>
                                <View style={{flex:1}}><Text style={{color:"red",fontSize:16}}>{_.startCase(key)}</Text></View>
                                <View style={{flexDirection:"column",flex:1}}>
                                {detail.map((i,index)=><View key={index} style={{flexDirection:"row"}}><View><Text>{'\u2022'} </Text></View><View><Text style={{fontSize:16}}>{i}</Text></View></View>)}
                                </View>
                            </View>
                            <Divider />
                            </View>
                            
                        )
                    })
                   
                }
                
            </View>
        )
    }
}



