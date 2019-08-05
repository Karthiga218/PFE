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
  TextInput
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import {
  Button,
  Input,
  CheckBox,
  Text,
  Divider,
  Overlay
} from "react-native-elements";
import { connect } from "react-redux";
import moment from "moment";
import Spinner from "react-native-loading-spinner-overlay";

class PFEJobSummaryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isVisible: false,
      isConnected: null
    };
  }

  static navigationOptions = () => ({
    headerTitle: (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        <Text style={{ right: "50%", color: "white", fontSize: 20 }}>
          Job Summary
        </Text>
      </View>
    ),
    headerTintColor: "white",
    headerTitleStyle: {
      color: "white"
    },
    headerStyle: {
      backgroundColor: "#e61616"
    }
  });

  handleSubmitJob(JobId) {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        this.submitJobtoDb(JobId);
        //this.props.navigation.navigate('RHClients')
      } else {
        this.setState({ isVisible: true });
      }
    });
  }

  submitJobtoDb(JobId) {
    let Job = this.props.Jobs[JobId];
    let RefId = Job.RefId;
    let tasksData = [];
    tasksData = Job.Tasks.map(i => ({
      JobId: RefId,
      TaskId: i.Index,
      Status: i.Status,
      Compliance: i.Result,
      Decal: i.Name,
      SurveyResult: i.SurveyResult,
      NewDecal: i.NewDecal,
      StartTime: moment(i.StartTime).format("MMM DD YYYY HH:mm:ss"),
      FinishTime: moment(new Date()).format("MMM DD YYYY HH:mm:ss")
    }));

    let jobData = {
      JobId: Job.RefId,
      Status: "Completed",
      Tasks: tasksData
    };
    console.log(jobData);
    //call update job api here and complete the job.

    fetch(
      "https://devoci.fdnycloud.org/test/fdnyintegrations/cof/updatehoodjob",
      {
        method: "PUT",
        headers: {
          apikey: "d1257624-1749-4768-84a6-fbe526d6407f",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jobData)
      }
    )
      .catch(err => console.error("Error:", err))
      .then(response => response.json())
      .then(msg => {
        console.log(msg);
        if (msg.status === "Success") {
          this.props.submitJob(JobId);
          Alert.alert("Job Successfully Submitted.", "", [
            {
              text: "Start a New Job",
              onPress: () => this.props.navigation.navigate("RHClients")
            },
            {
              text: "EXIT",
              onPress: () => this.props.navigation.navigate("LogIn")
            },
            { cancelable: false }
          ]);
        } else {
          Alert.alert(
            "Failed to submit the job.",
            "Please try again.",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
        }
      });
  }

  render() {
    const JobId = this.props.navigation.getParam("JobId");
    const Job = this.props.Jobs[JobId];
    console.log("summary for job id = " + JobId);
    console.log(Job);
    const RefId = Job.RefId;
    let formatCreateTime = moment(Job.CreateTime).format("MM/DD/YYYY hh:mm A");
    //     const taskIndex = this.props.navigation.getParam("taskIndex");
    //     const JobId = this.props.navigation.getParam("JobId");
    //    let task = this.props.Jobs[JobId].Tasks[taskIndex]

    let children = (
      <View>
        <View style={{ marign: 10 }}>
          <Text style={{ fontSize: 20 }}>Failed to submit.</Text>
        </View>

        <Divider />
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 14 }}>
            Please enable the network connection of your device and try again.
            Or try later.
          </Text>
        </View>

        <Button
          type="clear"
          title="OK"
          raised
          onPress={() => this.setState({ isVisible: !this.state.isVisible })}
        />
      </View>
    );
    return (
      <View style={{ padding: 20, backgroundColor: "white" }}>
        <Spinner
          visible={this.state.loading}
          textContent={"Submitting..."}
          textStyle={{ color: "#FFF" }}
        />
        <Overlay
          isVisible={this.state.isVisible}
          children={children}
          height="30%"
          onBackdropPress={() =>
            this.setState({ isVisible: !this.state.isVisible })
          }
        />
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {Job.ClientName}
            </Text>
            <Text>
              {Job.ServiceAddress},{Job.AddressLine2}
            </Text>
            <Text>
              {Job.Borough},NY {Job.ZipCode}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {formatCreateTime}
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginVertical: 20 }}>
          {""}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              backgroundColor: "white",
              borderColor: "#ddd",
              shadowColor: "rgb(242, 242, 242)",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 2,
              flex: 1,
              marginRight: 20
            }}
          >
            <View style={{ margin: 10 }}>
              <Text style={{ fontSize: 14 }}>Installed New</Text>
            </View>
            <View style={{ margin: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                {Job.newTasks}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "white",
              borderColor: "#ddd",
              shadowColor: "rgb(242, 242, 242)",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 2,
              flex: 1,
              marginRight: 20
            }}
          >
            <View style={{ margin: 10 }}>
              <Text style={{ fontSize: 14 }}>Serviced</Text>
            </View>
            <View style={{ margin: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                {Job.Tasks.length - Job.newTasks}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Text
            style={{ fontSize: 16, fontWeight: "bold", marginVertical: 20 }}
          >
            {}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
              justifyContent: "center",
              width: "100%"
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderColor: "#ddd",
                shadowColor: "rgb(242, 242, 242)",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
                width: "70%"
              }}
            >
              <View style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>Total PFEs</Text>
              </View>
              <View style={{ margin: 10 }}>
                <Text
                  style={{ fontWeight: "bold", fontSize: 14, color: "blue" }}
                >
                  {Job.Tasks.length}
                </Text>
              </View>
            </View>
            {}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
            marginVertical: 70
          }}
        >
          <Button
            type="solid"
            title="SUBMIT JOB"
            raised
            buttonStyle={{ width: "100%", backgroundColor: "#fcbd1e" }}
            onPress={() => {
              //this.props.submitJob(JobId);
              this.handleSubmitJob(JobId);
              //this.props.navigation.navigate('RHClients')
              //submit job and back to joblist screen
              //need loog out?
              //or keep job for 12 hours
            }}
            //  ONPRESS  SAVE STATUS TO COMPLETED
          />
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    Jobs: state.PFEJobsReducer.Jobs,
    CertType: state.DefaultReducer.CertType
  };
};

const mapDispatchToProps = dispatch => {
  return {
    submitJob(JobId) {
      const action = {
        type: "Submit_Job",
        JobId
      };
      dispatch(action);
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PFEJobSummaryScreen);
