
import React, { Component } from 'react';
import { Platform, StyleSheet, CameraRoll, Dimensions, Alert, BackHandler,TouchableOpacity, TouchableHighlight, Modal, Picker, FlatList,SectionList, View, Text, TextInput } from 'react-native';

import { Button ,Image} from 'react-native-elements';
import styles from '../../Styles/styles';
import ProgressCircle from 'react-native-progress-circle';
import { connect } from 'react-redux';

// Step 2


class CleaningProcessScreen extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props){
        super(props);
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
    }

    static navigationOptions = () => {
        return{  
            headerTitle: <View style={{width:"100%",flexDirection:"row",justifyContent:"center"}}><Text  style={{color:"white",fontSize:20}}>Servicing</Text></View>,
            headerLeft: <View><Text> </Text></View>,
            headerRight:<View><Text> </Text></View>,
            headerTintColor: "white",
        headerStyle: {
            backgroundColor: '#e61616',

        },
        // headerRight: (
        //     <View style={{flexDirection:"row"}}><Text style={{color:"white"}}>Save and exit</Text></View>
        //    )
        }

      
    };


altNav(CertType,JobId,taskIndex){
    if(CertType === 'P64'){
        this.props.navigation.navigate('RHPrecipitatorStatus',{JobId:JobId,taskIndex:taskIndex})
    }
    else{
        this.props.navigation.navigate('RHSurveyMain',{JobId:JobId,taskIndex:taskIndex})
    }

}
componentDidMount() {
        
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
  );
}

componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
      let JobId = this.props.navigation.getParam("JobId");
  this.props.navigation.navigate('RHTasks',{JobId:JobId});
  return true
  };

    render() {
        let bottomContinueButtonStyle = (Platform.OS ==='ios')? styles.bottomContinueButtoniOS :styles.bottomContinueButtonAndroid;
        if(this.props.Jobs.length === 0){
            return <View></View>
        }else{
        let JobId = this.props.navigation.getParam("JobId");
        let taskIndex = this.props.Jobs[JobId].Tasks.length-1;
        return (
            <View style={{flex:1}}>
                <View style={{ flexDirection: "row", borderBottomColor: "#d6d6d6", borderBottomWidth: 2, padding: 10 }}>
                    <ProgressCircle
                        percent={20}
                        radius={25}
                        borderWidth={5}
                        color="#4f962b"
                        shadowColor="#d6d6d6"
                        bgColor="#fff"
                    >
                        <Text style={{ fontSize: 10 }}>{'20%'}</Text>
                    </ProgressCircle>
                    <View style={{ justifyContent: "center", alignItems: "center", marginLeft: 20 }}>
                        <Text style={{fontSize: 20,color: "black" }}>Servicing is in Progress</Text>
                    </View>

                </View>
            <View style={styles.textPreview}>
            <Text style={{fontSize:16,color:"black",padding:20,lineHeight:30}}>Complete the survey after servicing the Rangehood.</Text>

            </View>

            <Image containerStyle={{flex:1,flexDirection:'row',justifyContent:"center",alignContent:"center"}} style={{width:200,height:200}} source={require('../../image/glove.png')} resizeMode='contain'/>
           
       <View style={{flexDirection: 'column', justifyContent: "center",  position: 'absolute',bottom:0,width:"100%",paddingVertical:10,borderTopColor: "rgb(242, 242, 242)", borderTopWidth: 1,borderBottomWidth:0}}>
           <Button type="solid" title="START SURVEY" raised
                 buttonStyle={{width:"100%"}}
                 //containerStyle={{flexDirection: "row", justifyContent: "center",  position: 'absolute',bottom:60,width:"100%",paddingVertical:10,borderTopColor: "rgb(242, 242, 242)", borderTopWidth: 1,borderBottomWidth:0}}
                    containerStyle={{flex:1,marginVertical:10,marginHorizontal:"10%"}}
                    onPress={ 
                    //    ()=> {this.props.navigation.navigate('RHPrecipitatorStatus',{JobId:JobId,taskIndex:taskIndex}) }
                        // depends on CertType to go Precipitator(w/ P) OR SurveyMain (w/o P)

                        ()=>{this.altNav(this.props.CertType,JobId,taskIndex)}
                    }
                    >
                </Button>
       
               
                <Button type="outline" title="BACK TO HOOD LIST" raised
                     buttonStyle={{width:"100%"}}
                    // containerStyle={{flexDirection: "row", justifyContent: "center",  position: 'absolute',bottom:0,width:"100%",paddingVertical:10,borderWidth:0}}
                     containerStyle={{flex:1,marginHorizontal:"10%"}}
                    onPress={() => this.props.navigation.navigate('RHTasks',{JobId:JobId})}>
                </Button>
       </View>
               
           
            
            </View>
        );
                }
    }
}


const mapStateToProps = (state) => {
    return {
        Jobs:state.RHJobsReducer.Jobs,
        CertType:state.DefaultReducer.CertType,
        //CertType : state.DefaultReducer.CertType,  //Check COF type P64 nav to precipitator Q
    }
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         addTask(JobId) {
//             const action = {
//                 type: "Add_Task",
//                 JobId
//             }
//             console.log(action)
//             dispatch(action)
//         }
//     }

// }


export default connect(mapStateToProps,null)(CleaningProcessScreen)
