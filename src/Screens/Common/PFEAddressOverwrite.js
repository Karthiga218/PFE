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
  Keyboard,
  TouchableWithoutFeedback,
  ActionSheetIOS,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Picker,
  View,
  TextInput
} from "react-native";
import { RNCamera } from "react-native-camera";
import Spinner from "react-native-loading-spinner-overlay";
import styles from "../../Styles/styles";
import { connect } from "react-redux";
import {
  ListItem,
  Input,
  Button,
  Text,
  Overlay,
  Divider
} from "react-native-elements";
import RadioSelector from "../../Components/RadioSelector";
import addressCheck from "../../COF_GIS";

class PFEAddressOverWriteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ClientName: "",
      AddressLine1: "",
      AddressLine2: "",
      Borough: "(Required)",
      ZipCode: "",
      isVisible: false,
      loading: false,
      showIOSPicker: false
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
          Client's Info
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

  async addJobToDB(
    cofNum,
    clientName,
    clientAddress1,
    clientAddress2,
    clientBorough,
    clientZip,
    location
  ) {
    this.setState({ loading: true });
    const jobData = {
      cofNum: cofNum,
      clientName: clientName,
      clientAddress1: clientAddress1,
      clientAddress2: clientAddress2,
      clientBorough: clientBorough,
      clientZip: clientZip,
      gpsCoords: [`${location.Latitude}`, `${location.Longitude}`]
    };
    console.log(JSON.stringify(jobData));
    return await fetch(
      "https://devoci.fdnycloud.org/test/fdnyintegrations/cof/addjob",
      {
        method: "POST",
        headers: {
          apikey: "d1257624-1749-4768-84a6-fbe526d6407f",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jobData)
      }
    )
      .then(response => response.json(), err => console.log(err))
      .then(resp => {
        this.setState({ loading: false });

        this.props.addClient(
          clientAddress1,
          clientName,
          clientAddress2,
          clientBorough,
          clientZip,
          resp.jobId
        );
        this.props.navigation.navigate("PFETasks", {
          JobId: this.props.JobsCounter - 1
        });
      });
  }

  AddClientAndNavToTask(
    cofNum,
    ServiceAddress,
    ClientName,
    AddressLine2,
    Borough,
    ZipCode,
    gpsCoords
  ) {
    this.addJobToDB(
      cofNum,
      ClientName,
      ServiceAddress,
      AddressLine2,
      Borough,
      ZipCode,
      gpsCoords
    );
  }

  async handlecheckAddress(
    CERT,
    AddressLine1,
    ClientName,
    AddressLine2,
    Borough,
    ZipCode,
    Location
  ) {
    this.setState({ loading: true });
    let houseNumber = AddressLine1.match(/\d+-\d+|\d+/g)[0];
    let streetName = AddressLine1.replace(houseNumber, "").trim();
    let params = {
      borough: Borough,
      house_number: houseNumber,
      street_name: streetName,
      longitude: `${this.props.Location.Longitude}`,
      latitude: `${this.props.Location.Latitude}`
    };
    console.log(params);
    let result = await addressCheck(params);
    console.log("Your distance to the client", result);
    if (result > 500) {
      this.setState({ isVisible: true, loading: false });
    } else {
      this.setState({ loading: false });
      this.AddClientAndNavToTask(
        CERT,
        AddressLine1,
        ClientName,
        AddressLine2,
        Borough,
        ZipCode,
        Location
      );
    }
  }

  openActionSheetios() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: (options = [
          "Bronx",
          "Brooklyn",
          "Manhattan",
          "Queens",
          "Staten Island",
          "Cancel"
        ]),
        //destructiveButtonIndex: 4,
        cancelButtonIndex: 5
        //   title:'Select borough...',
      },
      buttonIndex => {
        console.log(options[buttonIndex]);
        if (buttonIndex !== 5) {
          this.setState({ Borough: options[buttonIndex] });
        }
      }
    );
  }
  toggleIOSPicker() {
    this.setState({ showIOSPicker: !this.state.showIOSPicker });
  }

  render() {
    let FailMessage = (
      <View>
        <View style={{ marign: 10 }}>
          <Text style={{ fontSize: 20 }}>Failed to find your location</Text>
        </View>

        <Divider />
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 14 }}>
            Please check the address, Ensure GPS is enabled.
          </Text>
        </View>
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 14 }}>
            Move closer to the client's addres and try again.
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

    let boroughPicker =
      Platform.OS === "ios" ? (
        <TouchableOpacity
          onPress={() => this.openActionSheetios()}
          style={{
            borderBottomColor: "grey",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            marginLeft: 10,
            marginRight: 10,
            flex: 1
          }}
        >
          <Text
            h4
            h4Style={{ fontSize: 14, color: "black", fontWeight: "bold" }}
          >
            Borough (Required)
          </Text>
          <View>
            {this.state.Borough === "(Required)" ? (
              <Text
                style={{ fontSize: 20, marginBottom: 10, color: "#C7C7CD" }}
              >
                {this.state.Borough}
              </Text>
            ) : (
              <Text style={{ fontSize: 20, marginBottom: 10 }}>
                {this.state.Borough}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            borderBottomColor: "grey",
            borderBottomWidth: 1,
            marginLeft: 10,
            marginRight: 10,
            flex: 1
          }}
        >
          <Text
            h4
            h4Style={{ fontSize: 14, color: "black", fontWeight: "bold" }}
          >
            Borough
          </Text>
          <Picker
            selectedValue={this.state.Borough}
            mode="dropdown"
            style={{}}
            itemStyle={{}}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({ Borough: itemValue });
            }}
          >
            <Picker.Item
              label="(Required)"
              value={"(Required)"}
              color="#C7C7CD"
            />
            <Picker.Item label="Bronx" value="Bronx" />
            <Picker.Item label="Brooklyn" value="Brooklyn" />
            <Picker.Item label="Queens" value="Queens" />
            <Picker.Item label="Manhattan" value="Manhattan" />
            <Picker.Item label="Staten Island" value="Staten Island" />
          </Picker>
        </View>
      );
    const { ServiceAddress, Location, CERT } = this.props;
    const {
      ClientName,
      AddressLine1,
      AddressLine2,
      Borough,
      ZipCode
    } = this.state;
    return (
      <TouchableWithoutFeedback
        onPress={Platform.OS === "ios" ? Keyboard.dismiss : null}
      >
        <View style={{ flex: 1, flexDirection: "column" }}>
          <Spinner
            visible={this.state.loading}
            textContent={"Loading..."}
            textStyle={{ color: "#FFF" }}
          />
          <Text style={{ fontSize: 16, color: "black", margin: 10 }}>
            Please enter the client's service information.
          </Text>
          <View style={styles.textPreview}>
            <Input
              autoFocus={true}
              label={"Client Name"}
              labelStyle={{ color: "black", fontSize: 14 }}
              placeholder={"Client's Name (Required)"}
              placeholderTextColor={"#C7C7CD"}
              containerStyle={{ marginBottom: 20 }}
              onChangeText={text => this.setState({ ClientName: text })}
            />
            <Input
              label={"Address Line 1"}
              labelStyle={{ color: "black", fontSize: 14 }}
              placeholder={"Address Line 1 (Required)"}
              placeholderTextColor={"#C7C7CD"}
              containerStyle={{ marginBottom: 20 }}
              onChangeText={text => this.setState({ AddressLine1: text })}
            />
            <Input
              inputContainerStyle={{}}
              label={"Address Line 2"}
              labelStyle={{ color: "black", fontSize: 14 }}
              containerStyle={{ marginBottom: 20 }}
              placeholder={"Floor, suite, apt (Optional)"}
              placeholderTextColor={"#C7C7CD"}
              onChangeText={text => this.setState({ AddressLine2: text })}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {boroughPicker}
              {/* <Input label={"ZipCode"} labelStyle={{ color: "black", fontSize: 14 }} inputContainerStyle={{}} containerStyle={{ width: "40%" }} maxLength={5} onChangeText={(zipcode) => this.setState({ ZipCode: zipcode })} keyboardType="numeric" /> */}
              <Input
                label={"ZipCode"}
                labelStyle={{ color: "black", fontSize: 14 }}
                placeholderTextColor={"#C7C7CD"}
                inputContainerStyle={{}}
                containerStyle={{ flex: 1 }}
                placeholder={"(Optional)"}
                maxLength={5}
                onChangeText={zipcode => this.setState({ ZipCode: zipcode })}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "center"
            }}
          >
            {/* <Button type="solid" title="Continue" raised
                        buttonStyle={{ width: "100%" }}
                        disabled={this.state.ClientName.length === 0}
                        // onPress={() => this.props.navigation.navigate('PreSurvey')}
                        onPress={() => this.AddClientAndNavToTask(CERT,ServiceAddress, ClientName, AddressLine2,Borough,ZipCode,Location)}
                        //onPress={()=>console.log("add client ")}
                /> */}

            <Button
              type="solid"
              title="Continue"
              raised
              buttonStyle={{ width: "100%" }}
              disabled={
                this.state.ClientName.length === 0 ||
                this.state.Borough === "(Required)" ||
                this.state.AddressLine1.length === 0
              }
              // onPress={() => this.props.navigation.navigate('PreSurvey')}
              onPress={() =>
                this.handlecheckAddress(
                  CERT,
                  AddressLine1,
                  ClientName,
                  AddressLine2,
                  Borough,
                  ZipCode,
                  Location
                )
              }
              //onPress={()=>console.log("add client ")}
            />
          </View>

          <Overlay
            isVisible={this.state.isVisible}
            children={FailMessage}
            height="30%"
            onBackdropPress={() =>
              this.setState({ isVisible: !this.state.isVisible })
            }
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => {
  return {
    ServiceAddress: state.PFEJobsReducer.ServiceAddress,
    JobsCounter: state.PFEJobsReducer.JobsCounter,
    CERT: state.PFEJobsReducer.CERT,
    Location: state.PFEJobsReducer.Location
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addClient(
      ServiceAddress,
      ClientName,
      AddressLine2,
      Borough,
      ZipCode,
      RefId
    ) {
      const action = {
        type: "Add_PFE_Job",
        ServiceAddress,
        ClientName,
        AddressLine2,
        Borough,
        ZipCode,
        RefId
      };

      dispatch(action);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PFEAddressOverWriteScreen);
