import React, { Component } from "react";
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator,
  navigationOptions
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
  View,
  Text,
  Button,
  TextInput
} from "react-native";
import { RNCamera } from "react-native-camera";
import Camera from "react-native-camera";
import Spinner from "react-native-loading-spinner-overlay";
import styles from "../../Styles/styles";
import { connect } from "react-redux";

// Use this component to scan the Existing / New Decal

class PFEBarcodeReadScreen extends React.Component {
  constructor(props) {
    super(props);
    this._onBarCodeRead = this._onBarCodeRead.bind(this);
  }
  _onBarCodeRead(e) {
    console.log("barcode read....");
    console.log(e.data);
    this.props.TurnOffCamera();
    this.props.updateBC(e.data);
    // this.props.saveBarcodeResult(e.data);
    // this.props.navigation.navigate('BarcodeConfirm');
  }

  render() {
    //console.log(this.props.BarCodeResult)
    //    let JobId = this.props.navigation.getParam("JobId");
    const ShowCamera = this.props.ShowCamera;
    return (
      <View style={{ flex: 1 }}>
        {ShowCamera === 2 || 3 ? (
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            barCodeTypes={[
              RNCamera.Constants.BarCodeType.code128,
              RNCamera.Constants.BarCodeType.code39,
              RNCamera.Constants.BarCodeType.code93,
              RNCamera.Constants.BarCodeType.pdf417
            ]}
            //  onBarCodeRead={this._onBarCodeRead.bind(this)}
            onBarCodeRead={e => this._onBarCodeRead(e, "JobId")}
          />
        ) : (
          <View />
        )}

        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "space-around",
            zIndex: 99
          }}
        >
          <View style={{ flex: 0.7 }}>
            <View
              style={{
                backgroundColor: "rgba(1,1,1,0.6)",
                width: Dimensions.get("window").width,
                height: "100%"
              }}
            />
          </View>
          <View style={{ flex: 0.8, flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  backgroundColor: "rgba(1,1,1,0.6)",
                  width: Dimensions.get("window").width / 12,
                  height: "100%"
                }}
              />
            </View>
            <View style={{ flex: 10 }}>
              <View style={styles.topLeftEdge} />
              <View style={styles.topRightEdge} />
              <View style={styles.bottomLeftEdge} />
              <View style={styles.bottomRightEdge} />
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  backgroundColor: "rgba(1,1,1,0.6)",
                  width: Dimensions.get("window").width / 12,
                  height: "100%"
                }}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                backgroundColor: "rgba(1,1,1,0.6)",
                width: Dimensions.get("window").width,
                height: "100%"
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    //BarCodeResult:state.RHJobsReducer.BarCodeResult,
    ShowCamera: state.PFEJobsReducer.ShowCamera
  };
};
const mapDispatchToProps = dispatch => {
  return {
    TurnOffCamera() {
      const action = {
        type: "Turn_Off_Camera"
      };
      dispatch(action);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PFEBarcodeReadScreen);
