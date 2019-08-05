import React, { Component } from 'react';
import { createAppContainer, createStackNavigator, createBottomTabNavigator ,withNavigation} from 'react-navigation';
import { Platform, StyleSheet, CameraRoll, Dimensions, Image, Alert, TouchableOpacity, TouchableHighlight, View, Text,TextInput } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../../Styles/styles';
import store from '../../store/storeindex';
import { connect } from 'react-redux';


import { Button } from 'react-native-elements';


const IDValidateFailTemplet = (props) => {


    return (
        <View>
                <View style={{margin:20}}>
                <Text style={{fontSize:16,color:"black"}}>{props.text}</Text>
                </View>
                <View style = {styles.textPreview}>
                    <Text style = {{fontSize:16,color:"black"}}>Certificate Number: <Text style={{fontWeight:'bold'}}>{props.CERT}</Text></Text>
                     <Button type="solid" title="EXIT" raised
                    buttonStyle={{ width: "100%",margin:0, }}
                    // containerStyle={{flexDirection: "row", justifyContent: "center", width:"100%",backgroundColor:"red" }}
                    containerStyle={{marginHorizontal:20,marginVertical:10}}
                    onPress={()=>props.navigation.navigate("LogIn")}>
                </Button>
                </View>
        
            </View>
    );
}

export default withNavigation(IDValidateFailTemplet);