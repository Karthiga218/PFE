import React, { Component } from "react";
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import {
  SafeAreaView,
  Platform,
  StyleSheet,
  ScrollView,
  CameraRoll,
  Dimensions,
  BackHandler,
  Image,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Picker,
  FlatList,
  SectionList,
  View
} from "react-native";

import styles from "../../Styles/styles";
import { connect } from "react-redux";
import {
  ListItem,
  Button,
  Text,
  CheckBox,
  ThemeProvider
} from "react-native-elements";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ProgressCircle from "react-native-progress-circle";
import PFEInProgressTaskListItem from "../../Components/PFEInProgressTaskListItem";
import PFECompletedTaskListItem from "../../Components/PFECompletedTaskListItem";
import PlusIconDropList from "./plusIconDropList";

/////NEED ADD SCROLLVIEW

class PFETasksScreen extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    console.log("PFE TASKS>>>");
    this.state = {
      deleteMode: false,
      selectAll: false,
      deleteSelection: []
    };
    this.props.navigation.setParams({ aaa: this.state.deleteMode });
    this.addDeleteSelection = this.addDeleteSelection.bind(this);
    this.removeDeleteSelection = this.removeDeleteSelection.bind(this);
    this.navigationNavigate = this.navigationNavigate.bind(this);
    //this.props.navigation.setParams({ AddTaskAndNavToPreSurvey: this.AddTaskAndNavToPreSurvey.bind(this) })
    this._didFocusSubscription = props.navigation.addListener(
      "didFocus",
      payload =>
        BackHandler.addEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );
  }

  static navigationOptions = ({ navigation }) => {
    let JobId = navigation.getParam("JobId");
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
                Select PFEs to delete
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
          headerTitle: (
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                flexDirection: "row"
              }}
            >
              <Text style={{ fontSize: 20, color: "white" }}>PFE List</Text>
            </View>
          ),
          // title:"Tasks",
          // headerTitleStyle:{textAlign:'center',alignSelf:"center"},
          // headerLeft: <Text style={{ fontSize: 20, paddingLeft: 20, color: "white", fontWeight: "bold" }}>Tasks</Text>,
          headerStyle: {
            backgroundColor: "#e61616"
          },
          headerTintColor: "white",

          headerRight: (
            <View style={{ flexDirection: "row" }}>
              <FontAwesome5
                name={"trash"}
                color={"white"}
                style={{ marginRight: 20 }}
                size={20}
                onPress={navigation.getParam("DeleteMode")}
              />
              {/* <FontAwesome5 name={"plus"} size={20} color={"white"} style={{ marginRight: 20 }}
                        // onPress={()=>navigation.state.params.AddTaskAndNavToPreSurvey()}
                        onPress={() => navigation.navigate("PreSurvey", { JobId: JobId })}
                    /> */}
              <PlusIconDropList
                navToPFEAddNewScreen={() =>
                  navigation.navigate("PFEAddNew", { JobId: JobId })
                }
                navToServiceNowScreen={() =>
                  navigation.navigate("PFEStartService", { JobId: JobId })
                }
              />
            </View>
          )
        };
    return header;
    // headerLeft: <Text style={{ fontSize: 20, paddingLeft: 20, color: "white", fontWeight: "bold" }}>Tasks</Text>,
    // headerStyle: {
    //     backgroundColor: '#e61616',

    // },
    // headerRight: (
    //     <View style={{ flexDirection: "row" }}><FontAwesome5 name={"trash"} color={"white"} style={{ marginRight: 20 }} size={20} onPress={navigation.getParam('toggleDeleteMode')} /><FontAwesome5 name={"plus"} size={20} color={"white"} style={{ marginRight: 20 }}
    //         // onPress={()=>navigation.state.params.AddTaskAndNavToPreSurvey()}
    //         onPress={() => navigation.navigate("PreSurvey", { JobId: JobId })}
    //     /></View>
    // )
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
    let totalactivelength = this.props.Jobs[JobId].Tasks.length;
    this.setState(
      {
        selectAll: true,
        deleteSelection: [...Array(totalactivelength).keys()]
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
  // AddTaskAndNavToPreSurvey(){
  //     let JobId = this.props.navigation.getParam("JobId");
  //     //console.log(typeof(JobId))
  //     this.props.addTask(JobId);
  //     //this.props.navigation.navigate("PreSurvey");
  // }
  // componentDidMount() {
  //     console.log("didmount")
  //     // this.props.navigation.setParams({ AddTaskAndNavToPreSurvey: this.AddTaskAndNavToPreSurvey.bind(this) });
  //   }

  handleDeleteButtonClick(JobId, deleteSelection) {
    this.props.deleteTasks(JobId, deleteSelection);
    this.setState({ deleteSelection: [] });

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

  navigationNavigate(dest, params) {
    this.props.navigation.navigate(dest, params);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      DeleteMode: this.DeleteMode,
      SelectAll: this.SelectAll,
      UnSelectAll: this.UnSelectAll
    });
  }

  render() {
    // let {width, height} = Dimensions.get('window')
    // console.log("window height",height)
    if (this.props.Jobs.length === 0) {
      return <View />;
    } else {
      const JobId = this.props.navigation.getParam("JobId");
      let jobSubmitValidation =
        this.props.Jobs[JobId] !== undefined &&
        this.props.Jobs[JobId].Tasks !== undefined &&
        this.props.Jobs[JobId].Tasks.filter(i => i !== null).some(
          i => i.Status === "ACTIVE"
        )
          ? false
          : true;
      console.log("JOBSUBMIT VALIDATION", jobSubmitValidation);
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

      let deleteTotalCount = this.state.selectAll
        ? this.props.Jobs[JobId].Tasks.filter(i => i !== null).length
        : this.state.deleteSelection.length === 0
        ? ""
        : this.state.deleteSelection.length;
      let taskButton = this.state.deleteMode ? (
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
      ) : this.props.Jobs[JobId].Tasks.filter(i => i !== null).length ===
        0 ? null : (
        <Button
          type="solid"
          title="PREVIEW"
          raised
          titleStyle={{ fontSize: 18 }}
          buttonStyle={{ width: "80%" }}
          disabled={!jobSubmitValidation}
          containerStyle={{
            marginTop: 20,
            height: 70,
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
            width: "100%",
            borderTopColor: "green",
            borderTopWidth: 0,
            paddingBottom: 20,
            paddingTop: 0
          }}
          onPress={() =>
            this.props.navigation.navigate("PFEJobSummary", { JobId: JobId })
          }
        />
      );

      //console.log(this.props.Jobs[JobId].Tasks.filter(i => i !== null).filter(i => i.Status === "ACTIVE"))
      return (
        <SafeAreaView>
          {/* <View style={{height:"90%",borderColor:"blue",borderWidth:3}}  onLayout={(event) => {
  let mainViewHeight = event.nativeEvent.layout.height
  console.log("Main View Height",mainViewHeight)}}>
                        <View style={{maxHeight:"100%",borderColor:"purple",borderWidth:2}} 
                        onLayout={(event) => {
  let progressListHeight = event.nativeEvent.layout.height
  console.log("Progress List Height",progressListHeight)
  }} > 
                            <Text style={{ fontSize: 20, backgroundColor: "#eaeaea", borderBottomColor: "#6d6d6d", borderBottomWidth: 1, textAlign: "center" }}>IN PROGRESS</Text>
                            {
                                (this.props.Jobs[JobId].Tasks.filter(i => i !== null).filter(i => i.Status === "ACTIVE").length != 0) ? <ScrollView style={{maxHeight:"100%"  }} contentContainerStyle={{ flexGrow:1}}>{
                                    this.props.Jobs[JobId].Tasks.filter(i => i !== null).filter(i => i.Status === "ACTIVE").map((item, index) =>
                                        <InProgressTaskListItem deleteMode={this.state.deleteMode}
                                            item={item}
                                            JobId={JobId}
                                            key={index}
                                            selectAll={this.state.selectAll}
                                            addDeleteSelection={this.addDeleteSelection}
                                            removeDeleteSelection={this.removeDeleteSelection}
                                            deleteSelection={this.state.deleteSelection}
                                            navigationNavigate={this.navigationNavigate} />
                                    )}</ScrollView> : <Text>No Active Hood service, press Plus to Add a Hood</Text>

                            }

                        </View>

                        <View style={{maxHeight:"100%",borderColor:"red",borderWidth:2}}  onLayout={(event) => {
  let completedTaskListHeight = event.nativeEvent.layout.height
  console.log("Completed List Height",completedTaskListHeight)}}>
                            <Text style={{ fontSize: 20, backgroundColor: "#eaeaea", borderBottomColor: "#6d6d6d", borderBottomWidth: 1, textAlign: "center" }}>COMPLETED</Text>
                            {
                                (this.props.Jobs[JobId].Tasks.filter(i => i !== null).filter(i => i.Status === "COMPLETED").length != 0) ? <ScrollView style={{maxHeight:"100%"}} contentContainerStyle={{ flexGrow: 1 }}>{
                                    this.props.Jobs[JobId].Tasks.filter(i => i !== null).filter(i => i.Status === "COMPLETED").map((item, index) =>
                                        <CompletedTaskListItem deleteMode={this.state.deleteMode}
                                            item={item}
                                            JobId={JobId}
                                            key={index}
                                            selectAll={this.state.selectAll}
                                            addDeleteSelection={this.addDeleteSelection}
                                            removeDeleteSelection={this.removeDeleteSelection}
                                            deleteSelection={this.state.deleteSelection}
                                            navigationNavigate={this.navigationNavigate} />

                                    )}</ScrollView> : <Text>No Completed Task</Text>

                            }

                        </View>


                    </View> */}

          {/* 
 USing SectionList */}

          <SectionList
            style={{ maxHeight: "90%", minHeight: "40%" }}
            renderItem={({ item, index, section }) => {
              if (section.title === "IN PROGRESS") {
                let progressList =
                  section.data.length !== 0 ? (
                    <PFEInProgressTaskListItem
                      deleteMode={this.state.deleteMode}
                      item={item}
                      JobId={JobId}
                      key={index}
                      selectAll={this.state.selectAll}
                      addDeleteSelection={this.addDeleteSelection}
                      removeDeleteSelection={this.removeDeleteSelection}
                      deleteSelection={this.state.deleteSelection}
                      navigationNavigate={this.navigationNavigate}
                      CertType={this.props.CertType}
                    />
                  ) : null;
                return progressList;
              }
              if (section.title === "COMPLETED") {
                //console.log("COMPLETE",section.data)
                let completedList =
                  section.data.length !== 0 ? (
                    <PFECompletedTaskListItem
                      deleteMode={this.state.deleteMode}
                      item={item}
                      JobId={JobId}
                      key={index}
                      selectAll={this.state.selectAll}
                      addDeleteSelection={this.addDeleteSelection}
                      removeDeleteSelection={this.removeDeleteSelection}
                      deleteSelection={this.state.deleteSelection}
                      navigationNavigate={this.navigationNavigate}
                    />
                  ) : null;
                return completedList;
              }
            }}
            renderSectionFooter={({ section }) => {
              if (
                section.title === "IN PROGRESS" &&
                section.data.length === 0
              ) {
                return (
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: 60
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "red" }}>
                      Press + to add new PFE Or Service a PFE.
                    </Text>
                  </View>
                );
              }
              if (section.title === "COMPLETED" && section.data.length === 0) {
                return (
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>No finished PFE.</Text>
                  </View>
                );
              } else return null;
            }}
            renderSectionHeader={({ section: { title, data } }) => {
              let counterString =
                data.length === 0
                  ? ""
                  : data.length === 1
                  ? ` - 1 PFE`
                  : ` - ${data.length} PFEs`;

              return (
                //ADD COUNTER TO HEADER
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
                    {title}
                    {counterString}
                  </Text>
                </View>
              );
            }}
            sections={[
              {
                title: "IN PROGRESS",
                data: this.props.Jobs[JobId].Tasks.filter(
                  i => i !== null
                ).filter(i => i.Status === "ACTIVE")
              },
              {
                title: "COMPLETED",
                data: this.props.Jobs[JobId].Tasks.filter(
                  i => i !== null
                ).filter(i => i.Status === "COMPLETED")
              }
            ]}
            keyExtractor={(item, index) => item + index}
            stickySectionHeadersEnabled
          />

          {taskButton}
        </SafeAreaView>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    Jobs: state.PFEJobsReducer.Jobs,
    CertType: state.DefaultReducer.CertType
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteTasks(JobId, deleteSelection) {
      const action = {
        type: "Delete_PFE_Tasks",
        JobId,
        deleteSelection
      };

      dispatch(action);
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PFETasksScreen);
