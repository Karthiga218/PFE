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
import { RNCamera } from "react-native-camera";
import Spinner from "react-native-loading-spinner-overlay";
import styles from "../../Styles/styles";
import { connect } from "react-redux";
import { ListItem, Button, Divider, Overlay } from "react-native-elements";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Tooltip from "react-native-walkthrough-tooltip";
import AsyncStorage from "@react-native-community/async-storage";

export default class plusIconDropList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }
  handlePressServiceButton() {
    console.log("PRESS SERVICE PFE1");
    this.setState({ show: false });
    this.props.navToServiceNowScreen();
  }
  handlePressAddNewButton() {
    console.log("PRESS ADD new PFE");

    this.setState({ show: false });
    this.props.navToPFEAddNewScreen();
  }

  render() {
    return (
      <View>
        {!this.state.show && (
          <TouchableHighlight>
            <FontAwesome5
              name={"plus"}
              size={20}
              color={"white"}
              style={{ marginRight: 20 }}
              //onPress={()=>navigation.navigate("LocationConfirm")}
              //onPress={() => navigation.navigate("ClientInfo")}
              onPress={() => this.setState({ show: true })}
            />
          </TouchableHighlight>
        )}

        {/* <View style={{position:"absolute",right:"40%",flexDirection:"column",height:150}}> */}
        {/* <TouchableHighlight style={{flex:1,backgroundColor:"yellow"}} onPress={()=>console.log("xxxxx")}><Text style={{width:"100%",fontSize:16}} >Service PFE</Text></TouchableHighlight> */}
        {/* <TouchableHighlight style={{flex:1,backgroundColor:"blue"}}   onPress={()=>console.log("Add new PFE")}><Text style={{width:"100%",fontSize:16}} >Add new PFE</Text></TouchableHighlight> */}
        {/* </View> */}
        {/* {
                this.state.show && 
                <View style={{position:"absolute",right:"40%",flexDirection:"column",height:150}}>
                <View style={{backgroundColor:"yellow"}}  onPress={()=>console.log("11111")}><Text style={{width:"100%",fontSize:16,margin:10}} onPress={()=>console.log("11111")}>Service PFE</Text></View>
                <View style={{backgroundColor:"white"}} onPress={()=>console.log("22222")}><Text style={{width:"100%",fontSize:16,margin:10}} onPress={()=>console.log("22222")}>Add New PFE</Text></View>
                </View>
            } */}
        {this.state.show && (
          <Modal transparent={true}>
            <TouchableOpacity
              style={{ height: "100%", width: "100%" }}
              onPress={() => this.setState({ show: false })}
            >
              <View style={{ flexDirection: "column", left: "65%", top: "2%" }}>
                <View style={styles.headerDropDown}>
                  <Text
                    style={{ fontSize: 16, margin: 15 }}
                    onPress={() => this.handlePressServiceButton()}
                  >
                    Service PFE
                  </Text>
                </View>

                <View style={styles.headerDropDown}>
                  <Text
                    style={{ fontSize: 16, margin: 15 }}
                    onPress={() => this.handlePressAddNewButton()}
                  >
                    Add new PFE
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    );
  }
}
