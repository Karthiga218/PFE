import React, { Component } from 'react';
import { createAppContainer, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Platform, StyleSheet,Keyboard, CameraRoll, Dimensions, Image, Alert, TouchableOpacity, TouchableHighlight, View, Text, Button, TextInput } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../Styles/styles';
import AsyncStorage from '@react-native-community/async-storage';
import { CheckBox, Input } from 'react-native-elements'
import store from '../store/storeindex';
import { connect } from 'react-redux';


class CheckboxSelector extends Component {
    constructor(props) {
        super(props)
        this.state = { comment: '', blankCommentAlert: false }
        for (let key of this.props.selection.keys()) {
            this.state[`A${key + 1}`] = false
        }

    }
    toggleCheck(i, l, JobId, taskIndex, deficiency) {

        let answer = `A${i}`

        this.setState({ [answer]: !this.state[answer] }, () => {
            this.props.SaveAnswer(this.props.title, l, JobId, taskIndex, deficiency);


        }
        )

    }

    // SaveComment(title, comment, JobId, taskIndex, deficiency) {
    //     if (comment.length === 0) {
    //         this.setState({ blankCommentAlert: true })
    //     } else {
    //         this.setState({ blankCommentAlert: false })
    //         this.props.SaveComment(title, comment, JobId, taskIndex, deficiency)
    //     }
    // }

    render() {
        if (this.props.Jobs.length === 0) {
            return null
        } else {
            const deficiency = this.props.deficiency
            const JobId = this.props.JobId;
            const taskIndex = this.props.taskIndex;
            const result = this.props.Jobs[JobId].Tasks[taskIndex].SurveyResult[deficiency];
            const question =this.props.title;
           // console.log(question)
            let commentStatus = result.hasOwnProperty(question) && result[question].includes("Other");
            // let alert = false;
            // if(commentStatus === true){
                
            //      if(result[question].filter(i => typeof (i) === "object").length === 0){
            //          alert =true
            //      }else{ 
            //          if(result[question].filter(i => typeof (i) === "object")[0]['comment'].length === 0){
            //              alert =true
            //          }
            //          else {alert = false}
            //      }

            // }else{ alert = false}
     

            let color = this.props.alert ? "red" : "black";
           // console.log(question,"alert",alert,color)


            console.log(this.props.title,'isExpanded?',this.props.isExpanded,"is alert???",this.props.alert)


            return (
                <View >
                    <View>
                        {
                            this.props.selection.map((l, i) => (
                                <CheckBox key={i} title={l} onPress={() => this.toggleCheck(i + 1, l, JobId, taskIndex, deficiency)}
                                    // checked={this.state[`A${i + 1}`]} 
                                    checked={result.hasOwnProperty(question) && result[question].includes(l)}
                                    
                                />
                            ))
                        }
                        {

                            commentStatus &&
                            <View >
                                <Input multiline={true} 
                                autoFocus={ this.props.isExpanded && this.props.alert}
                                // autoFocus={!(result.hasOwnProperty(question) && result[question].filter(i => typeof (i) === "object").length != 0)}
                                    inputContainerStyle={{ borderBottomColor: color,marginBottom:10 }} 
                                    label={"Comments (Required)"} 
                                    labelStyle={{ color: color }} 
                                    placeholder={"Enter Comments"}
                                    onEndEditing={()=>Keyboard.dismiss}
                                    onChangeText={(text) => this.setState({ comment: text.trim() },()=>
                                    {   
                                        this.props.SaveComment(question, this.state.comment, JobId, taskIndex, deficiency)}
                                    )}

                                    defaultValue={(result.hasOwnProperty(question) && result[question].filter(i => typeof (i) === "object").length != 0) ?
                                        result[question].filter(i => typeof (i) === "object")[0]['comment'] : ''}
                                    // onEndEditing={() => this.SaveComment(this.props.title, this.state.comment, JobId, taskIndex, deficiency)}
                                    ></Input>
                            </View>
                        }

                    </View>
                </View>
            )
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
        SaveAnswer(question, answer, JobId, taskIndex, deficiency) {
            const action = {
                type: "Save_Answer",
                question,
                answer,
                JobId,
                taskIndex,
                deficiency
            }
          
            dispatch(action)
        },
        SaveComment(question, comment, JobId, taskIndex, deficiency) {
            const action = {
                type: "Save_Comment",
                question,
                comment,
                JobId,
                taskIndex,
                deficiency
            }
            
            dispatch(action)
        }


    }

}

export default connect(mapStateToProps, mapDispatchToProps)(CheckboxSelector)

// function toPascalCase(str) {
// 	str = str.toLowerCase().split(' ');
// 	for (var i = 0; i < str.length; i++) {
// 		str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
// 	}
// 	return str.join('');
// };