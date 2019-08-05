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
  TextInput,
  SafeAreaView
} from "react-native";

import { Button, Input, CheckBox } from "react-native-elements";
import styles from "../../Styles/styles";
import ProgressCircle from "react-native-progress-circle";
import RadioSelector from "../../Components/RadioSelector";
import { connect } from "react-redux";
import PFEBarcodeReadScreen from "../Common/PFEBarcodeReadScreen";

//Step 4

class PFEStartServiceScreen extends Component {
  constructor(props) {
    super(props);
    // this.state = { status: 'N/A' }
    this.setHasOldTag = this.setHasOldTag.bind(this);
    this.setHasNoOldTag = this.setHasNoOldTag.bind(this);
    this.updateBarcode = this.updateBarcode.bind(this);

    this.state = {
      pfetag: "",
      hasOldTag: "null"
    };
    this.props.TurnOffCamera();
    console.log("PFESTART");
  }
  updateBarcode = value => {
    this.setState({ pfetag: value });
  };
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          flexDirection: "row"
        }}
      >
        <Text style={{ fontSize: 20, color: "white" }}>PFE Status</Text>
      </View>
    ),
    headerTintColor: "white",
    headerStyle: {
      backgroundColor: "#e61616"
    },
    headerRight: (
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{ color: "white", marginRight: 15 }}
          onPress={() => {
            navigation.navigate("PFETasks", {
              JobId: navigation.getParam("JobId"),
              taskIndex: navigation.getParam("taskIndex")
            });
          }}
        >
          Save and Exit
        </Text>
      </View>
    )
  });

  // updateStatus(answer) {
  //     if (answer === 'Yes') {
  //         return this.setState({ status: 'Compliant' },()=>{this.props.updateTaskResult(this.state.status,this.props.navigation.getParam("JobId"),this.props.navigation.getParam("taskIndex"))})
  //     } else {
  //         return this.setState({ status: 'Non-Compliant' },()=>{this.props.updateTaskResult(this.state.status,this.props.navigation.getParam("JobId"),this.props.navigation.getParam("taskIndex"))})
  //     }
  // }

  setHasOldTag() {
    this.setState({ hasOldTag: "true" });
  }
  setHasNoOldTag() {
    this.setState({ hasOldTag: "false" });
  }

  render() {
    let bottomContinueButtonStyle =
      Platform.OS === "ios"
        ? styles.bottomContinueButtoniOS
        : styles.bottomContinueButtonAndroid;
    if (this.props.Jobs.length === 0) {
      return null;
    } else {
      const taskIndex = this.props.navigation.getParam("taskIndex");
      const JobId = this.props.navigation.getParam("JobId");

      const selection = ["Yes", "No"];
      const currentTask = this.props.Jobs[JobId].Tasks[taskIndex];
      let hasOldTag = null;
      if (this.state.hasOldTag === "null") {
        hasOldTag = null;
      } else if (this.state.hasOldTag === "true") {
        hasOldTag = true;
      } else {
        hasOldTag = false;
      }

      return this.props.ShowCamera === 4 ? (
        <PFEBarcodeReadScreen updateBC={this.updateBarcode} />
      ) : (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              borderBottomColor: "#d6d6d6",
              borderBottomWidth: 2,
              padding: 10
            }}
          >
            <ProgressCircle
              percent={10}
              radius={25}
              borderWidth={5}
              color="#4f962b"
              shadowColor="#d6d6d6"
              bgColor="#fff"
            >
              <Text style={{ fontSize: 10 }}>{"10%"}</Text>
            </ProgressCircle>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                flex: 1
              }}
            >
              <Text style={{ fontSize: 20, color: "black", flexWrap: "wrap" }}>
                Is there a barcode on the old PFE?
              </Text>
            </View>
          </View>

          <RadioSelector
            title={""}
            selection={selection}
            answer={hasOldTag}
            YesCheckBox={this.setHasOldTag}
            NoCheckBox={this.setHasNoOldTag}
          />

          <Text
            h4
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "black",
              marginHorizontal: 20
            }}
          >
            Enter or scan the old tag
          </Text>

          <View>
            <View style={styles.textPreview}>
              <Input
                label={"PFE tag"}
                labelStyle={{ color: "black" }}
                placeholder={"PFE tag"}
                // leftIcon={barcodeScanIcon}
                value={this.state.pfetag}
                onChangeText={text => this.setState({ pfetag: text })}
                editable={this.state.hasOldTag === "true"}
              />
            </View>
            <Button
              type="outline"
              title="SCAN"
              raised
              buttonStyle={{ width: "100%" }}
              containerStyle={{ marginHorizontal: 80, marginVertical: 10 }}
              onPress={() => this.props.TurnOnNewPFETagCamera()}
              disabled={this.state.hasOldTag !== "true"}
            />
          </View>

          <Button
            type="solid"
            title="START SERVICING"
            raised
            containerStyle={styles.bottomContinueButtonContainer}
            buttonStyle={bottomContinueButtonStyle}
            onPress={() => {
              this.props.updateTask(JobId, taskIndex, this.state.pfetag);
              this.props.navigation.navigate("PFEServicing", {
                JobId: JobId,
                taskIndex: this.props.Jobs[JobId].Tasks.length
              });
              // this.props.CheckPrecipitatorStatus(this.state.status, JobId);
              // this.props.navigation.navigate('Tasks', { JobId: JobId })
            }}
            disabled={this.state.hasOldTag === "null"}
          />
        </View>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    Jobs: state.PFEJobsReducer.Jobs,
    ShowCamera: state.PFEJobsReducer.ShowCamera
  };
};

const mapDispatchToProps = dispatch => {
  return {
    TurnOnNewPFETagCamera() {
      const action = {
        type: "Turn_On_New_PFE_Camera"
      };
      dispatch(action);
    },
    TurnOffCamera() {
      const action = {
        type: "Turn_Off_Camera"
      };
      dispatch(action);
    },
    updateTask(JobId, taskIndex, pfetag) {
      const action = {
        type: "Add_PFE_Task",
        JobId,
        taskIndex: -1,
        pfetag,
        step: 1
      };
      dispatch(action);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PFEStartServiceScreen);
