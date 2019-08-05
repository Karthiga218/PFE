// this only show with COF P64 type, otherwise not show
import React, { Component } from 'react';
import { Platform, StyleSheet, CameraRoll, Dimensions, Image, Alert, TouchableOpacity, TouchableHighlight, Modal, Picker, FlatList, SectionList, View, Text, TextInput } from 'react-native';

import { Button, Input, CheckBox } from 'react-native-elements';
import styles from '../../Styles/styles';
import ProgressCircle from 'react-native-progress-circle';
import RadioSelector from '../../Components/RadioSelector';
import { connect } from 'react-redux';


//Step 3

class PrecipitatorStatusScreen extends Component {

    constructor(props) {
        super(props);
        // this.state = { status: 'N/A' }
        // this.updateStatus = this.updateStatus.bind(this);
        this.checkStatusYes = this.checkStatusYes.bind(this);
        this.checkStatusNo = this.checkStatusNo.bind(this);
        this.checkServiceYes = this.checkServiceYes.bind(this);
        this.checkServiceNo = this.checkServiceNo.bind(this);
        this.checkCompliantYes = this.checkCompliantYes.bind(this);
        this.checkCompliantNo = this.checkCompliantNo.bind(this);
    }


    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <View style={{width:"100%",flexDirection:"row",justifyContent:"center"}}><Text  style={{color:"white",fontSize:20}}>Rangehood Status</Text></View>,
            //headerLeft: null,
            headerStyle: {
                backgroundColor: '#e61616',

            },
            headerTintColor: "white",
            headerRight: (
                <View style={{  }}><Text style={{ color: "white" }} onPress={() => navigation.navigate("RHTasks", { JobId: navigation.getParam("JobId"), taskIndex: navigation.getParam("taskIndex") })}>Save and exit</Text></View>
            )
        }


    };



    checkStatusYes() {
        const JobId = this.props.navigation.getParam("JobId");
        const taskIndex = this.props.navigation.getParam("taskIndex");
        this.props.precipitatorStatusYes(JobId, taskIndex)
    }
    checkStatusNo() {
        const JobId = this.props.navigation.getParam("JobId");
        const taskIndex = this.props.navigation.getParam("taskIndex");
        this.props.precipitatorStatusNo(JobId, taskIndex)
    }
    checkServiceYes() {
        const JobId = this.props.navigation.getParam("JobId");
        const taskIndex = this.props.navigation.getParam("taskIndex");
        this.props.precipitatorServiceYes(JobId, taskIndex)
    }
    checkServiceNo() {
        const JobId = this.props.navigation.getParam("JobId");
        const taskIndex = this.props.navigation.getParam("taskIndex");
        this.props.precipitatorServiceNo(JobId, taskIndex)
    }
    checkCompliantYes() {
        const JobId = this.props.navigation.getParam("JobId");
        const taskIndex = this.props.navigation.getParam("taskIndex");
        this.props.precipitatorCompliantYes(JobId, taskIndex)
    }
    checkCompliantNo() {
        const JobId = this.props.navigation.getParam("JobId");
        const taskIndex = this.props.navigation.getParam("taskIndex");
        this.props.precipitatorCompliantNo(JobId, taskIndex)
    }








    render() {

        let bottomContinueButtonStyle = (Platform.OS ==='ios')? styles.bottomContinueButtoniOS :styles.bottomContinueButtonAndroid;
        if (this.props.Jobs.length === 0) { return null }
        else {


            const JobId = this.props.navigation.getParam("JobId");
            const taskIndex = this.props.navigation.getParam("taskIndex");
            
            const selection = ["Yes", "No"];
            const precipitator = this.props.Jobs[JobId].Tasks[taskIndex].Precipitator;
          
            return (
                <View style={{flex:1}}>
                    <View style={{ flexDirection: "row", borderBottomColor: "#d6d6d6", borderBottomWidth: 2, padding: 10 }}>
                        <ProgressCircle
                            percent={30}
                            radius={25}
                            borderWidth={5}
                            color="#4f962b"
                            shadowColor="#d6d6d6"
                            bgColor="#fff"
                        >
                            <Text style={{ fontSize: 10 }}>{'30%'}</Text>
                        </ProgressCircle>
                        <View style={{ justifyContent: "center", alignItems: "center", marginLeft: 20,flexDirection:"row",flex:1 }}>
                            <Text style={{fontSize: 20, color: "black",flexWrap:"wrap" }}>Is there a precipitator at the premise?</Text>
                        </View>

                    </View>
                <View style={{paddingHorizontal: 10, backgroundColor: "white" }}>
                    <RadioSelector
                        title={""}
                        selection={selection}
                        answer={precipitator.status}
                        YesCheckBox={this.checkStatusYes}
                        NoCheckBox={this.checkStatusNo}
                    />



                    {
                        (precipitator.status === true) ?(<View>
                            <View>
                                <RadioSelector
                                    title={"Did you service this precipitator today?"}
                                    selection={selection}
                                    answer={precipitator.service}
                                    YesCheckBox={this.checkServiceYes}
                                    NoCheckBox={this.checkServiceNo}
                                />
                            </View>
                            {precipitator.service === true ?<View>
                                <RadioSelector
                                    title={"Is the precipitator compliant?"}
                                    selection={selection}
                                    answer={precipitator.compliant}
                                    YesCheckBox={this.checkCompliantYes}
                                    NoCheckBox={this.checkCompliantNo}
                                />
                            </View>:null }
                            </View> ): null

                    }
                </View>
                    
                    <Button type="solid" title="NEXT" raised
                        
                        disabled={this.props.Jobs[JobId].Tasks[taskIndex].Precipitator.status ===null}
                        buttonStyle={bottomContinueButtonStyle}
                        containerStyle={styles.bottomContinueButtonContainer}
                        onPress={() => {

                            this.props.navigation.navigate('RHSurveyMain', { JobId: JobId, taskIndex: taskIndex })
                        }
                        }>
                    </Button>

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

        precipitatorStatusYes(JobId, taskIndex) {
            const action = {
                type: "Precipitator_Status_Yes",
                JobId,
                taskIndex,
            }
            dispatch(action)
        }, precipitatorStatusNo(JobId, taskIndex) {
            const action = {
                type: "Precipitator_Status_No",
                JobId,
                taskIndex,
            }
            dispatch(action)
        }, precipitatorServiceYes(JobId, taskIndex) {
            const action = {
                type: "Precipitator_Service_Yes",
                JobId,
                taskIndex,
            }
            dispatch(action)
        }, precipitatorServiceNo(JobId, taskIndex) {
            const action = {
                type: "Precipitator_Service_No",
                JobId,
                taskIndex,
            }
            dispatch(action)
        }, precipitatorCompliantYes(JobId, taskIndex) {
            const action = {
                type: "Precipitator_Compliant_Yes",
                JobId,
                taskIndex,
            }
            dispatch(action)
        }, precipitatorCompliantNo(JobId, taskIndex) {
            const action = {
                type: "Precipitator_Compliant_No",
                JobId,
                taskIndex,
            }
            dispatch(action)
        },


    }

}


export default connect(mapStateToProps, mapDispatchToProps)(PrecipitatorStatusScreen)
