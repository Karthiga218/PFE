

const CONTENT = [
    {
        isExpanded: false,
        category_name: 'FIRE EXTINGUISHING SYSTEM',
        selections: ['Service overdue', 'Other'],
    },
    {
        isExpanded: false,
        category_name: 'HOUSEKEEPING',
        selections: ['Non-accessible area(s)', 'Excessive debris', 'Expired equipment or services', 'Other'],
    },

];


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
    KeyboardAvoidingView
} from 'react-native';
import CheckboxSelector from '../../Components/CheckboxSelector';
import { Button, Badge } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ProgressCircle from 'react-native-progress-circle';
import { connect } from 'react-redux';
import RadioSelector from '../../Components/RadioSelector';
import toPascalCase from '../../toPascalCases';
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

        let checked = (this.props.Jobs[this.props.JobId].Tasks[this.props.taskIndex].SurveyResult['NonCritical'].hasOwnProperty(title)) ? this.props.Jobs[this.props.JobId].Tasks[this.props.taskIndex].SurveyResult['NonCritical'][title].filter(i => typeof (i) === "string").length : 0

        return (
            <View style={{ borderBottomColor: "#d6d6d6", borderBottomWidth: 1 }}>
                {/*Header of the Expandable List Item*/}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.props.onClickFunction}
                    style={expandableListStyles.header}>
                    <View style={[expandableListStyles.headerText, { flexDirection: "row", justifyContent: "space-between" }]}>
                        <View style={{ flexDirection: "row" }}><Text>{this.props.item.category_name}</Text>{(checked === 0) ? null : <Badge status="warning" value={checked} />}{(this.props.alert === true) ? <FontAwesome5 name={"exclamation-circle"} style={{ marginLeft: 20 }} size={20} color={"red"} /> : null}</View>
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
                        deficiency={"NonCritical"}
                        updateNumberofChecked={this.updateNumberofChecked}
                        alert={this.props.alert}
                        isExpanded={this.props.isExpanded}
                    />



                </View>
            </View>
        );
    }
}


// Step 6



class NonCriticalDeficiencyQuestionScreen extends Component {
    //Main View defined under this Class
    constructor() {
        super();
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        this.state = { listDataSource: CONTENT, show: 'N/A' };
        this.checkNonCritNo = this.checkNonCritNo.bind(this);
        this.checkNonCritYes = this.checkNonCritYes.bind(this);


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
            <View style={{ flexDirection: "row" ,marginRight:10}}><Text style={{ color: "white" }} onPress={() => { navigation.navigate("RHTasks", { JobId: navigation.getParam("JobId"), taskIndex: navigation.getParam("taskIndex") }) }}>Save and Exit</Text></View>
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


    checkNonCritYes() {
        const taskIndex = this.props.navigation.getParam("taskIndex");
        const JobId = this.props.navigation.getParam("JobId");
        this.props.NonCritYes(JobId, taskIndex);
    }
    checkNonCritNo() {
        const taskIndex = this.props.navigation.getParam("taskIndex");
        const JobId = this.props.navigation.getParam("JobId");
        this.props.NonCritNo(JobId, taskIndex);
    }



    render() {
        let blankCommentAlert = [];
        let bottomContinueButtonStyle = (Platform.OS ==='ios')? styles.bottomContinueButtoniOS :styles.bottomContinueButtonAndroid;
        if (this.props.Jobs.length === 0) {
            return null
        }
        else {
            const taskIndex = this.props.navigation.getParam("taskIndex");
            const JobId = this.props.navigation.getParam("JobId");

            const currentTaskSurveyResult = this.props.Jobs[JobId].Tasks[taskIndex].SurveyResult
            let stepStatus = Object.keys(currentTaskSurveyResult["NonCritical"]).length === 0;
            return (
                <KeyboardAvoidingView style={expandableListStyles.container}  keyboardVerticalOffset={64} enabled>
                    <View style={{ flexDirection: "row", borderBottomColor: "#d6d6d6", borderBottomWidth: 2, padding: 10 }}>
                        <ProgressCircle
                            percent={80}
                            radius={25}
                            borderWidth={5}
                            color="#4f962b"
                            shadowColor="#d6d6d6"
                            bgColor="#fff"
                        >
                            <Text style={{ fontSize: 10 }}>{'80%'}</Text>
                        </ProgressCircle>
                        <View style={{ justifyContent: "center", alignItems: "center", marginLeft: 20, flexDirection: "row", flex: 1 }}>
                            <Text style={{ fontSize: 20, color: "black", flexWrap: "wrap" }}>Are there any NON-CRITICAL deficiencies?</Text>
                        </View>

                    </View>


                    <ScrollView >


                        <RadioSelector
                            title={""}
                            selection={["Yes", "No"]}
                            answer={currentTaskSurveyResult.NonCrit}
                            YesCheckBox={this.checkNonCritYes}
                            NoCheckBox={this.checkNonCritNo}
                        />


                        {currentTaskSurveyResult.NonCrit === true &&
                            this.state.listDataSource.map((item, key) => {
                                let title = toPascalCase(item.category_name)
                                let result = this.props.Jobs[JobId].Tasks[taskIndex].SurveyResult["NonCritical"];

                                let commentStatus = result.hasOwnProperty(title) && result[title].includes("Other");
                                let alert = false;

                                if (commentStatus === true) {

                                    if (result[title].filter(i => typeof (i) === "object").length === 0) {
                                        alert = true
                                    } else {
                                        if (result[title].filter(i => typeof (i) === "object")[0]['comment'].length === 0) {
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
                            })}
                    </ScrollView>
                    <Button type="solid" title="NEXT" raised
                        disabled={currentTaskSurveyResult.NonCrit === null}
                        buttonStyle={bottomContinueButtonStyle}
                        containerStyle={{ flexDirection: "row", justifyContent: "center",width:"100%",paddingVertical:10,borderTopColor: "rgb(242, 242, 242)", borderTopWidth: 1 }}
                        onPress={() => this.props.navigation.navigate('RHNewDecal', { JobId: JobId, taskIndex: taskIndex })}>
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

const mapDispatchToProps = (dispatch) => {
    return {
        NonCritYes(JobId, taskIndex) {
            const action = {
                type: "NonCrit_Yes",
                JobId,
                taskIndex
            }
            dispatch(action);
        },
        NonCritNo(JobId, taskIndex) {
            const action = {
                type: "NonCrit_No",
                JobId,
                taskIndex
            }
            dispatch(action);
        },
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(NonCriticalDeficiencyQuestionScreen)

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

