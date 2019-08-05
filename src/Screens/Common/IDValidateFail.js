import React, { Component } from 'react';
import { createAppContainer, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Platform, StyleSheet, CameraRoll, Dimensions, Image, Alert, TouchableOpacity, TouchableHighlight, View, Text, Button, TextInput } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Spinner from 'react-native-loading-spinner-overlay';

import { connect } from 'react-redux';
import styles from '../../Styles/styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IDValidateFailTemplet from './IDValidateFailTemplet';


class IDValidateFailScreen extends Component {
    constructor(props) {
        super(props);

    }



    static navigationOptions = () => ({
        headerTitle: <View style={{width:"100%",flexDirection:"row",justifyContent:"center"}}><Text  style={{color:"white",fontSize:20}}>Invalid COF</Text></View>,
        headerTintColor: "white",
        headerTitleStyle: {
            color: "white"
        },
        headerRight: (<FontAwesome5 name={"question-circle"} color={"white"} size={20} style={{ marginRight: 20 }}/>),
        headerStyle: {
            backgroundColor: '#e61616',

        },
        
    });



    Exit() {
        this.props.navigation.navigate("LogIn")
    }




    render() {
        
        const { CERT, CertType, Valid, AppMessage } = this.props;

        const text = AppMessage;
   
        // switch (AppMessage) {
        //     case "COF HAS EXPIRED": text = "Your COF has expired."; break;
        //     case "COF DOES NOT EXIST": text = "Your COF does not exist."; break;
        //     case "COF IS NOT A VALID CERT TYPE": text = "COF is not a valid type."; break;
        //     case "COF IS VOID": text = "Your COF is Void."; break;
        //     default: text = "Validate Fail."
        // }
        return (

            <IDValidateFailTemplet text={text} CERT={CERT}  />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        CERT: state.DefaultReducer.BarCodeResult,
        CertType: state.DefaultReducer.CertType,
        Valid: state.DefaultReducer.ValidateHolder,
        AppMessage: state.DefaultReducer.AppMessage,
    }
}


export default connect(mapStateToProps, null)(IDValidateFailScreen)


