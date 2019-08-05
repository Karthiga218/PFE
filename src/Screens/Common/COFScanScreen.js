import React, { Component } from 'react';
import { createAppContainer, createStackNavigator, createBottomTabNavigator, navigationOptions, SafeAreaView } from 'react-navigation';
import { Platform, StyleSheet, CameraRoll, Dimensions, Image, Alert, TouchableOpacity, TouchableHighlight, View, Text, Button, TextInput } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Camera from 'react-native-camera';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../../Styles/styles';

import { connect } from 'react-redux';


class COFScanScreen extends React.Component {
    // constructor(props){
    //     super(props)

    // }




    static navigationOptions = () => ({
        title: 'Scan Your Barcode',
        headerTintColor: "white",
        headerTitleStyle: {
            color: "white"
        },
        headerStyle: {
            backgroundColor: '#e61616',

        }
    });


    componentDidMount() {

        this.props.TurnOnCOFCamera();

    }
    _onBarCodeRead(e) {

        // console.log(e);
        // console.log(e.data);
        this.props.saveBarcodeResult(e.data);
        this.props.navigation.navigate('BarcodeConfirm');


    }


    render() {
        // console.log(this.props.BarCodeResult)
        const ShowCamera = this.props.ShowCamera;
        return (
    
            <View style={{ flex: 1 }}>
                {
                    (ShowCamera === 1) ? (<RNCamera
                        ref={ref => { this.camera = ref; }}
                        style={styles.preview}
                        type={RNCamera.Constants.Type.back}
                        barCodeTypes={[RNCamera.Constants.BarCodeType.code128, RNCamera.Constants.BarCodeType.code39, RNCamera.Constants.BarCodeType.code93, RNCamera.Constants.BarCodeType.pdf417]}
                        onBarCodeRead={this._onBarCodeRead.bind(this)}
                    />) : (<View />)
                }

                <View style={{
                    flex: 1, position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    zIndex: 99
                }}>

                    <View style={{ flex: 0.7 }}><View style={{ backgroundColor: "rgba(1,1,1,0.6)", width: Dimensions.get('window').width, height: "100%" }}></View></View>
                    <View style={{ flex: 0.8, flexDirection: "row" }}>
                        <View style={{ flex: 1 }}><View style={{ backgroundColor: "rgba(1,1,1,0.6)", width: Dimensions.get('window').width / 12, height: "100%" }}></View></View>
                        <View style={{ flex: 10 }}>
                            <View style={styles.topLeftEdge} />
                            <View style={styles.topRightEdge} />
                            <View style={styles.bottomLeftEdge} />
                            <View style={styles.bottomRightEdge} />







                        </View>
                        <View style={{ flex: 1 }}><View style={{ backgroundColor: "rgba(1,1,1,0.6)", width: Dimensions.get('window').width / 12, height: "100%" }}></View></View>

                    </View>
                    <View style={{ flex: 1 }}><View style={{ backgroundColor: "rgba(1,1,1,0.6)", width: Dimensions.get('window').width, height: "100%" }}></View></View>

                </View>
            </View>
   
        )

    }
}

const mapStateToProps = (state) => {
    return {
        BarCodeResult: state.DefaultReducer.BarCodeResult,
        ShowCamera: state.DefaultReducer.ShowCamera,


    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        saveBarcodeResult(data) {
            const action = {
                type: "Save_Barcode_Result",
                Barcode: data
            }
            dispatch(action);
        },
        TurnOnCOFCamera() {
            const action = {
                type: "Turn_On_COF_Camera",
            }
            dispatch(action)
        }
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(COFScanScreen)