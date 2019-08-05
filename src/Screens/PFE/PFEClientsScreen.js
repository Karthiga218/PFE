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
  BackHandler,
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
import { ListItem, Button } from "react-native-elements";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Tooltip from "react-native-walkthrough-tooltip";
import AsyncStorage from "@react-native-community/async-storage";

class PFEClientsScreen extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this.state = {
      isVisible: null
    };
    this._didFocusSubscription = props.navigation.addListener(
      "didFocus",
      payload =>
        BackHandler.addEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );
    //this.props.navigation.setParams({ isVisible: this.state.isVisible })
  }

  static navigationOptions = ({ navigation }) => {
    let isVisible = navigation.getParam("isVisible");
    return {
      headerTitle: (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center"
          }}
        >
          <Text style={{ color: "white", fontSize: 20 }}>PFE Clients</Text>
        </View>
      ),
      headerLeft: <View />,
      //headerLeft: <Text style={{ fontSize: 20, paddingLeft: 20, color: "white", fontWeight: "bold" }}>Clients</Text>,
      headerStyle: {
        backgroundColor: "#e61616"
      },
      headerRight: (
        <View style={{ flexDirection: "row", marginRight: 10 }}>
          {/* <PlusIconDropList handlePressServiceButton={handlePressServiceButton}/> */}
          <Tooltip
            isVisible={isVisible}
            content={
              <Text
                style={{
                  marginVertical: 30,
                  marginHorizontal: 50,
                  fontSize: 20
                }}
              >
                Press + to ADD a client.
              </Text>
            }
            placement="left"
            onClose={navigation.getParam("closeTooltips")}
          >
            <TouchableHighlight>
              <FontAwesome5
                name={"plus"}
                size={20}
                color={"white"}
                style={{ marginRight: 20 }}
                onPress={() => navigation.navigate("PFEClientLocationCheck")}

                //onPress={() => navigation.navigate("ClientInfo")}
              />
            </TouchableHighlight>
          </Tooltip>
        </View>
      )
    };
  };

  closeTooltips = () => {
    this.setState({ isVisible: false }, () =>
      this.props.navigation.setParams({ isVisible: this.state.isVisible })
    );
  };
  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      payload =>
        BackHandler.removeEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );

    //AsyncStorage.removeItem("alreadyLaunched")
    AsyncStorage.getItem("alreadyPFELaunched").then(value => {
      if (value == null) {
        AsyncStorage.setItem("alreadyPFELaunched", "true");
        this.setState({ isVisible: true }, () =>
          this.props.navigation.setParams({ isVisible: this.state.isVisible })
        );
      } else
        this.setState({ isVisible: false }, () =>
          this.props.navigation.setParams({ isVisible: this.state.isVisible })
        );
    });

    this.props.navigation.setParams({ closeTooltips: this.closeTooltips });
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
    let inProgressJobs = this.props.Jobs.filter(i => i.Status === "ACTIVE");
    let completedJobs = this.props.Jobs.filter(i => i.Status === "COMPLETED");
    let inProgressJobsCountString =
      inProgressJobs.length === 0
        ? ""
        : inProgressJobs.length === 1
        ? " - 1 Client"
        : ` - ${inProgressJobs.length} Clients`;
    let completedJobsCountString =
      completedJobs.length === 0
        ? ""
        : completedJobs.length === 1
        ? " - 1 Client"
        : ` - ${completedJobs.length} Clients`;
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec"
    ];

    return (
      <View>
        <View>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 5,
              width: "100%",
              backgroundColor: "#bdbdbd",
              borderBottomColor: "#bdbdbd",
              borderBottomWidth: 1
            }}
          >
            <Text
              style={{
                fontSize: 20,
                textAlign: "center",
                color: "#EEEEEE",
                fontWeight: "bold"
              }}
            >
              IN PROGRESS{inProgressJobsCountString}
            </Text>
          </View>

          {inProgressJobs.length != 0 ? (
            <View>
              {inProgressJobs.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    this.props.navigation.navigate("PFETasks", {
                      JobId: item.Id
                    })
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      borderTopColor: "#6d6d6d",
                      borderTopWidth: 0,
                      borderBottomColor: "#bdbdbd",
                      borderBottomWidth: 1,
                      height: 60,
                      alignItems: "center"
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        flex: 1,
                        alignItems: "center"
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>
                        {month[new Date(item.CreateTime).getMonth()]}
                      </Text>
                      <Text style={{ fontSize: 16 }}>
                        {new Date(item.CreateTime).getDate()}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "column", flex: 4 }}>
                      <Text style={{ fontSize: 18 }}>{item.ClientName}</Text>

                      <Text style={{ fontSize: 12 }}>
                        {item.ServiceAddress}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        flex: 1,
                        alignItems: "center"
                      }}
                    >
                      <Text style={{ color: "red", fontSize: 16 }}>
                        {
                          item.Tasks.filter(i => i !== null).filter(
                            i => i.Status !== "DELETED"
                          ).length
                        }
                      </Text>
                      <Text style={{ color: "red", fontSize: 12 }}>PFEs</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 50
              }}
            >
              <Text style={{ fontSize: 16 }}> </Text>
              <Text style={{ fontSize: 16, color: "red" }}>
                Press + to ADD a new client.
              </Text>
            </View>
          )}
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 5,
              width: "100%",
              backgroundColor: "#bdbdbd",
              borderTopColor: "#bdbdbd",
              borderTopWidth: 0,
              borderBottomColor: "#bdbdbd",
              borderBottomWidth: 1
            }}
          >
            <Text
              style={{
                fontSize: 20,
                textAlign: "center",
                color: "#EEEEEE",
                fontWeight: "bold"
              }}
            >
              COMPLETED{completedJobsCountString}
            </Text>
          </View>

          {completedJobs.length != 0 ? (
            <View>
              {completedJobs.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  //onPress={() => this.props.navigation.navigate('Tasks', { JobId: index })}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      borderTopColor: "#6d6d6d",
                      borderTopWidth: 0,
                      borderBottomColor: "#6d6d6d",
                      borderBottomWidth: 0,
                      height: 60,
                      alignItems: "center"
                    }}
                  >
                    <View style={{ flexDirection: "column", flex: 1 }}>
                      <Text style={{ fontSize: 16 }}>
                        {month[new Date(item.CreateTime).getMonth()]}
                      </Text>
                      <Text style={{ fontSize: 16 }}>
                        {new Date(item.CreateTime).getDate()}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "column", flex: 4 }}>
                      <Text style={{ fontSize: 18 }}>{item.ClientName}</Text>
                      <Text style={{ fontSize: 12 }}>
                        FDNY REF ID#{item.RefId}
                      </Text>
                      <Text style={{ fontSize: 12 }}>
                        {item.ServiceAddress}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        flex: 1,
                        alignItems: "center"
                      }}
                    >
                      <Text style={{ color: "blue", fontSize: 16 }}>
                        {
                          item.Tasks.filter(i => i !== null).filter(
                            i => i.Status === "COMPLETED"
                          ).length
                        }
                      </Text>
                      <Text style={{ color: "blue", fontSize: 12 }}>Hoods</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 50,
                borderBottomColor: "#bdbdbd",
                borderBottomWidth: 0,
                backgroundColor: "#FFFFFF"
              }}
            >
              <Text style={{ fontSize: 16 }}> </Text>
            </View>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
            top: 30,
            justifyContent: "center"
          }}
        >
          <Text style={{ fontSize: 14, color: "#bdbdbd" }}>
            Clients are shown here for up to 12 hours.
          </Text>
        </View>

        {/* <Button title={"RESET"} onPress={() => this.props.RESET()} /> */}
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
    addClient(client) {
      const action = {
        type: "Add_Client",
        client
      };

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
)(PFEClientsScreen);
