import React, { Component } from 'react';
import { Platform, StyleSheet, CameraRoll, Dimensions, Image, Alert, TouchableOpacity, TouchableHighlight, Modal, Picker, FlatList, SectionList, View, Text, TextInput } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Button, Input, CheckBox,SearchBar ,Icon} from 'react-native-elements';
//import styles from '../../Styles/styles';




export default class HeaderSearchBar extends Component {



    constructor(props) {
        super(props);
        this.state={
            searchText:''
        }
        
    }

handleSearchBarTextChange(text){
    console.log("search",text)
this.setState({searchText:text},()=>this.props.searchFilterFunction(text))
    }
    
handleSearchBarOnClear(){
    this.setState({searchText:''},()=>this.props.searchFilterFunction(''))
}
render(){
    return(
        <View style={{ width: "100%" ,flexDirection:"row",alignContent:"center",alignItems:"center"}}>
        <SearchBar
        platform="default"
        containerStyle={{backgroundColor:"red",width:"100%",borderBottomWidth:0,borderTopWidth:0}}
        inputContainerStyle={{backgroundColor:"red",}}
        inputStyle={{fontSize:16,padding:0,color:"white"}}
        clearIcon={{size:30,color:"white"}}
        round
        lightTheme
        searchIcon={null}
        value = {this.state.searchText}
        onChangeText={(text)=>this.handleSearchBarTextChange(text)}
        placeholder="Search tags Here..."
       onClear={()=>this.handleSearchBarOnClear()}
        />
        </View> 
    )
}
}




