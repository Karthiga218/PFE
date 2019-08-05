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
  View,
  Text,
  Button,
  TextInput,
  ScrollView
} from "react-native";
import { RNCamera } from "react-native-camera";
import Spinner from "react-native-loading-spinner-overlay";
import styles from "../../Styles/styles";
import { connect } from "react-redux";
import nearestAddress from "../../nearestAddress";
import { ListItem, Divider, Overlay } from "react-native-elements";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import NetInfo from "@react-native-community/netinfo";

class PFELocationConfirmScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isVisible: false,
      isConnected: null
    };
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
        <Text style={{ color: "white", fontSize: 20 }}>Client's Location</Text>
      </View>
    ),
    headerTintColor: "white",
    headerTitleStyle: {
      color: "white"
    },
    headerStyle: {
      backgroundColor: "#e61616"
    }
    // headerRight: (
    //     <View style={{flexDirection:"row"}}><FontAwesome5 name={"trash"} color={"white"} style={{marginRight:20}} size={20}/><FontAwesome5 name={"plus"} size={20} color={"white"} style={{marginRight:20}}
    //     //onPress={()=>navigation.navigate("LocationConfirm")}
    //     onPress={()=>navigation.navigate("ClientInfo")}
    //     /></View>
    //    )
  });

  findCoordinates() {
    navigator.geolocation.getCurrentPosition(
      position => {
        let Latitude = position.coords.latitude;
        let Longitude = position.coords.longitude;

        this.props.saveLocation(Latitude, Longitude);
        this.confirmLocation(Latitude, Longitude);
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: false, timeout: 20000 }
    );
  }

  // findCoordinates() {

  //     const result = [
  //         {
  //             BIN: 3058185,
  //             distance: 73.8,
  //             stAddress: "9 METROTECH CENTER",
  //         }, {
  //             BIN: 3058187,
  //             distance: 99.62,
  //             stAddress: "311 BRIDGE ST",
  //         },{
  //             BIN: 3058999,
  //             distance: 109.62,
  //             stAddress: "15 METROTECH CENTER",
  //         },{
  //             BIN: 3058860,
  //             distance: 129.62,
  //             stAddress: "11 METROTECH CENTER",
  //         },{
  //             BIN: 3058860,
  //             distance: 149.62,
  //             stAddress: "395 FLATBUSH AVENUE EXTENSION",
  //         },{
  //             BIN: 3058860,
  //             distance: 209.62,
  //             stAddress: "11 METROTECH CENTER",
  //         },{
  //             BIN: 3058860,
  //             distance: 299.62,
  //             stAddress: "11 METROTECH CENTER",
  //         },{
  //             BIN: 3058860,
  //             distance: 340.62,
  //             stAddress: "11 METROTECH CENTER",
  //         },{
  //             BIN: 3058860,
  //             distance: 400.62,
  //             stAddress: "11 METROTECH CENTER",
  //         },{
  //             BIN: 3058860,
  //             distance: 450.62,
  //             stAddress: "11 METROTECH CENTER",
  //         },{
  //             BIN: 3058860,
  //             distance: 460.62,
  //             stAddress: "11 METROTECH CENTER",
  //         },{
  //             BIN: 3058860,
  //             distance: 470.62,
  //             stAddress: "11 METROTECH CENTER",
  //         },{
  //             BIN: 3058860,
  //             distance: 500.62,
  //             stAddress: "11 METROTECH CENTER",
  //         }
  //     ]

  //         navigator.geolocation.getCurrentPosition(
  //             position => {
  //                 const Latitude = position.coords.latitude;
  //                 const Longitude = position.coords.longitude;
  //                 console.log(position)
  //                 console.log("Latitude:", Latitude)
  //                 console.log("Longitude", Longitude)
  //                 this.props.saveLocation(Latitude, Longitude);
  //                 this.props.saveNearestAddress(result);
  //             },
  //             error => Alert.alert(error.message),
  //             { enableHighAccuracy: false, timeout: 20000 }

  //         )

  //     }

  async confirmLocation(Latitude, Longitude) {
    let params = {
      longitude: Longitude,
      latitude: Latitude,
      distance: 500
    };

    params.longitude = "-73.949997";
    params.latitude = "40.650002";
    console.log("in1 here lcoation");

    console.log(params);
    let result = await nearestAddress(params);
    this.setState({ loading: false });
    console.log(result);
    this.props.saveNearestAddress(result);
  }

  saveServiceAddress(address, boroghcode, zipcode) {
    this.props.saveServiceAddress(address, boroghcode, zipcode);
    this.props.navigation.navigate("PFEClientInfo");
  }

  componentDidMount() {
    NetInfo.fetch().then(state => {
      console.log("STATE");
      console.log(state);
      if (state.isConnected) {
        this.setState({ loading: true, isConnected: true });
        this.findCoordinates();
      } else {
        this.setState({ isVisible: true, isConnected: false });
      }
    });
  }
  render() {
    const { Latitude, Longitude, NearestAddress } = this.props;
    let children = (
      <View>
        <View style={{ marign: 10 }}>
          <Text style={{ fontSize: 20 }}>Failed to find your location</Text>
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
          onPress={() =>
            this.setState({ isVisible: !this.state.isVisible }, () =>
              this.props.navigation.navigate("PFEClients")
            )
          }
        />
      </View>
    );
    // console.log(NearestAddress.length)
    let AddressList =
      NearestAddress.length === 0 ? (
        <View />
      ) : (
        <ScrollView style={{ height: "98%" }}>
          {NearestAddress.map((l, i) => (
            <ListItem
              bottomDivider={true}
              key={i}
              title={l.stAddress}
              rightTitle={`${Math.round(parseFloat(l.distance))}ft`}
              onPress={() =>
                this.saveServiceAddress(l.stAddress, l.BOROCODE, l.ZIPCODE)
              }
            />
          ))}
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text
              style={{
                color: "blue",
                fontSize: 15,
                marginBottom: 40,
                marginTop: 10
              }}
              onPress={() => this.props.navigation.navigate("AddressOverwrite")}
            >
              Not listed? Add it manually!
            </Text>
          </View>
        </ScrollView>
      );
    return (
      <View>
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
            this.setState({ isVisible: !this.state.isVisible }, () =>
              this.props.navigation.navigate("PFEClients")
            )
          }
        />
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center"
          }}
        >
          <Text style={{ fontSize: 16, color: "black", marginVertical: 5 }}>
            Select a nearby location to service.
          </Text>
        </View>
        <View>
          {this.state.isConnected ? (
            this.props.NearestAddress.length != 0 && <View>{AddressList}</View>
          ) : (
            <View />
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    Latitude: state.PFEJobsReducer.Location.Latitude,
    Longitude: state.PFEJobsReducer.Location.Longitude,
    NearestAddress: state.PFEJobsReducer.NearestAddress,
    ServiceAddress: state.PFEJobsReducer.ServiceAddress
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveLocation(Latitude, Longitude) {
      const action = {
        type: "Save_Location",
        Latitude: Latitude,
        Longitude: Longitude
      };
      dispatch(action);
    },
    saveNearestAddress(AddressList) {
      const action = {
        type: "Save_Nearest_Address",
        AddressList
      };
      dispatch(action);
    },
    saveServiceAddress(Address, BoroughCode, ZipCode) {
      const action = {
        type: "Save_Service_Address",
        Address,
        BoroughCode,
        ZipCode
      };
      dispatch(action);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PFELocationConfirmScreen);
