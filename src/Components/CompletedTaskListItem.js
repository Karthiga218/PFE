import React, { Component } from 'react';
import { Platform, StyleSheet, CameraRoll, Dimensions, Image, Alert, TouchableOpacity, TouchableHighlight, Modal, Picker, FlatList, SectionList, View, Text, TextInput } from 'react-native';
import styles from '../Styles/styles';
import { connect } from 'react-redux';
import { CheckBox } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';



class CompletedTaskListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //deleteSelected: false,
        }
        //this.props.navigation.setParams({ AddTaskAndNavToPreSurvey: this.AddTaskAndNavToPreSurvey.bind(this) })
    }

    checkDelete(index) {
        
        // this.setState({deleteSelected:true},()=>this.props.addDeleteSelection(index))
        this.props.addDeleteSelection(index)

    }
    unCheckDelete(index) {
        if (this.props.selectAll === true) {
            return null
        } else {
       
            // this.setState({deleteSelected:false},()=>this.props.removeDeleteSelection(index))
            this.props.removeDeleteSelection(index)
        }
    }





    render() {
        // const progress = ['Pre-Survey', 'Cleaning in progress', 'Precipitator status check', 'Compliance status check', 'Critical deficiencies check', 'Non-Critical deficiencies check', 'New Decal Entry', ''];
        // const JobId = this.props.navigation.getParam("JobId");//not working. need pass from props, not nav
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        const { deleteMode, item, JobId } = this.props;
        console.log(item,"JOBID_is",JobId)
        //let deleteIcon = (this.state.deleteSelected === true) ? <View style={{marginVertical:10,marginHorizontal:20}}><FontAwesome5 solid name={"check-square"} color={"#4286f4"}  size={25} onPress={()=>this.setState({deleteSelected:false})}/></View> : <View style={{marginHorizontal:20,marginVertical:10}}><FontAwesome5 name={"square"} color={"#4286f4"}  size={25} onPress={()=>this.setState({deleteSelected:true})} /></View>
        let deleteIcon = <CheckBox

            checkedIcon={<FontAwesome5 solid name={"check-square"} color={"#4286f4"} size={25} onPress={() => this.unCheckDelete(item.Index)} />}
            uncheckedIcon={<FontAwesome5 name={"square"} color={"#4286f4"} size={25} onPress={() => this.checkDelete(item.Index)} />}
            checked={this.props.deleteSelection.includes(item.Index)}
        />

        let taskRightIcon = (deleteMode === true) ? deleteIcon : null



        
        let totalCrit= Object.keys(item.SurveyResult["Critical"]).length;
        let totalNoncrit = Object.keys(item.SurveyResult["NonCritical"]).length;
        let deficiencyMessage = '';

        if(totalCrit === 0){
            if(totalNoncrit === 0){ deficiencyMessage = 'No deficiency.'}
            else if(totalNoncrit === 1){deficiencyMessage = `${totalNoncrit} non-critical deficiency.`}
            else{deficiencyMessage =`${totalNoncrit} non-critical deficiencies.`}
        }else if(totalCrit === 1){
            if(totalNoncrit ===0){deficiencyMessage = `${totalCrit} critical deficiency`}
            else if(totalNoncrit ===1){deficiencyMessage =`${totalCrit} critical deficiency and ${totalNoncrit} non-critical deficiency.` }
            else{deficiencyMessage = `${totalCrit} critical deficiency and ${totalNoncrit} non-critical deficiencies.`}
            
        }else{
            if(totalNoncrit === 0){deficiencyMessage = `${totalCrit} critical deficiencies.`}
            else if(totalNoncrit === 1){deficiencyMessage = `${totalCrit} critical deficiencies and ${totalNoncrit} non-critical deficiency.`}
            else{deficiencyMessage = `${totalCrit} critical deficiencies and ${totalNoncrit} non-critical deficiencies.`}
        }
        let newServiceMessage = (item.Name === "New Service") ? "New Service" : ""
        
        let summary = (newServiceMessage === "")? deficiencyMessage:(newServiceMessage +', '+ deficiencyMessage);
        console.log(summary)
        return (


            <TouchableOpacity disabled={deleteMode} onPress={() => this.props.navigationNavigate("RHTaskSummary", { JobId: JobId, taskIndex: item.Index,showButton:false })}>
                <View style={{ flexDirection: "row", borderTopColor: "#6d6d6d", borderTopWidth: 0, borderBottomColor: "#bdbdbd", borderBottomWidth: 1, height: 60, alignItems: "center" }}>

                    <View style={{ flexDirection: "column", flex: 1 ,alignItems:"center"}}>
                        <Text style={{ fontSize: 16 }}>{month[(new Date(item.StartTime)).getMonth()]}</Text>
                        <Text style={{ fontSize: 16 }}>{(new Date(item.StartTime)).getDate()}</Text>
                    </View>
                    <View style={{ flexDirection: "column", flex: 4 }}>
                        <Text style={{ fontSize: 16 }}>Decal# {item.NewDecal}</Text>
                        <Text style={{ fontSize: 12 }}>{summary}</Text>
                    </View >
                    <View style={{ flex: 1.5, justifyContent: "center", flexDirection: "row" }}>
                        {taskRightIcon}
                    </View>

                </View>
            </TouchableOpacity>


        )

    }
}



const mapStateToProps = (state) => {
    return {
        Jobs: state.RHJobsReducer.Jobs
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addTask(JobId) {
            const action = {
                type: "Add_Task",
                JobId
            }
            
            dispatch(action)
        }
    }

}

export default connect(mapStateToProps, null)(CompletedTaskListItem)
