import React, { Component } from 'react';
import { Platform, StyleSheet, CameraRoll, Dimensions, Image, Alert, TouchableOpacity, TouchableHighlight, Modal, Picker, FlatList, SectionList, View, Text, TextInput } from 'react-native';

import { Button, Input, CheckBox } from 'react-native-elements';
import styles from '../../Styles/styles';
import ProgressCircle from 'react-native-progress-circle';
import RadioSelector from '../../Components/RadioSelector';
import { connect } from 'react-redux';

//Step 4

class SurveyMainScreen extends Component {



    constructor(props) {
        super(props);
        // this.state = { status: 'N/A' }
        // this.updateStatus = this.updateStatus.bind(this);
        this.checkCompliant = this.checkCompliant.bind(this);
        this.checkNonCompliant = this.checkNonCompliant.bind(this);
        console.log("Survey main")
    }


    static navigationOptions = ({ navigation }) => ({
            headerTitle: <View style={{ width: "100%", justifyContent: "center", flexDirection: "row" }}><Text style={{ fontSize: 20, color: "white" }}>Compliance</Text></View>,
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: '#e61616',

            },
            headerRight: (
                <View style={{ flexDirection: "row",marginRight:10}}><Text style={{ color: "white"}} onPress={() => { navigation.navigate("RHTasks", { JobId: navigation.getParam("JobId"), taskIndex: navigation.getParam("taskIndex") }) }}>Save and Exit</Text></View>
            )
            });

    // updateStatus(answer) {
    //     if (answer === 'Yes') {
    //         return this.setState({ status: 'Compliant' },()=>{this.props.updateTaskResult(this.state.status,this.props.navigation.getParam("JobId"),this.props.navigation.getParam("taskIndex"))})
    //     } else {
    //         return this.setState({ status: 'Non-Compliant' },()=>{this.props.updateTaskResult(this.state.status,this.props.navigation.getParam("JobId"),this.props.navigation.getParam("taskIndex"))})
    //     }
    // }
    

    checkCompliant() {
        const taskIndex = this.props.navigation.getParam("taskIndex");
        const JobId = this.props.navigation.getParam("JobId");
        this.props.updateResultCompliant(JobId, taskIndex);
    }
    checkNonCompliant() {
        const taskIndex = this.props.navigation.getParam("taskIndex");
        const JobId = this.props.navigation.getParam("JobId");
        this.props.updateResultNonCompliant(JobId, taskIndex);
    }


    render() {
        let bottomContinueButtonStyle = (Platform.OS ==='ios')? styles.bottomContinueButtoniOS :styles.bottomContinueButtonAndroid;
        if (this.props.Jobs.length === 0) { return null }
        else {

            const taskIndex = this.props.navigation.getParam("taskIndex");
            const JobId = this.props.navigation.getParam("JobId");
           
            const selection = ["Compliant", "Non-Compliant"];
            const currentTask = this.props.Jobs[JobId].Tasks[taskIndex];
            let complianceStatus = null;
            if (currentTask.Result === null) {
                complianceStatus = null;

            } else if (currentTask.Result === 'Compliant') {
                complianceStatus = true;
            } else if (currentTask.Result === 'Non-Compliant') {
                complianceStatus = false;
            }
            let stepStatus = currentTask.Result === null;
           
            return (
                <View style={{flex:1}}>
                    <View style={{ flexDirection: "row", borderBottomColor: "#d6d6d6", borderBottomWidth: 2, padding: 10 }}>
                        <ProgressCircle
                            percent={50}
                            radius={25}
                            borderWidth={5}
                            color="#4f962b"
                            shadowColor="#d6d6d6"
                            bgColor="#fff"
                        >
                            <Text style={{ fontSize: 10 }}>{'50%'}</Text>
                        </ProgressCircle>
                        <View style={{ justifyContent: "center", alignItems: "center",flexDirection:"row",flex:1 }}>
                            <Text style={{fontSize: 20, color: "black",flexWrap:"wrap" }}>Is the Rangehood compliant?</Text>
                        </View>

                    </View>
                    <RadioSelector
                        title={""}
                        selection={selection}
                        answer={complianceStatus}
                        YesCheckBox={this.checkCompliant}
                        NoCheckBox={this.checkNonCompliant}

                    />
                    <Button type="solid" title="NEXT" raised
                        
                        disabled={stepStatus}
                        containerStyle={styles.bottomContinueButtonContainer}
                        buttonStyle={bottomContinueButtonStyle}
                        onPress={() => {
                            ;
                            (complianceStatus === true) ? this.props.navigation.navigate('RHNonCriticalDeficiencyQuestion', { JobId: JobId, taskIndex: taskIndex }) : this.props.navigation.navigate('RHCriticalDeficiencyQuestion', { JobId: JobId, taskIndex: taskIndex })
                            // this.props.CheckPrecipitatorStatus(this.state.status, JobId);
                            // this.props.navigation.navigate('Tasks', { JobId: JobId })
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
        updateResultCompliant(JobId, taskIndex) {
            const action = {
                type: "Check_Compliant",
                JobId,
                taskIndex
            }
            dispatch(action)
        }, updateResultNonCompliant(JobId, taskIndex) {
            const action = {
                type: "Check_NonCompliant",
                JobId,
                taskIndex
            }
            dispatch(action)
        }
    }

}


export default connect(mapStateToProps, mapDispatchToProps)(SurveyMainScreen)
