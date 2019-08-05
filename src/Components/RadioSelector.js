import React, { Component } from 'react';
import { createAppContainer, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Platform, StyleSheet, CameraRoll, Dimensions, Image, Alert, TouchableOpacity, TouchableHighlight, View, Text, Button, TextInput } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../Styles/styles';
import AsyncStorage from '@react-native-community/async-storage';
import { CheckBox, Input ,Divider} from 'react-native-elements';
import { connect } from 'react-redux';

class RadioSelector extends Component {
    constructor(props) {
        super(props);
        // this.state = { answer:"Not_Selected" }
    }
// toggleYesCheckBox(){
//     this.setState((prevState)=>{ 
//         if(prevState.answer === 'Yes'){
//             return {answer:"No"}
//         }
//         else if(prevState.answer ==='Not_Selected'){return {answer:"Yes"}}
//         else if(prevState.answer === 'No'){
//             return {answer:"Yes"}
//         }
//     },()=>{this.props.updateStatus(this.state.answer);
//         // this.props.SaveYesNoAnswer(this.props.title,this.state.answer)
//     }
//     )
// }
toggleYesCheckBox(){

}
// toggleNoCheckBox(){
//     this.setState((prevState)=>{
//         if(prevState.answer === 'Yes'){
//             return {answer:"No"}
//         }
//         else if(prevState.answer ==='Not_Selected'){return {answer:"No"}}
//         else if(prevState.answer === 'No'){
//             return {answer:"Yes"}
//         }
//     },()=>{this.props.updateStatus(this.state.answer);
//         // this.props.SaveYesNoAnswer(this.props.title,this.state.answer)
//     }
//     )
// }

componentDidUpdate(){
    
    
}
    render() {
   
        return (
            <View >
            { this.props.title.length != 0 &&
                <Text style={{ color: "black", fontSize: 20 }}>{this.props.title}</Text>
            }
                
                <View style={{margin:15,backgroundColor: "white", borderColor: '#ddd',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 2,}}>

                    <CheckBox containerStyle={{backgroundColor:"transparent",borderWidth:0}}  textStyle={{flex:1,justifyContent:"space-between"}}  right iconRight title={this.props.selection[0]} checkedIcon='dot-circle-o' uncheckedIcon='circle-o' checked={this.props.answer === true} onPress={()=>this.props.YesCheckBox()}/>
                    <Divider style={{backgroundColor:"grey",width:"90%",left:"5%"}}></Divider>
                    <CheckBox containerStyle={{backgroundColor:"transparent",borderWidth:0}}  textStyle={{flex:1,justifyContent:"space-between"}} right iconRight title={this.props.selection[1]} checkedIcon='dot-circle-o' uncheckedIcon='circle-o' checked={this.props.answer === false} onPress={()=>this.props.NoCheckBox()}/>

                </View>
            </View>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        SaveYesNoAnswer(question,answer) {
            
            const action ={
                type:"Save_YesNo_Answer",
                question,
                answer,
            }
            dispatch(action)
        },


    }

}
export default connect(null,null)(RadioSelector)