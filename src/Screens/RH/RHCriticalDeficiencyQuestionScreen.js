
import React, { Component } from 'react';
import {
    LayoutAnimation,
    StyleSheet,
    View,
    Text,
    ScrollView,
    UIManager,
    TouchableOpacity,
    Platform,
    Keyboard,
    KeyboardAvoidingView
} from 'react-native';
import CheckboxSelector from '../../Components/CheckboxSelector';
import RadioSelector from '../../Components/RadioSelector';
import { Button, Badge } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ProgressCircle from 'react-native-progress-circle';
import toPascalCase from '../../toPascalCases';
import { connect } from 'react-redux';
import styles from '../../Styles/styles';



//Custom Component for the Expandable List 
class ExpandableItemComponent extends Component {

    constructor() {
        super();
        this.state = {
            layoutHeight: 0,
        };

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.item.isExpanded) {
            this.setState(() => {
                return {
                    layoutHeight: null,
                };
            });
        } else {
            this.setState(() => {
                return {
                    layoutHeight: 0,
                };
            });
        }
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     if ((this.state.layoutHeight !== nextState.layoutHeight)){
    //         return true;
    //     }
    //     return false;
    // }




    render() {
        let iconName = (this.props.isExpanded) ? 'chevron-down' : 'chevron-up'
        let title = toPascalCase(this.props.item.category_name);

        let checked = (this.props.Jobs[this.props.JobId].Tasks[this.props.taskIndex].SurveyResult["Critical"].hasOwnProperty(title)) ? this.props.Jobs[this.props.JobId].Tasks[this.props.taskIndex].SurveyResult[["Critical"]][title].filter(i => typeof (i) === "string").length : 0;
        // const JobId = this.props.JobId;
        // const taskIndex = this.props.taskIndex;
        // const result = this.props.Jobs[JobId].Tasks[taskIndex].SurveyResult["Critical"];

        // let commentStatus = result.hasOwnProperty(title) && result[title].includes("Other");
        // let alert = false;
        // if(commentStatus === true){

        //      if(result[title].filter(i => typeof (i) === "object").length === 0){
        //          alert =true
        //      }else{ 
        //          if(result[title].filter(i => typeof (i) === "object")[0]['comment'].length === 0){
        //              alert =true
        //          }
        //          else {alert = false}
        //      }

        // }else{ alert = false}
        return (
            <View style={{ borderBottomColor: "#d6d6d6", borderBottomWidth: 1 }}>
                {/*Header of the Expandable List Item*/}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.props.onClickFunction}
                    style={expandableListStyles.header}>
                    <View style={[expandableListStyles.headerText, { flexDirection: "row", justifyContent: "space-between" }]}>
                        <View style={{ flexDirection: "row" }}><Text style={{ fontSize: 16 }}>{this.props.item.category_name}</Text>{(checked === 0) ? null : <Badge status="warning" value={checked} size={"20"} style={{ marginLeft: 10 }} />}{(this.props.alert === true) ? <FontAwesome5 name={"exclamation-circle"} style={{ marginLeft: 20 }} size={20} color={"red"} /> : null}</View>
                        <FontAwesome5 name={iconName} size={20} />
                    </View>

                </TouchableOpacity>
                <View
                    style={{
                        height: this.state.layoutHeight,
                        overflow: 'hidden',
                    }}>
                    <CheckboxSelector selection={this.props.item.selections}
                        title={title}
                        JobId={this.props.JobId}
                        taskIndex={this.props.taskIndex}
                        deficiency={"Critical"}
                        updateNumberofChecked={this.updateNumberofChecked} 
                        alert = {this.props.alert}
                        isExpanded= {this.props.isExpanded}
                        />


                </View>
            </View>
        );
    }
}

// Step 5

class CriticalDeficiencyQuestionScreen extends Component {
    //Main View defined under this Class
    constructor() {
        super();
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        this.state = {
            listDataSource: CONTENT,
            alert: 'N/A'
        };
    }


    static navigationOptions = ({ navigation }) => ({
        title: '',
        headerTintColor: "white",
        headerTitleStyle: {
            color: "white"
        },
        headerStyle: {
            backgroundColor: '#e61616',

        },
        headerRight:
            <View style={{ flexDirection: "row",marginRight:10 }}><Text style={{ color: "white" }} onPress={() => { navigation.navigate("RHTasks", { JobId: navigation.getParam("JobId"), taskIndex: navigation.getParam("taskIndex") }) }}>Save and Exit</Text></View>

    });


