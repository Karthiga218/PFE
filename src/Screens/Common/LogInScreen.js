import React, { Component } from "react";
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator,
  SafeAreaView
} from "react-navigation";
import {
  AppState,
  Platform,
  StyleSheet,
  CameraRoll,
  Dimensions,
  Picker,
  Alert,
  Modal,
  TouchableOpacity,
  ActionSheetIOS,
  TouchableHighlight,
  View,
  Text,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { Button, Image, Overlay } from "react-native-elements";
import addressCheck from "../../COF_GIS";
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
//log in main screen
//persist data :   12 hours : cof/hood/pfe

class LogInScreen extends Component {
  state = {
    appState: AppState.currentState,
    toolTipVisible: true,
    showIOSPicker: false
  };
  // getData = async () => {
  //     try {
  //         const value = await AsyncStorage.multiGet(['COF', "COF_CertType", "Employer", "Expiration", "HolderName", "Service_Address"])
  //         console.log(value.reduce((a,[k,v])=>({...a,[k]:v}),{}) );
  //     } catch (e) {
  //         console.log(e)
  //     }
  // }
  toBarCodeScan() {
    console.log("Nav to Barcode Screen");
    this.props.navigation.navigate("COFScan");
  }
  toTest() {
    //     this.props.RESET();
    //    this.props.navigation.navigate("RHCleaningProcess")
  }

  toggleIOSPicker() {
    this.setState({ showIOSPicker: !this.state.showIOSPicker });
  }

  // componentDidMount() {
  //     console.log(new Date())
  //     console.log(AppState)
  // }

  componentDidMount() {
    //check network
    NetInfo.fetch().then(state => {
      console.log("Connection type", state.type);
      console.log("Is isConnected?", state.isConnected);
    });

    console.log("didmount,come to foreground");
    AppState.addEventListener("change", this._handleAppStateChange);
    let time = new Date();
    if (this.props.LastLogInTime === null) {
      console.log("No previous Log In ");
    } else {
      console.log(time);
      console.log(new Date(this.props.LastLogInTime));
      let message =
        time - new Date(this.props.LastLogInTime) > 3600000
          ? "Over 60 min"
          : "Within 60 min";
      console.log(message);
      if (time - new Date(this.props.LastLogInTime) > 3600000) {
        this.props.navigation.navigate("LogIn");
        this.props.RESET();
      }
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      let time = new Date();
      console.log(time);
      if (this.props.LastLogInTime === null) {
        console.log("No previous Log In ");
      } else {
        let message =
          time - new Date(this.props.LastLogInTime) > 3600000
            ? "Over 60min "
            : "Within 60min";
        console.log(message);
        if (time - new Date(this.props.LastLogInTime) > 3600000) {
          this.props.navigation.navigate("LogIn");
          console.log("reset!!!");
          this.props.RESET();
        }
      }

      console.log("App has come to the foreground!");
    }
    this.setState({ appState: nextAppState });
  };

  // async testhandlecheckAddress(){
  //     let params ={
  //         borough:"Queens",
  //         house_number:"30-9", //'459' for house_number, 'W 26th St' for street_name
  //         street_name:'34th St',
  //         longitude:`-73.9846558`,
  //         latitude:`40.6943224`,
  //     }
  //     console.log(params)
  //     let result = await addressCheck(params);
  //     console.log("Your distance to the client",result)
  // }

  render() {
    return (
      <View
        // style={{ flex:1, backgroundColor: "white" ,marginVertical:"10%"}}
        style={{
          flex: 1,
          display: "flex",
          backgroundColor: "white",
          marginVertical: "10%",
          marginHorizontal: "5%"
        }}
      >
        <View style={{ flex: 2, justifyContent: "space-around" }}>
          <Image
            resizeMode="contain"
            style={{ height: 300, width: 200 }}
            source={require("./../../image/FDNYLogo.png")}
            containerStyle={{ justifyContent: "center", alignItems: "center" }}
          />
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: "black",
                textAlign: "center"
              }}
            >
              Welcome
            </Text>
            <Text
              style={{ color: "black", fontSize: 16, marginHorizontal: 20 }}
            >
              Scan your COF card to begin.
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 10, flex: 1 }}>
          <Button
            type="solid"
            title="SCAN COF"
            raised
            buttonStyle={{ width: "100%", backgroundColor: "red" }}
            containerStyle={{ marginHorizontal: 20, marginVertical: 0 }}
            onPress={() => {
              this.toBarCodeScan();
            }}
          />
          {/* <Button  color={"blue"} containerStyle={{marginHorizontal:"20%"}}   onPress={() => this.toggleIOSPicker()} title="Test actionsheetios" /> */}
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            bottom: 0,
            width: "100%",
            position: "absolute"
          }}
        >
          <View>
            <Text style={{ color: "blue" }}>LEGAL/PRIVACY</Text>
          </View>
          <View>
            <Text style={{ color: "black" }}>
              All access to and use of this App subject to Privacy Statement and
              govemed by End User License Agreement and Terms of Service.
            </Text>
          </View>
          <View>
            <Text style={{ color: "black" }}>
              {"\u00A9"} 2019 Fire Department, City of New York
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    LastLogInTime: state.DefaultReducer.LogInTime
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addClient(client) {
      const action = {
        type: "Add_Client",
        client
      };
      console.log(action);
      dispatch(action);
    },
    RESET() {
      const action = {
        type: "RESET"
      };
      dispatch(action);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogInScreen);
