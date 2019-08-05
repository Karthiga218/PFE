import React, { Component } from 'react';
import { createAppContainer, createStackNavigator, createBottomTabNavigator,HeaderBackButton } from 'react-navigation';
import { SafeAreaView,BackHandler,Platform, StyleSheet, ScrollView, CameraRoll, Dimensions, Image, Alert, TouchableOpacity, TouchableHighlight, Modal, Picker, FlatList, SectionList, View } from 'react-native';

import styles from '../../Styles/styles';
import { connect } from 'react-redux';
import { ListItem, Button, Text, CheckBox, ThemeProvider } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ProgressCircle from 'react-native-progress-circle';
import InProgressTaskListItem from '../../Components/InProgressTaskListItem';
import CompletedTaskListItem from '../../Components/CompletedTaskListItem';

/////NEED ADD SCROLLVIEW

class TasksScreen extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props);
        this.state = {
            deleteMode: false,
            selectAll: false,
            deleteSelection: [],
        }
        this.props.navigation.setParams({ aaa: this.state.deleteMode })
        this.addDeleteSelection = this.addDeleteSelection.bind(this);
        this.removeDeleteSelection = this.removeDeleteSelection.bind(this);
        this.navigationNavigate = this.navigationNavigate.bind(this);
        //this.props.navigation.setParams({ AddTaskAndNavToPreSurvey: this.AddTaskAndNavToPreSurvey.bind(this) })
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      );
    }

    static navigationOptions = ({ navigation }) => {
        let JobId = navigation.getParam("JobId");
        let deleteMode = navigation.getParam('deleteMode', false);
        let selectAll = navigation.getParam('selectAll', false);
        let header = (deleteMode) ?
            {
                headerLeft: null,
                headerTitle: <View style={{ width: "100%", justifyContent: "center", flexDirection: "row" }}><Text style={{ fontSize: 20, color: "white" }}>Select hoods to delete</Text></View>,

                // headerLeft: <Text style={{ fontSize: 20, paddingLeft: 20, color: "white", fontWeight: "bold" }}>DELETTTTETETETETETE</Text>,
                headerStyle: {
                    backgroundColor: '#e61616',
                    

                },
                headerRight: (
                    
                    //     <CheckBox

                    //     checkedIcon={<FontAwesome5 solid name={"check-square"} color={"white"} size={20} onPress={navigation.getParam('UnSelectAll')} />}
                    //     uncheckedIcon={<FontAwesome5 name={"square"} color={"white"} size={20}  onPress={navigation.getParam('SelectAll')} />}
                    //     checked={selectAll}
                    //     containerStyle={{flexDirection: "row"}}
                    // />
                    selectAll ?
                    <View style={{ flexDirection: "row",marginRight:10 }}><FontAwesome5 solid name={"check-square"} color={"white"} size={20} style={{marginHorizontal:20}} onPress={navigation.getParam('UnSelectAll')} /></View>
                    :
                    <View style={{ flexDirection: "row",marginRight:10 }}><FontAwesome5 name={"square"} color={"white"} size={20} style={{marginHorizontal:20}} onPress={navigation.getParam('SelectAll')} /></View>
                )
            }
            :
            {
                headerTitle: <View style={{ width: "100%", justifyContent: "center", flexDirection: "row" }}><Text style={{fontSize: 20, color: "white" }}>Rangehoods</Text></View>,
                // title:"Tasks",
                // headerTitleStyle:{textAlign:'center',alignSelf:"center"},
                // headerLeft: <Text style={{ fontSize: 20, paddingLeft: 20, color: "white", fontWeight: "bold" }}>Tasks</Text>,
                headerStyle: {
                    backgroundColor: '#e61616',
                },
                headerTintColor: "white",
                headerLeft:(<HeaderBackButton title='Back'  tintColor={"white"}  backTitleVisible={Platform.OS==='ios'} onPress={() => navigation.navigate('RHClients')} />),

                headerRight: (
                    <View style={{ flexDirection: "row",marginRight:20}}><FontAwesome5 name={"trash"} color={"white"} style={{ marginRight:20}} size={20} onPress={navigation.getParam('DeleteMode')} /><FontAwesome5 name={"plus"} size={20} color={"white"} style={{ }}
                        // onPress={()=>navigation.state.params.AddTaskAndNavToPreSurvey()}
                        onPress={() => navigation.navigate("RHPreSurvey", { JobId: JobId })}
                    /></View>
                )
            }
        return (header)
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
        this.setState({ deleteMode: true }, () => this.props.navigation.setParams({ deleteMode: this.state.deleteMode }))
    }

    SelectAll = () => {
        let JobId = this.props.navigation.getParam("JobId");
        //let totalactivelength = this.props.Jobs[JobId].Tasks.filter(i =>i!==null).filter(i => i.Status === "ACTIVE").length+this.props.Jobs[JobId].Tasks.filter(i =>i ===null).length
        // [...Array(10).keys()]
        let totalactivelength = this.props.Jobs[JobId].Tasks.length;
        this.setState({ selectAll: true, deleteSelection: [...Array(totalactivelength).keys()] }, () => this.props.navigation.setParams({ selectAll: this.state.selectAll }))
    }
    UnSelectAll = () => {
        this.setState({ selectAll: false, deleteSelection: [] }, () => this.props.navigation.setParams({ selectAll: this.state.selectAll }))
    }


    addDeleteSelection(index) {
        this.setState((prevState) => ({ deleteSelection: [...prevState.deleteSelection, index] }))
    }
    removeDeleteSelection(index) {
        this.setState((prevState) => ({ deleteSelection: prevState.deleteSelection.filter(i => i != index) }))
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
    }
    handleCancelButtonClick() {
        this.setState({
            deleteMode: false,
            selectAll: false,
            deleteSelection: [],
        }, () => this.props.navigation.setParams({ deleteMode: this.state.deleteMode, selectAll: this.state.selectAll }))
    }

    navigationNavigate(dest, params) {
        this.props.navigation.navigate(dest, params)
    }
    componentDidMount() {
        this.props.navigation.setParams({ DeleteMode: this.DeleteMode, SelectAll: this.SelectAll, UnSelectAll: this.UnSelectAll });

        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      );
    }

    componentWillUnmount(){
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    onBackButtonPressAndroid = () => {
        this.props.navigation.navigate("RHClients");
        return true
        };

    render() {
        //console.log(this.props.navigation.getParam("JobId"))
        // let {width, height} = Dimensions.get('window')
        // console.log("window height",height)
        if (this.props.Jobs.length === 0) { return <View></View> }
        else {

        
            const JobId = this.props.navigation.getParam("JobId");
            let jobSubmitValidation = (this.props.Jobs[JobId].Tasks.filter(i => i !== null).some(i =>i.Status === "ACTIVE"))? false : true;
            //console.log("JOBSUBMIT VALIDATION",jobSubmitValidation)
            const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            // DELETE status , need modify deleteTotalcount ..7/12
            let showPreviewButton = (this.props.Jobs[JobId].Tasks.filter(i=>i!==null).some(i=>i.Status ==="COMPLETED") && (!this.props.Jobs[JobId].Tasks.filter(i => i !== null).some(i =>i.Status === "ACTIVE")) ) ? true:false;
            let sectionListStyle = (showPreviewButton ||this.state.deleteMode)? {maxHeight:"90%"}:{maxHeight:"100%"};
            let deleteTotalCount = this.state.selectAll ? this.props.Jobs[JobId].Tasks.filter(i => i !== null).filter(i =>i.Status !=="DELETED").length : (this.state.deleteSelection.length === 0 ? '' : this.state.deleteSelection.length)
            let taskButton = (this.state.deleteMode) ?
                (<View style={{flexDirection: "row", justifyContent: "space-evenly", width: "100%"}}>
                    <Button style="solid" title="CANCEL"  raised
                    buttonStyle={{ width: "100%", backgroundColor: "#dddddd" }}
                       containerStyle={{flex:1,marginHorizontal:10}}
                        onPress={() => this.handleCancelButtonClick()} />
                    <Button style="solid" title={`DELETE ${deleteTotalCount}`} raised 
                    buttonStyle={{ width: "100%", backgroundColor: "#ff0000" }}
                        containerStyle={{flex:1,marginHorizontal:10}}
                        onPress={() => this.handleDeleteButtonClick(JobId, this.state.deleteSelection)} />
                </View>)
                :
                (this.props.Jobs[JobId].Tasks.filter(i => i !== null).length === 0)? null : (showPreviewButton)? 

                (<View style={{ flexDirection: "row", alignContent: "center", justifyContent: "center",margin:10}}>
                    <Button type="solid" title="PREVIEW" raised
                    titleStyle={{fontSize:18}}
                    buttonStyle={{ width: "100%" }}
                    disabled={!jobSubmitValidation}
                    
                    onPress={() => this.props.navigation.navigate("RHJobSummary",{JobId:JobId})} />
                </View>):null
                



            //console.log(this.props.Jobs[JobId].Tasks.filter(i => i !== null).filter(i => i.Status === "ACTIVE"))
            return (
                <SafeAreaView >

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

                       
                        <SectionList style={sectionListStyle}
  renderItem={({item, index, section}) => { 
    if(section.title === 'IN PROGRESS'){
         let progressList =(section.data.length !== 0)?
        <InProgressTaskListItem deleteMode={this.state.deleteMode}
                    item={item}
                    JobId={JobId}
                    key={index}
                    selectAll={this.state.selectAll}
                    addDeleteSelection={this.addDeleteSelection}
                    removeDeleteSelection={this.removeDeleteSelection}
                    deleteSelection={this.state.deleteSelection}
                    navigationNavigate={this.navigationNavigate} 
                    CertType={this.props.CertType}/>
            : null
            return progressList
    }
    if(section.title === "COMPLETED"){
        //console.log("COMPLETE",section.data)
        let completedList = section.data.length !== 0?
        <CompletedTaskListItem deleteMode={this.state.deleteMode}
                                            item={item}
                                            JobId={JobId}
                                            key={index}
                                            selectAll={this.state.selectAll}
                                            addDeleteSelection={this.addDeleteSelection}
                                            removeDeleteSelection={this.removeDeleteSelection}
                                            deleteSelection={this.state.deleteSelection}
                                            navigationNavigate={this.navigationNavigate} />

                                     : null
        return completedList
    }
  }}
  renderSectionFooter ={({section}) =>{
    if(section.title === 'IN PROGRESS' &&section.data.length === 0){
        return <View style={{flexDirection:"column",justifyContent:"center",alignItems:'center',marginVertical:20}}><Text style={{fontSize:16,color:"red"}}>Press + to ADD a new hood to service.</Text></View>
    }
    if(section.title === 'COMPLETED' &&section.data.length === 0){
        return <View style={{flexDirection:"column",justifyContent:"center",alignItems:'center',marginVertical:10}}><Text style={{ fontSize: 16 }}> </Text></View>
    }
    else return null
  }}
  renderSectionHeader={({section: {title,data}}) =>{
    let counterString = (data.length === 0)? '':(data.length === 1)? ` - 1 Hood` :` - ${data.length} Hoods` 

    return (
        //ADD COUNTER TO HEADER
    //  <Text style={{height: 30,fontSize: 20, backgroundColor: "#fafafa", borderTopColor:"#bdbdbd",borderTopWidth:0,borderBottomColor: "#bdbdbd", borderBottomWidth: 2, textAlign: "center", color:"#696969",fontWeight:"bold"}}>{title}{counterString}</Text>
    <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center",paddingVertical:5,width:"100%", backgroundColor: "#bdbdbd",borderBottomColor: "#bdbdbd", borderBottomWidth: 1}}>
                    <Text style={{fontSize: 20, textAlign: "center", color:"#EEEEEE",fontWeight:"bold"}}>{title}{counterString}</Text>
    </View>
    )
  } }
  sections={[
    {title: 'IN PROGRESS', data: this.props.Jobs[JobId].Tasks.filter(i => i !== null).filter(i => i.Status === "ACTIVE")},
    {title: 'COMPLETED', data:this.props.Jobs[JobId].Tasks.filter(i => i !== null).filter(i => i.Status === "COMPLETED")}
  ]}
  keyExtractor={(item, index) => item + index}
  stickySectionHeadersEnabled
/>


                    {taskButton}

                </SafeAreaView>
            )
        }
    }
}



const mapStateToProps = (state) => {
    return {
        Jobs: state.RHJobsReducer.Jobs,
        CertType:state.DefaultReducer.CertType,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        deleteTasks(JobId, deleteSelection) {
            const action = {
                type: "Delete_Tasks",
                JobId,
                deleteSelection
            }

            dispatch(action)
        }
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(TasksScreen)