    updateLayout = index => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const array = [...this.state.listDataSource];
        array[index]['isExpanded'] = !array[index]['isExpanded'];
        this.setState(() => {
            return {
                listDataSource: array,
            };
        });
    };








    render() {
        let blankCommentAlert = []
        let bottomContinueButtonStyle = (Platform.OS ==='ios')? styles.bottomContinueButtoniOS :styles.bottomContinueButtonAndroid;
        if (this.props.Jobs.length === 0) {
            return null
        } else {
            const taskIndex = this.props.navigation.getParam("taskIndex");
            const JobId = this.props.navigation.getParam("JobId");
            let stepStatus = Object.keys(this.props.Jobs[JobId].Tasks[taskIndex].SurveyResult["Critical"]).length === 0;
            return (
                <KeyboardAvoidingView style={expandableListStyles.container}  keyboardVerticalOffset={64} enabled >
                    <View style={{ flexDirection: "row", borderBottomColor: "#d6d6d6", borderBottomWidth: 2, padding: 10 }}>
                        <ProgressCircle
                            percent={70}
                            radius={25}
                            borderWidth={5}
                            color="#4f962b"
                            shadowColor="#d6d6d6"
                            bgColor="#fff"
                        >
                            <Text style={{ fontSize: 10 }}>{'70%'}</Text>
                        </ProgressCircle>
                        <View style={{ justifyContent: "center", alignItems: "center", marginLeft: 20 }} >
                            <Text style={{ fontSize: 20, color: "black" }}>Critical Deficiencies</Text>
                        </View>

                    </View>
                    <ScrollView style={{minHeight:"50%"}} >
                        {
                            this.state.listDataSource.map((item, key) => {
                                let title = toPascalCase(item.category_name)
                                let result = this.props.Jobs[JobId].Tasks[taskIndex].SurveyResult["Critical"];

                                let commentStatus = result.hasOwnProperty(title) && result[title].includes("Other");
                                let alert = false;

                                if (commentStatus === true) {

                                    if (result[title].filter(i => typeof (i) === "object").length === 0) {
                                        alert = true
                                    } else {
                                        if (result[title].filter(i => typeof (i) === "object")[0]['comment'].trim().length === 0) {
                                            alert = true
                                        }
                                        else { alert = false }
                                    }

                                } else { alert = false }
                                blankCommentAlert.push(alert)
                                return (
                                    <ExpandableItemComponent
                                        key={item.category_name}
                                        onClickFunction={this.updateLayout.bind(this, key)}
                                        item={item}
                                        isExpanded={item.isExpanded}
                                        JobId={JobId}
                                        taskIndex={taskIndex}
                                        Jobs={this.props.Jobs}
                                        alert={alert}
                                    />

                                )
                            }
                            )
                        }
                    </ScrollView>
                    <Button type="solid" title="NEXT" raised
                
                        disabled={stepStatus || (blankCommentAlert.includes(true))}
                        buttonStyle={bottomContinueButtonStyle}
                        containerStyle={{ flexDirection: "row", justifyContent: "center",width:"100%",paddingVertical:10,borderTopColor: "rgb(242, 242, 242)", borderTopWidth: 1 }}
                        onPress={() => this.props.navigation.navigate('RHNonCriticalDeficiencyQuestion', { JobId: JobId, taskIndex: taskIndex })}>
                    </Button>
                </KeyboardAvoidingView>
            );
        }
    }
}
const mapStateToProps = (state) => {
    return {
        Jobs: state.RHJobsReducer.Jobs
    }
}

export default connect(mapStateToProps, null)(CriticalDeficiencyQuestionScreen)

const expandableListStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    topHeading: {
        paddingLeft: 10,
        fontSize: 20,
    },
    header: {
        backgroundColor: 'white',
        padding: 16,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '500',
    },
    text: {
        fontSize: 16,
        color: 'black',
        padding: 10,
    },
});

const CONTENT = [
    {
        isExpanded: false,
        category_name: 'ACCESS DOORS',
        selections: ['Not accessible', 'Missing', 'Damaged', 'Other'],
    },
    {
        isExpanded: false,
        category_name: 'ROOF',
        selections: ['Hinge kit missing/access panel', 'Exhaust fan missing/damaged', 'Grease buildup', 'Other'],
    },
    {
        isExpanded: false,
        category_name: 'FILTER',
        selections: ['Missing', 'Non UL compliant', 'Improperly installed', 'Damaged/heavily soiled', 'Other'],
    },
    {
        isExpanded: false,
        category_name: 'EXCESSIVE GREASE',
        selections: ['Leakage', 'Heavy accumulation in duct/fan', 'Heavy accumulation in hood', 'Other'],
    },
    {
        isExpanded: false,
        category_name: 'ELECTRICAL',
        selections: ['Exposed wires', 'Missing safety switches', 'Missing globes', 'Other'],
    },
];