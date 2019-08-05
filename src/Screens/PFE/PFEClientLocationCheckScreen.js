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

import { Button, Input, CheckBox } from "react-native-elements";
import styles from "../../Styles/styles";
import ProgressCircle from "react-native-progress-circle";
import RadioSelector from "../../Components/RadioSelector";
import { connect } from "react-redux";

class PFEClientLocationCheckScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      atLocation: null
    };
    this.checkAtLocation = this.checkAtLocation.bind(this);
    this.checkNotAtLocation = this.checkNotAtLocation.bind(this);
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
        <Text style={{ fontSize: 20, color: "white" }}>Location</Text>
      </View>
    ),
    headerTintColor: "white",
    headerStyle: {
      backgroundColor: "#e61616"
    },
    headerRight: null
  });

  checkAtLocation() {
    this.setState({ atLocation: true });
  }
  checkNotAtLocation() {
    this.setState({ atLocation: false });
  }

  render() {
    const selection = ["Yes", "No"];
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            height: "10%"
          }}
        >
          <Text style={{ fontSize: 20, color: "black", flexWrap: "wrap" }}>
            Are you at the client's location?
          </Text>
        </View>

        <RadioSelector
          title={""}
          selection={selection}
          answer={this.state.atLocation}
          YesCheckBox={this.checkAtLocation}
          NoCheckBox={this.checkNotAtLocation}
        />
        <Button
          type="solid"
          title="NEXT"
          raised
          buttonStyle={{ width: "80%" }}
          containerStyle={{
            position: "absolute",
            bottom: 0,
            flex: 1,
            height: 80,
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
            width: "100%",
            borderTopColor: "rgb(242, 242, 242)",
            borderTopWidth: 1,
            paddingBottom: 10,
            paddingTop: 10
          }}
          onPress={() => {
            if (this.state.atLocation === true) {
              this.props.navigation.navigate("PFELocationConfirm");
            } else {
              this.props.saveServiceAddress("");
              this.props.navigation.navigate("PFEAddressOverWrite");
            }
          }}
          disabled={this.state.atLocation === null}
        />
      </View>
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
    saveServiceAddress(Address) {
      const action = {
        type: "Save_Service_Address",
        Address
      };
      dispatch(action);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PFEClientLocationCheckScreen);
