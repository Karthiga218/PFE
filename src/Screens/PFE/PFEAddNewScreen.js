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
  BackHandler,
  SafeAreaView
} from "react-native";
import { HeaderBackButton } from "react-navigation";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {
  Button,
  Input,
  CheckBox,
  SearchBar,
  Icon
} from "react-native-elements";
//import styles from '../../Styles/styles';
import ProgressCircle from "react-native-progress-circle";
import RadioSelector from "../../Components/RadioSelector";
import { connect } from "react-redux";
import HeaderSearchBar from "./HeaderSearchBar";
import { tsImportEqualsDeclaration } from "@babel/types";
import PFEBarcodeReadScreen from "../Common/PFEBarcodeReadScreen";

class PFEAddNewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      enterTag: "",
      searchMode: false,
      list: [],
      origList: [],
      unsavedChanges: false,
      deleteMode: false,
      selectAll: false,
      deleteSelection: []
    };

    this.addTag = this.addTag.bind(this);
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
  }

  handleCancelButtonClick() {
    this.setState(
      {
        deleteMode: false,
        selectAll: false,
        deleteSelection: []
      },
      () =>
        this.props.navigation.setParams({
          deleteMode: this.state.deleteMode,
          selectAll: this.state.selectAll
        })
    );
  }

  handleDeleteButtonClick(JobId, deleteSelection) {
    let filteredItems = this.state.list;
    let filteredOrigItems = this.state.origList;
    deleteSelection.map(i => {
      filteredItems = filteredItems.filter(item => item !== i);
      filteredOrigItems = filteredOrigItems.filter(item => item !== i);
    });

    this.setState(
      {
        deleteMode: false,
        selectAll: false,
        deleteSelection: [],
        list: filteredItems,
        origList: filteredOrigItems
      },
      () =>
        this.props.navigation.setParams({
          deleteMode: this.state.deleteMode,
          selectAll: this.state.selectAll
        })
    );
  }

  onBackButtonPressAndroid = () => {
    console.log("back pressed");
    if (this.props.navigation.getParam("unsavedChanges")) {
      Alert.alert(
        "Unsaved Changes",
        "Tags not saved, disregard changes?",
        [
          {
            text: "OK",
            onPress: () => this.props.navigation.navigate("PFETasks")
          },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          }
        ],
        { cancelable: false }
      );
    } else {
      this.props.navigation.navigate("PFETasks");
    }
    return true;
  };
  updateBarcode(data) {
    this.setState({ enterTag: data });
  }
  static navigationOptions = ({ navigation }) => {
    let searchMode = navigation.getParam("searchMode", false);
    let headerTitle = searchMode ? (
      <HeaderSearchBar
        searchFilterFunction={navigation.getParam("searchFilterFunction")}
      />
    ) : null;
    let searchIcon = searchMode ? null : (
      <FontAwesome5
        name={"search"}
        size={24}
        color={"white"}
        style={{ marginRight: 15 }}
        //onPress={()=>navigation.navigate("LocationConfirm")}
        //    onPress={() => navigation.navigate("ClientInfo")}
        onPress={navigation.getParam("enableSearchMode")}
      />
    );
    let saveIcon = (
      <FontAwesome5
        name={"save"}
        size={24}
        color={"white"}
        style={{ marginRight: 15 }}
        onPress={navigation.getParam("savePFE")}
        //    onPress={() => navigation.navigate("ClientInfo")}
      />
    );
    let deleteMode = navigation.getParam("deleteMode", false);
    let selectAll = navigation.getParam("selectAll", false);

    let header = deleteMode
      ? {
          headerLeft: null,
          headerTitle: (
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                flexDirection: "row"
              }}
            >
              <Text style={{ fontSize: 20, color: "white" }}>
                Select Tags to delete
              </Text>
            </View>
          ),

          // headerLeft: <Text style={{ fontSize: 20, paddingLeft: 20, color: "white", fontWeight: "bold" }}>DELETTTTETETETETETE</Text>,
          headerStyle: {
            backgroundColor: "#e61616"
          },
          headerRight: (
            <CheckBox
              checkedIcon={
                <FontAwesome5
                  solid
                  name={"check-square"}
                  color={"white"}
                  size={24}
                  onPress={navigation.getParam("UnSelectAll")}
                />
              }
              uncheckedIcon={
                <FontAwesome5
                  name={"square"}
                  color={"white"}
                  size={24}
                  onPress={navigation.getParam("SelectAll")}
                />
              }
              checked={selectAll}
            />
          )
        }
      : {
          headerTitle: headerTitle,
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: "#e61616"
          },
          headerLeft: (
            <HeaderBackButton
              title="Back"
              tintColor={"white"}
              backTitleVisible={Platform.OS === "ios"}
              onPress={() => {
                if (navigation.getParam("unsavedChanges")) {
                  Alert.alert(
                    "Unsaved Changes",
                    "Tags not saved, disregard changes?",
                    [
                      {
                        text: "OK",
                        onPress: () => navigation.navigate("PFETasks")
                      },
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      }
                    ],
                    { cancelable: false }
                  );
                } else {
                  navigation.navigate("PFETasks");
                }
              }}
            />
          ),

          headerRight: (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {searchIcon}
              <FontAwesome5
                name={"trash"}
                size={24}
                color={"white"}
                style={{ marginRight: 15 }}
                onPress={navigation.getParam("DeleteMode")}

                //onPress={()=>navigation.navigate("LocationConfirm")}
                //    onPress={() => navigation.navigate("ClientInfo")}
              />
              {saveIcon}
            </View>
          )
        };
    return header;
  };

  DeleteMode = () => {
    this.setState({ deleteMode: true }, () =>
      this.props.navigation.setParams({ deleteMode: this.state.deleteMode })
    );
  };

  SelectAll = () => {
    let JobId = this.props.navigation.getParam("JobId");
    //let totalactivelength = this.props.Jobs[JobId].Tasks.filter(i =>i!==null).filter(i => i.Status === "ACTIVE").length+this.props.Jobs[JobId].Tasks.filter(i =>i ===null).length
    // [...Array(10).keys()]
    let totalactivelength = this.state.list.length; // this.props.Jobs[JobId].Tasks.length;

    this.setState(
      {
        selectAll: true,
        deleteSelection: this.state.list
      },
      () => this.props.navigation.setParams({ selectAll: this.state.selectAll })
    );
  };
  UnSelectAll = () => {
    this.setState({ selectAll: false, deleteSelection: [] }, () =>
      this.props.navigation.setParams({ selectAll: this.state.selectAll })
    );
  };

  addDeleteSelection(index) {
    this.setState(prevState => ({
      deleteSelection: [...prevState.deleteSelection, index]
    }));
  }
  removeDeleteSelection(index) {
    this.setState(prevState => ({
      deleteSelection: prevState.deleteSelection.filter(i => i != index)
    }));
  }

  addTag(tag) {
    if (tag.length !== 0) {
      let list = this.state.list;

      if (list.includes(tag)) {
        Alert.alert("PFE tag already exists", "Scan another PFE.");
        return;
      }

      list.push(`${tag}`);
      this.setState({ unsavedChanges: true });
      this.props.navigation.setParams({ unsavedChanges: true });
      console.log("xxx", list);
      this.setState({ list: list, origList: list, enterTag: "" });
    } else {
      return null;
    }
  }

  enableSearchMode = () => {
    this.setState({ searchMode: true }, () =>
      this.props.navigation.setParams({ searchMode: this.state.searchMode })
    );
  };

  savePFE = () => {
    if (this.state.origList.length === 0) return;
    const jobId = this.props.navigation.getParam("JobId", "");
    console.log("job4 id = " + jobId);
    this.props.addPFEs(this.state.origList, jobId);
    this.props.navigation.setParams({ unsavedChanges: false });

    Alert.alert("Save success", "PFE - New tags added");
  };
  searchFilterFunction = text => {
    //passing the inserted text in textinput
    const newList = this.state.origList.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      list: newList
    });
  };
  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
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

    this.props.navigation.setParams({
      enableSearchMode: this.enableSearchMode,
      searchFilterFunction: this.searchFilterFunction,
      savePFE: this.savePFE
    });

    this.props.navigation.setParams({
      DeleteMode: this.DeleteMode,
      SelectAll: this.SelectAll,
      UnSelectAll: this.UnSelectAll
    });
  }

  render() {
    const { JobId } = this.props;

    console.log("st3");
    console.log(this.state.list);

    let deleteIcon = "";

    let deleteTotalCount = this.state.selectAll
      ? this.state.list.length
      : this.state.deleteSelection.length;
    let taskButton = this.state.deleteMode ? (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          width: "100%",
          alignItems: "stretch"
        }}
      >
        <View>
          {this.state.list.map((i, index) => (
            <View
              style={{
                flexDirection: "row",
                borderTopColor: "#6d6d6d",
                borderTopWidth: 0,
                borderBottomColor: "#bdbdbd",
                borderBottomWidth: 1,
                height: 60,
                alignItems: "center",
                width: "100%",
                alignSelf: "flex-start"
              }}
              key={index}
            >
              <Text style={{ marginLeft: 10, fontSize: 16 }} key={index}>
                Tag# {i}
              </Text>
              <View
                style={{
                  flexDirection: "column",
                  //  justifyContent: "flex-end",
                  // alignItems: "flex-end",
                  position: "absolute",
                  marginLeft: "85%"
                }}
              >
                <CheckBox
                  containerStyle={{ padding: 0, margin: 0 }}
                  checkedIcon={
                    <FontAwesome5
                      solid
                      name={"check-square"}
                      color={"#4286f4"}
                      size={25}
                      onPress={() => this.removeDeleteSelection(i)}
                    />
                  }
                  uncheckedIcon={
                    <FontAwesome5
                      name={"square"}
                      color={"#4286f4"}
                      size={25}
                      onPress={() => this.addDeleteSelection(i)}
                    />
                  }
                  checked={this.state.deleteSelection.includes(i)}
                />
              </View>
            </View>
          ))}
        </View>

        <View
          style={{
            height: 80,
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            borderTopColor: "rgb(242, 242, 242)",
            borderTopWidth: 0,
            paddingBottom: 20,
            paddingTop: 20
          }}
        >
          <Button
            style="solid"
            title="CANCEL"
            raised
            buttonStyle={{ width: "80%", backgroundColor: "#dddddd" }}
            containerStyle={{
              width: "50%",
              flexDirection: "row",
              justifyContent: "center"
            }}
            onPress={() => this.handleCancelButtonClick()}
          />
          <Button
            style="solid"
            title={`DELETE ${deleteTotalCount}`}
            raised
            buttonStyle={{ width: "80%", backgroundColor: "#ff0000" }}
            containerStyle={{
              width: "50%",
              flexDirection: "row",
              justifyContent: "center"
            }}
            onPress={() =>
              this.handleDeleteButtonClick(JobId, this.state.deleteSelection)
            }
          />
        </View>
      </View>
    ) : this.props.ShowCamera === 4 ? (
      <PFEBarcodeReadScreen updateBC={this.updateBarcode} />
    ) : (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View>
          {this.state.list.map((i, index) => (
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
              key={index}
            >
              <Text style={{ marginLeft: 10, fontSize: 16 }} key={index}>
                Tag# {i}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ position: "absolute", bottom: "3%" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginVertical: 20
            }}
          >
            <Button
              type="outline"
              title="SCAN"
              buttonStyle={{ width: "90%" }}
              containerStyle={{}}
              onPress={() => this.props.TurnOnNewPFETagCamera()}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "baseline",
              backgroundColor: "white",
              paddingBottom: 5,
              marginHorizontal: 5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1
              },
              shadowOpacity: 0.12,
              shadowRadius: 12.22,

              elevation: 3,
              borderRadius: 10
            }}
          >
            <Input
              containerStyle={{ width: "90%" }}
              placeholder="Enter tag"
              value={this.state.enterTag}
              onChangeText={text => this.setState({ enterTag: text })}
            />
            <Icon
              name="send"
              type="material"
              color="#478eff"
              size={35}
              onPress={() => this.addTag(this.state.enterTag)}
            />
          </View>
        </View>
      </View>
    );
    return taskButton;
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

    addPFEs(jobs, JobId) {
      const action = {
        type: "Add_PFE_Jobs",
        jobs,
        JobId
      };

      dispatch(action);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PFEAddNewScreen);
