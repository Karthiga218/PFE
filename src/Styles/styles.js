import { Platform, StyleSheet,CameraRoll,Dimensions,Image, Alert, TouchableOpacity, TouchableHighlight, View, Text, Button, TextInput } from 'react-native';

export default StyleSheet.create({
    textPreview: {
      padding:10,
      margin:15,backgroundColor: "white", borderColor: '#ddd',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 2,
      justifyContent:"space-between"
    },
    bottomContinueButtonContainer:{
      flexDirection: "row", justifyContent: "center",  position: 'absolute',bottom:0,width:"100%",paddingVertical:10,borderTopColor: "rgb(242, 242, 242)", borderTopWidth: 1
    }
    ,
    bottomContinueButtoniOS:{
      width:"100%"      
    },
    bottomContinueButtonAndroid:{
      width:"80%"
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width
    },
    bottom: {
      zIndex: 99,
      position: 'absolute',
      bottom: 35
    },
    capture: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      color: '#000',
      padding: 10,
      margin: 40
    },
    spinnerTextStyle: {
      color: '#FFF'
    },
    container: {
      flex: 1,
    },
    cameraView: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    maskOutter: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    maskInner: {
      width: 300,
      backgroundColor: 'transparent',
      borderColor: 'white',
      borderWidth: 1,
    },
    maskFrame: {
      backgroundColor: 'rgba(1,1,1,0.6)',
    },
    maskRow: {
      width: '100%',
    },
    maskCenter: { flexDirection: 'row' },
    inputSection:{backgroundColor:"red"},


    topLeftEdge: {
      position: "absolute",
      top: 0,
      left: 0,
      width: 40,
      height: 20,
      borderColor:"white",
      borderLeftWidth:2,
      borderTopWidth:2
    },
    topRightEdge: {
      position: "absolute",
      top: 0,
      right: 0,
      width: 40,
      height: 20,
      borderRightWidth:2,
      borderTopWidth:2,
      borderColor:"white"
    },
    bottomLeftEdge: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: 40,
      height: 20,
      borderLeftWidth:2,
      borderBottomWidth:2,
      borderColor:"white",
    },
    bottomRightEdge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 40,
      height: 20,
      borderRightWidth:2,
      borderBottomWidth:2,
      borderColor:"white",
    }
    ,headerDropDown:{
    width:"35%",
    backgroundColor:"white",
    borderBottomColor:"black",
    borderBottomWidth:0,
    justifyContent:"center",
    flexDirection:"row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    
    elevation: 24,}

  });
  
