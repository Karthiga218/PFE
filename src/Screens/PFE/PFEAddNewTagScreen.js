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

class PFEAddNewTagScreen extends Component {
  constructor(props) {
    super(props);
    // this.state = { status: 'N/A' }
    // this.updateStatus = this.updateStatus.bind(this);

    this.state = {
      pfetag: ""
    };
    this.updateBarcode = this.updateBarcode.bind(this);

    this._didFocusSubscription = props.navigation.addListener(
      "didFocus",
      payload =>
        BackHandler.addEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );

    this.props.TurnOffCamera();

    console.log("PFEAddNewTagScreen main");
  }
  onBackButtonPressAndroid = () => {
    console.log("back pressed");

    this.props.navigation.navigate("PFEStartService");

    return true;
  };
  updateBarcode(data) {
    this.setState({ pfetag: data });
  }
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          flexDirection: "row"
        }}
      >
        <Text style={{ fontSize: 20, color: "white" }}>New Tag</Text>
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
              percent={90}
              radius={25}
              borderWidth={5}
              color="#4f962b"
              shadowColor="#d6d6d6"
              bgColor="#fff"
            >
              <Text style={{ fontSize: 10 }}>{"90%"}</Text>
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
                Enter or scan the new tag
              </Text>
            </View>
          </View>

          <View>
            <View style={styles.textPreview}>
              <Input
                label={"PFE tag"}
                labelStyle={{ color: "black" }}
                placeholder={"PFE tag"}
                // leftIcon={barcodeScanIcon}
                value={this.state.pfetag}
                onChangeText={text => this.setState({ pfetag: text })}
              />
            </View>
            <Button
              type="outline"
              title="SCAN"
              raised
              buttonStyle={{ width: "100%" }}
              containerStyle={{ marginHorizontal: 80, marginVertical: 10 }}
              onPress={() => this.props.TurnOnNewPFETagCamera()}
            />
          </View>

          <Button
            type="solid"
            title="FINISH"
            raised
            containerStyle={styles.bottomContinueButtonContainer}
            buttonStyle={bottomContinueButtonStyle}
            onPress={() => {
              this.props.updateTask(JobId, taskIndex, this.state.pfetag);
              this.props.navigation.navigate("PFETasks", {
                JobId: JobId,
                taskIndex: taskIndex
              });
              // this.props.CheckPrecipitatorStatus(this.state.status, JobId);
              // this.props.navigation.navigate('Tasks', { JobId: JobId })
            }}
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
        type: "Update_Task",
        JobId,
        taskIndex,
        pfetag,
        step: 3
      };
      dispatch(action);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PFEAddNewTagScreen);
