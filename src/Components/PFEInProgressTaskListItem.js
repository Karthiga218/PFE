import React, { Component } from "react";
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import {
  Platform,
  StyleSheet,
  CameraRoll,
  Dimensions,
  Image,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Picker,
  FlatList,
  SectionList,
  View,
  Text,
  TextInput
} from "react-native";

import styles from "../Styles/styles";
import { connect } from "react-redux";
import { ListItem, Button, CheckBox } from "react-native-elements";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ProgressCircle from "react-native-progress-circle";

class PFEInProgressTaskListItem extends Component {
  constructor(props) {
    super(props);
    console.log("PFEInprogress");
    this.state = {
      //deleteSelected: false,
    };
    //this.props.navigation.setParams({ AddTaskAndNavToPreSurvey: this.AddTaskAndNavToPreSurvey.bind(this) })
  }

  checkDelete(index) {
    //     console.log("checkdelete index",index)
    // this.setState({deleteSelected:true},()=>this.props.addDeleteSelection(index))
    this.props.addDeleteSelection(index);
  }
  unCheckDelete(index) {
    if (this.props.selectAll === true) {
      return null;
    } else {
      // this.setState({deleteSelected:false},()=>this.props.removeDeleteSelection(index))
      this.props.removeDeleteSelection(index);
    }
  }

  render() {
    const progress = [
      "New Tag Entry", //10%
      "Servicing in progress", //20%
      "Missing new tag", //90%
      "Completed" //100%%
    ];
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec"
    ];

    const { deleteMode, item, JobId } = this.props;
    let step = item.step;
    let pct = 0;
    if (item.step === 0) {
      pct = 10;
    } else if (item.step === 1) {
      pct = 20;
    } else if (item.step === 2) {
      pct = 90;
    } else if (item.step === 3) {
      pct = 90;
    }

    console.log("JOBID + " + JobId + ":: pct =" + pct + " ... step = " + step);

    //let deleteIcon = (this.state.deleteSelected === true) ? <View style={{marginVertical:10,marginHorizontal:20}}><FontAwesome5 solid name={"check-square"} color={"#4286f4"}  size={25} onPress={()=>this.setState({deleteSelected:false})}/></View> : <View style={{marginHorizontal:20,marginVertical:10}}><FontAwesome5 name={"square"} color={"#4286f4"}  size={25} onPress={()=>this.setState({deleteSelected:true})} /></View>
    let deleteIcon = (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text size={8}>{pct}%</Text>
        <CheckBox
          containerStyle={{ padding: 0, margin: 0 }}
          checkedIcon={
            <FontAwesome5
              solid
              name={"check-square"}
              color={"#4286f4"}
              size={25}
              onPress={() => this.unCheckDelete(item.Index)}
            />
          }
          uncheckedIcon={
            <FontAwesome5
              name={"square"}
              color={"#4286f4"}
              size={25}
              onPress={() => this.checkDelete(item.Index)}
            />
          }
          checked={this.props.deleteSelection.includes(item.Index)}
        />
      </View>
    );
    let progressIndicator = (
      <ProgressCircle
        percent={pct}
        radius={25}
        borderWidth={5}
        color="#4f962b"
        shadowColor="#d6d6d6"
        bgColor="#fff"
      >
        <Text style={{ fontSize: 10 }}>{`${pct}%`}</Text>
      </ProgressCircle>
    );
    let taskRightIcon = deleteMode === true ? deleteIcon : progressIndicator;
    let name = item.Name || item.ExistingName;
    console.log("cert type=" + this.props.CertType);
    return (
      <TouchableOpacity
        disabled={deleteMode}
        onPress={() => {
          if (item.step === 2) {
            this.props.navigationNavigate("PFEAddNewTag", {
              JobId: JobId,
              taskIndex: item.Index
            });
            return;
          }
          if (item.step === 1) {
            this.props.navigationNavigate("PFEServicing", {
              JobId: JobId,
              taskIndex: item.Index
            });
            return;
          }
          this.props.navigationNavigate("PFEStartService", {
            JobId: JobId,
            taskIndex: item.Index
          });
        }}
      >
        <View
          style={{
            flexDirection: "row",
            borderTopColor: "#6d6d6d",
            borderTopWidth: 0,
            borderBottomColor: "#bdbdbd",
            borderBottomWidth: 1,
            height: 60,
            alignItems: "center"
          }}
        >
          <View
            style={{ flexDirection: "column", flex: 1, alignItems: "center" }}
          >
            <Text style={{ fontSize: 16 }}>
              {month[new Date(item.StartTime).getMonth()]}
            </Text>
            <Text style={{ fontSize: 16 }}>
              {new Date(item.StartTime).getDate()}
            </Text>
          </View>
          <View style={{ flexDirection: "column", flex: 4 }}>
            <Text style={{ fontSize: 16 }}>{`PFE tag# ${name}`}</Text>
            <Text style={{ fontSize: 12 }}>{progress[item.step]}</Text>
          </View>
          <View
            style={{
              flex: 1.5,
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            {taskRightIcon}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => {
  return {
    Jobs: state.PFEJobsReducer.Jobs
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addTask(JobId) {
      const action = {
        type: "Add_Task",
        JobId
      };
      //console.log(action)
      dispatch(action);
    }
  };
};

export default connect(
  mapStateToProps,
  null
)(PFEInProgressTaskListItem);
