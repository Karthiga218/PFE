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

//Step 4

class PFEServicingScreen extends Component {
  constructor(props) {
    super(props);
    // this.state = { status: 'N/A' }
    // this.updateStatus = this.updateStatus.bind(this);

    console.log("Survey main");
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
        <Text style={{ fontSize: 20, color: "white" }}>Servicing</Text>
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
            navigation.navigate("RHTasks", {
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
      console.log("INDEX +" + taskIndex);
      return (
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
              percent={50}
              radius={25}
              borderWidth={5}
              color="#4f962b"
              shadowColor="#d6d6d6"
              bgColor="#fff"
            >
              <Text style={{ fontSize: 10 }}>{"20%"}</Text>
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
                Servicing in progress
              </Text>
            </View>
          </View>

          <View>
            <View style={styles.textPreview}>
              <Text style={{ fontSize: 15, color: "black" }}>
                After service, attach a new tag to the PFE and press "CONTINUE"
                below.
              </Text>
            </View>
          </View>

          <View>
            <Image
              containerStyle={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                marginVertical: 50
              }}
              source={require("../../image/fe.png")}
            />
          </View>
          <Button
            type="solid"
            title="CONTINUE"
            raised
            buttonStyle={bottomContinueButtonStyle}
            containerStyle={{
              flexDirection: "row",
              justifyContent: "center",
              position: "absolute",
              bottom: 60,
              width: "100%",
              paddingVertical: 10,
              borderTopColor: "rgb(242, 242, 242)",
              borderTopWidth: 1
            }}
            // containerStyle={{position: "absolute", bottom: 60, flex: 1, height: 60, flexDirection: "row", alignContent: "center", justifyContent: "center", width: "100%", borderTopColor: "rgb(242, 242, 242)", borderTopWidth: 1, paddingBottom: 10, paddingTop: 10 }}
            onPress={() => {
              this.props.updateTask(JobId, taskIndex);
              this.props.navigation.navigate("PFEAddNewTag", {
                JobId: JobId,
                taskIndex: taskIndex
              });
            }}
          />
          <Button
            type="outline"
            title="BACK TO PFE LIST"
            raised
            buttonStyle={bottomContinueButtonStyle}
            containerStyle={{
              flexDirection: "row",
              justifyContent: "center",
              position: "absolute",
              bottom: 0,
              width: "100%",
              paddingVertical: 10
            }}
            // containerStyle={{position: "absolute", bottom: 0, flex: 1, height: 60, flexDirection: "row", alignContent: "center", justifyContent: "center", width: "100%", borderTopColor: "rgb(242, 242, 242)", borderTopWidth: 0, paddingBottom: 10, paddingTop: 10 }}
            onPress={() => {
              this.props.navigation.navigate("PFETasks", { JobId: JobId });
            }}
          />
        </View>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    Jobs: state.PFEJobsReducer.Jobs
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateTask(JobId, taskIndex) {
      const action = {
        type: "Update_Task",
        JobId,
        taskIndex,
        step: 2
      };
      dispatch(action);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PFEServicingScreen);
