import React, { Component } from "react";
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
import { CheckBox } from "react-native-elements";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

class PFECompletedTaskListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //deleteSelected: false,
    };
    //this.props.navigation.setParams({ AddTaskAndNavToPreSurvey: this.AddTaskAndNavToPreSurvey.bind(this) })
  }

  checkDelete(index) {
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
    // const JobId = this.props.navigation.getParam("JobId");//not working. need pass from props, not nav
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const { deleteMode, item, JobId } = this.props;
    //let deleteIcon = (this.state.deleteSelected === true) ? <View style={{marginVertical:10,marginHorizontal:20}}><FontAwesome5 solid name={"check-square"} color={"#4286f4"}  size={25} onPress={()=>this.setState({deleteSelected:false})}/></View> : <View style={{marginHorizontal:20,marginVertical:10}}><FontAwesome5 name={"square"} color={"#4286f4"}  size={25} onPress={()=>this.setState({deleteSelected:true})} /></View>
    let deleteIcon = (
      <CheckBox
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
    );

    return (
      <TouchableOpacity disabled={deleteMode} onPress={() => {}}>
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
            <Text style={{ fontSize: 16 }}>Tag# {item.Name}</Text>
            <Text style={{ fontSize: 12 }}>{}</Text>
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

      dispatch(action);
    }
  };
};

export default connect(
  mapStateToProps,
  null
)(PFECompletedTaskListItem);
