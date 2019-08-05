
import React, { Component } from 'react';
import { Platform, StyleSheet, CameraRoll, Dimensions, Image, Alert, TouchableOpacity, TouchableHighlight, Modal, Picker, FlatList, SectionList, View, Text, TextInput } from 'react-native';

import { Button, Input, CheckBox } from 'react-native-elements';
import styles from '../../Styles/styles';
import ProgressCircle from 'react-native-progress-circle';
import { connect } from 'react-redux';
import DecalBarcodeReadScreen from '../Common/DecalBarcodeReadScreen';

// Step 7

class NewDecalScreen extends Component {
    constructor() {
        super();
        this.state = {
            NewDecal: ""
        }
        this.updateNewDecal = this.updateNewDecal.bind(this);
    }

    static navigationOptions = ({ navigation }) => ({
            headerTitle: <View style={{ width: "100%", justifyContent: "center", flexDirection: "row" }}><Text style={{fontSize: 20, color: "white" }}>New Decal</Text></View>,
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: '#e61616',

            },
            headerRight: (
                <View style={{ flexDirection: "row",marginRight:10 }}><Text style={{ color: "white" }} 
                //onPress={() => { navigation.navigate("Tasks", { JobId: navigation.getParam("JobId"), taskIndex: navigation.getParam("taskIndex") }) }}
                onPress={navigation.getParam('SaveAndExit')}
                >Save and Exit</Text></View>
            )
        });

    updateNewDecal(data) {
        this.setState({ NewDecal: data })
    }
    SaveAndExit=()=>{
        
        const taskIndex = this.props.navigation.getParam("taskIndex");
        const JobId = this.props.navigation.getParam("JobId");
        if(this.props.ShowCamera === 3){
            this.props.TurnOffCamera()
        }else{
            let newDecal = this.props.Jobs[JobId].Tasks[taskIndex].NewDecal.length === 0 ? this.state.NewDecal : this.props.Jobs[JobId].Tasks[taskIndex].NewDecal;
        
        // check duplication of new decal.
        console.log(this.props.Jobs[JobId].Tasks[taskIndex].FinishTime)
        if(this.props.Jobs[JobId].Tasks[taskIndex].FinishTime === 'N/A'){
             if(this.props.UsedDecal.includes(newDecal)){
                Alert.alert(
                    'Decal already used',
                    'Scan another decal.'
                )
            }else{
                this.props.saveNewDecal(newDecal,JobId, taskIndex);
      this.props.navigation.navigate("RHTasks", { JobId: JobId, taskIndex: taskIndex })
          }
        }
           else{
                  this.props.saveNewDecal(newDecal,JobId, taskIndex);
        this.props.navigation.navigate("RHTasks", { JobId: JobId, taskIndex: taskIndex })
            }
      
        }
        
    }
    checkDuplicationDecal(decal){

    }
    componentDidMount(){
        this.props.navigation.setParams({ SaveAndExit:this.SaveAndExit });
    }
    render() {
        let bottomContinueButtonStyle = (Platform.OS ==='ios')? styles.bottomContinueButtoniOS :styles.bottomContinueButtonAndroid;
        if (this.props.Jobs.length === 0) {
            return null
        }
        else {


            const taskIndex = this.props.navigation.getParam("taskIndex");
            const JobId = this.props.navigation.getParam("JobId");
            //console.log(this.props.ShowCamera)
            let newDecal = this.props.Jobs[JobId].Tasks[taskIndex].NewDecal.length === 0 ? this.state.NewDecal : this.props.Jobs[JobId].Tasks[taskIndex].NewDecal
            
            return (


                this.props.ShowCamera === 3 ?

                    <DecalBarcodeReadScreen updateDecal={this.updateNewDecal} />
                    :
                    <View style={{flex:1}} >
                        <View style={{ flexDirection: "row", borderBottomColor: "#d6d6d6", borderBottomWidth: 2, padding: 10 }}>
                            <ProgressCircle
                                percent={100}
                                radius={25}
                                borderWidth={5}
                                color="#4f962b"
                                shadowColor="#d6d6d6"
                                bgColor="#fff"
                            >
                                <Text style={{ fontSize: 10 }}>{'100%'}</Text>
                            </ProgressCircle>
                            <View style={{ justifyContent: "center", alignItems: "center", marginLeft: 20 }}>
                                <Text style={{ fontSize: 20, color: "black" }}>Scan {this.props.Jobs[JobId].Tasks[taskIndex].Result} Decal</Text>
                            </View>

                        </View>
                        <View style={styles.textPreview}>
                            <Input label={`Rangehood ${this.props.Jobs[JobId].Tasks[taskIndex].Result} Decal`} labelStyle={{ color: "black" }} placeholder={`Scan or enter the decal`}
                                onChangeText={(text) => this.setState({ NewDecal: text })}
                                onFocus={()=>{this.setState({NewDecal:this.props.Jobs[JobId].Tasks[taskIndex].NewDecal},()=>{this.props.overWriteNewDecal(JobId,taskIndex)})}}
                                //defaultValue={(this.props.Jobs[JobId].Tasks[taskIndex].newDecal=== null) ? '':this.props.Jobs[JobId].Tasks[taskIndex].newDecal}
                                // value = {this.state.NewDecal}
                                value={this.props.Jobs[JobId].Tasks[taskIndex].NewDecal.length === 0 ? this.state.NewDecal : this.props.Jobs[JobId].Tasks[taskIndex].NewDecal}
                            ></Input>
                            <View style={{ flexDirection: "row", justifyContent: "center",marginVertical:20}}>
                                <Button type="outline" title="SCAN" 
                                buttonStyle={{ width: "80%" }}
                                containerStyle={{ }}
                                onPress={() => this.props.TurnOnNewDecalCamera()}>
                            </Button>
                            </View>
                            
                        </View>

                        <Button type="solid" title="PREVIEW" raised
                            
                            buttonStyle={[bottomContinueButtonStyle,{backgroundColor:"#fcbd1e"}]}
                            disabled={newDecal.length === 0}
                            containerStyle={styles.bottomContinueButtonContainer}
                            onPress={() => {
                                //ONLY SAVE NEW DECAL HERE, UPDATE STATUS TO COMPLETE IN PREVIEW PAGE. NEED MODIFICATION

                                if(this.props.Jobs[JobId].Tasks[taskIndex].FinishTime === 'N/A'){
                                    if(this.props.UsedDecal.includes(newDecal)){
                                       Alert.alert(
                                           'Decal already used',
                                           'Scan another decal.'
                                       )
                                   }else{
                                    this.props.saveNewDecal(newDecal, JobId, taskIndex);
                                this.props.navigation.navigate('RHTaskSummary', { JobId: JobId, taskIndex: taskIndex,showButton:true })
                                }
                               }else{
                                    this.props.saveNewDecal(newDecal, JobId, taskIndex);
                                this.props.navigation.navigate('RHTaskSummary', { JobId: JobId, taskIndex: taskIndex,showButton:true })
                                }

                                
                            }}>
                        </Button>

                    </View>

            );
        }
    }
}
const mapStateToProps = (state) => {
    return {
        Jobs: state.RHJobsReducer.Jobs,
        ShowCamera: state.RHJobsReducer.ShowCamera,
        UsedDecal:state.RHJobsReducer.UsedDecal
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveNewDecal(NewDecal, JobId, taskIndex) {
            const action = {
                type: "Save_New_Decal",
                NewDecal,
                JobId,
                taskIndex,
            }
            dispatch(action)
        },
        TurnOnNewDecalCamera() {
            const action = {
                type: "Turn_On_New_Decal_Camera",
            }
            dispatch(action)
        },
        TurnOffCamera() {
            const action = {
                type: "Turn_Off_Camera",
            }
            dispatch(action)
        },
        overWriteNewDecal(JobId,taskIndex){
            const action ={
                type:"OverWrite_New_Decal",
                JobId,
                taskIndex,
            }
            dispatch(action)
        }


    }

}
export default connect(mapStateToProps, mapDispatchToProps)(NewDecalScreen)
