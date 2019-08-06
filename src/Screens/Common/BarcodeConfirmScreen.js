import React, { Component } from "react";
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator,
  HeaderBackButton
} from "react-navigation";
import {
  Platform,
  StyleSheet,
  CameraRoll,
  Dimensions,
  Image,
  Alert,
  TouchableOpacity,
  BackHandler,
  TouchableHighlight,
  View,
  Text,
  TextInput
} from "react-native";
import { RNCamera } from "react-native-camera";
import Spinner from "react-native-loading-spinner-overlay";
import styles from "../../Styles/styles";
import store from "../../store/storeindex";
import { connect } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import { Button, Divider, Overlay } from "react-native-elements";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// need  to do re-log in

class BarcodeConfirmScreen extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this.state = {
      showSpinner: false,
      loading: false,
      isVisible: false
    };
    this._didFocusSubscription = props.navigation.addListener(
      "didFocus",
      payload =>
        BackHandler.addEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );
  }

  handleConfirmPress(BarCodeResult) {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        this.verify(BarCodeResult);
      } else {
        this.setState({ isVisible: true });
      }
    });
  }

  async verify(BarCodeResult) {
    this.setState({ loading: true });
    return await fetch(
      "https://devoci.fdnycloud.org/test/fdnyintegrations/cof/getcofinfo/" +
        BarCodeResult,
      {
        method: "GET",
        headers: {
          apikey: "d1257624-1749-4768-84a6-fbe526d6407f"
        }
      }
    )
      .then(response => response.json(), err => console.log(err))
      .then(json => {
        console.log(json);
        this.setState({ loading: false });
        this.props.handleValidationResult(json);
        if (json.validateHolder === "YES") {
          this.props.saveCERT(BarCodeResult);
          this.props.navigation.navigate("IDValidated", {
            appMessage: json.appMessage
          });
          // Valid COF case

          //Also Graced Expired COF case, setParams. to the Header title.
        }
        if (json.validateHolder === "NO") {
          this.props.navigation.navigate("IDValidateFail");
          //Invalid COF case
        }
      });
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        <Text style={{ color: "white", fontSize: 20 }}>COF Validation</Text>
      </View>
    ),
    headerTintColor: "white",
    headerTitleStyle: {
      color: "white"
    },
    headerStyle: {
      backgroundColor: "#e61616"
    },
    headerheaderBackTitle: "Back",
    headerRight: (
      <FontAwesome5
        name={"question-circle"}
        color={"white"}
        size={20}
        style={{ marginRight: 20 }}
      />
    ),
    headerLeft: (
      <HeaderBackButton
        title="Back"
        tintColor={"white"}
        backTitleVisible={Platform.OS === "ios"}
        onPress={() => navigation.navigate("LogIn")}
      />
    )
    // headerRight: (
    //     <Image source={require('../image/questionIcon.svg')} ></Image>
    //   ),
  });

  PFEorRH(CertType) {
    if (CertType === "W64" || CertType === "P64") {
      this.props.navigation.navigate("RHClients");
    } else {
      this.props.navigation.navigate("PFEClients");
    }
  }

  ReScanCOFBarcode() {
    this.props.TurnOnCOFCamera();
    this.props.navigation.navigate("COFScan");
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      payload =>
        BackHandler.removeEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );
  }
  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.navigate("LogIn");
    return true;
  };

  render() {
    let bottomContinueButtonStyle =
      Platform.OS === "ios"
        ? styles.bottomContinueButtoniOS
        : styles.bottomContinueButtonAndroid;
    let children = (
      <View>
        <View style={{ marign: 10 }}>
          <Text style={{ fontSize: 20 }}>Failed to validate your COF</Text>
        </View>

        <Divider />
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 14 }}>
            Please enable the network connection of your device and try again.
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

    const { ValidateHolder, CERT, BarCodeResult, CertType } = this.props;
    if (BarCodeResult === "") {
      return null;
    } else {
      let show =
        CERT.length !== 0 &&
        ValidateHolder === "YES" &&
        BarCodeResult === CERT ? (
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Text style={{ fontSize: 16, color: "black", margin: 10 }}>
              Please confirm information:
            </Text>
            <View style={styles.textPreview}>
              <Text style={{ margin: 10, fontSize: 16, color: "black" }}>
                Certificate of Fitness Number:{" "}
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {BarCodeResult}
                </Text>
              </Text>
              <Text style={{ margin: 10, fontSize: 16, color: "black" }}>
                Welcome back. Press{" "}
                <Text style={{ fontWeight: "bold" }}>CONFIRM</Text> to continue
                your work.
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Button
                type="outline"
                title="RESCAN COF"
                raised
                containerStyle={{ width: "50%" }}
                onPress={() => this.ReScanCOFBarcode()}
              />
            </View>

            <Button
              type="solid"
              title="CONFIRM"
              raised
              buttonStyle={bottomContinueButtonStyle}
              containerStyle={styles.bottomContinueButtonContainer}
              onPress={() => this.PFEorRH(CertType)}
            />
          </View>
        ) : (
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Spinner
              visible={this.state.loading}
              textContent={"Loading..."}
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
            <Text style={{ fontSize: 16, color: "black", margin: 10 }}>
              Please confirm information:
            </Text>
            <View style={styles.textPreview}>
              <Text style={{ margin: 10, fontSize: 16, color: "black" }}>
                Certificate of Fitness Number:{" "}
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {BarCodeResult}
                </Text>
              </Text>
              <Text style={{ margin: 10, fontSize: 16, color: "black" }}>
                If the COF number is{" "}
                <Text style={{ fontWeight: "bold" }}>CORRECT</Text>,{"\n"}press{" "}
                <Text style={{ fontWeight: "bold" }}>CONFIRM</Text> to preceed.
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Button
                type="outline"
                title="RESCAN COF"
                raised
                containerStyle={{ width: "50%" }}
                onPress={() => this.ReScanCOFBarcode()}
              />
            </View>

            <Button
              type="solid"
              title="CONFIRM"
              raised
              buttonStyle={bottomContinueButtonStyle}
              containerStyle={styles.bottomContinueButtonContainer}
              onPress={() => this.handleConfirmPress(BarCodeResult)}
            />
          </View>
        );

      return show;
      // <View style={{ flex: 1, flexDirection: "column" }}>
      //     <Text style={{ fontSize: 16, color: "black", margin: 10 }}>Please confirm information:</Text>
      //     <View style={styles.textPreview}>
      //         <Text style={{ margin: 10, fontSize: 16, color: "black" }}>Certificate of Fitness Number: <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{BarCodeResult}</Text></Text>
      //         <Text style={{ margin: 10, fontSize: 16, color: "black" }}>If the COF number is <Text style={{ fontWeight: "bold" }}>CORRECT</Text>,{"\n"}press <Text style={{ fontWeight: "bold" }}>CONFIRM</Text> to preceed.</Text>
      //     </View>
      //     <Button containerStyle={{ flexDirection: "row", justifyContent: "center", margin: 10 }} type="outline" title="RESCAN COF" onPress={() => this.ReScanCOFBarcode()}></Button>

      //     <Button type="solid" title="CONFIRM"
      //         buttonStyle={{ width: "80%" }}
      //         containerStyle={{ position: "absolute", bottom: 0, flex: 1, flexDirection: "row", justifyContent: "center", width: "100%", borderTopColor: "rgb(242, 242, 242)", borderTopWidth: 1, paddingBottom: 10, paddingTop: 10 }}

      //         onPress={() => this.verify(BarCodeResult)}>
      //     </Button>

      // </View>
      //{show}
    }
  }
}

const mapStateToProps = state => {
  return {
    BarCodeResult: state.DefaultReducer.BarCodeResult,
    CERT: state.DefaultReducer.CERT,
    CertType: state.DefaultReducer.CertType,
    ValidateHolder: state.DefaultReducer.ValidateHolder
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleValidationResult(result) {
      const action = {
        type: "Validation_Result",
        appMessage: result.appMessage,
        validateHolder: result.validateHolder,
        fullResponse: result
      };
      dispatch(action);
    },
    TurnOnCOFCamera() {
      const action = {
        type: "Turn_On_COF_Camera"
      };
      dispatch(action);
    },
    saveCERT(BarCodeResult) {
      const action = {
        type: "Save_CERT",
        BarCodeResult
      };
      dispatch(action);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BarcodeConfirmScreen);
