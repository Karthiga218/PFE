import React, { Component } from 'react';

import { Platform, StyleSheet, CameraRoll, Dimensions, Image, Alert, TouchableOpacity, TouchableHighlight, View, Text, TextInput } from 'react-native';

import styles from '../../Styles/styles';
import { connect } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Button } from 'react-native-elements';


class IDValidatedScreen extends Component {
    constructor(props) {
        super(props);

    }


    static navigationOptions = ({ navigation }) => {
        let header = (navigation.getParam('appMessage') === "COF is valid.") ? "Valid COF" : "Expired COF"
        return (
            // title: 'Valid COF',//need change this to  "Expired COF"  if expired but still in grace period
            {
                headerTitle: <View style={{ width: "100%", justifyContent: "center", flexDirection: "row" }}><Text style={{ fontSize: 20, color: "white" }}>{header}</Text></View>,
                headerTintColor: "white",
                headerTitleStyle: {
                    color: "white"
                },
                headerRight: (<FontAwesome5 name={"question-circle"} color={"white"} size={20} style={{ marginRight: 20 }} />),
                headerStyle: {
                    backgroundColor: '#e61616',

                }
            }
        )

    };



    confirmDetails() {
        let CertType = this.props.CertType

        this.props.resetJobReducer();// Since tha app cach the job info, when another user log in, he should not see the other's jobs
        //...meaning create new blank jobReducer for a new Validated User Login.
        if (CertType === ('W64') || CertType === ('P64')) {
            this.props.navigation.navigate("RHClients");
        } else {

            this.props.navigation.navigate("PFEClients")
        }

    }




    render() {
        // 
        let bottomContinueButtonStyle = (Platform.OS ==='ios')? styles.bottomContinueButtoniOS :styles.bottomContinueButtonAndroid;
        const { CERT, CertType, Name, Employer, Expiration, AppMessage } = this.props;

        let warningText = '';
        if (AppMessage !== 'COF is valid.') {
            let ExpirationDate = new Date(Expiration);
            ExpirationDate.setDate(ExpirationDate.getDate() + 90);

            let dd = ExpirationDate.getDate();
            let mm = ExpirationDate.getMonth() + 1;
            let yyyy = ExpirationDate.getFullYear();

            let GraceDate = mm + "/" + dd + "/" + yyyy;
            let now = new Date();
            let startDate = Date.parse(Expiration);
            let endDate = Date.parse(now);
            let timeDiff = endDate - startDate;
            let daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            let GracePeriodLeft = 90 - daysDiff;

            warningText = <Text>Your COF has expired. If your COF card is <Text style={{ fontWeight: "bold" }}>not </Text>renewed by <Text style={{ fontWeight: "bold" }}>{GraceDate} </Text>you will <Text style={{ fontWeight: "bold" }}>not</Text> be able to use this mobile app.</Text>

        }
        else warningText = null;



        return (
            <View style={{ flex: 1, flexDirection: "column" }}>
                <View style={{ margin: 10 }}><Text style={{ fontSize: 16, color: "black" }}>{warningText}</Text></View>
                <View style={styles.textPreview}>

                    <Text style={{ margin: 10, fontSize: 16, color: "#333333" }}>Certificate Number: <Text style={{ fontWeight: 'bold' }}>{CERT}</Text></Text>
                    <Text style={{ margin: 10, fontSize: 16, color: "#333333" }}>Certificate Type: <Text style={{ fontWeight: 'bold' }}>{CertType}</Text></Text>
                    <Text style={{ margin: 10, fontSize: 16, color: "#333333" }}>Name: <Text style={{ fontWeight: 'bold' }}>{Name}</Text></Text>
                    <Text style={{ margin: 10, fontSize: 16, color: "#333333" }}>Employer: <Text style={{ fontWeight: 'bold' }}>{Employer}</Text></Text>
                    <Text style={{ margin: 10, fontSize: 16, color: "#333333" }}>Expiration Date: <Text style={{ fontWeight: 'bold' }}>{Expiration}</Text></Text>
                    {/* <Text style={{ margin: 10 }}>Valid: <Text style={{ fontWeight: 'bold' }}>{Valid}</Text></Text>
                    <Text style={{ margin: 10 }}>COF Holder Verified </Text> */}
                    {/* <View style={{flexDirection:"row",justifyContent:'space-around',marign:10}}>
                    <Text style = {{color:"blue"}} onPress ={()=>this.confirmDetails()}>CONTINUE</Text> 
                    </View>   */}

                </View>
                <Button type="solid" title="CONTINUE" raised
                    buttonStyle={bottomContinueButtonStyle }
                    containerStyle={styles.bottomContinueButtonContainer}
                    onPress={() => this.confirmDetails()}>
                </Button>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        CERT: state.DefaultReducer.CERT,
        AppMessage: state.DefaultReducer.AppMessage,
        CertType: state.DefaultReducer.CertType,
        Name: state.DefaultReducer.HolderName,
        Employer: state.DefaultReducer.Employer,
        Expiration: state.DefaultReducer.Expiration,
        Valid: state.DefaultReducer.ValidateHolder

    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        resetJobReducer() {
            const action = {
                type: "Reset_JobReducer",
            }
            dispatch(action)
        }

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(IDValidatedScreen)


