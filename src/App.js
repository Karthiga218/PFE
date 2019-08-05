import React, { Component } from "react";
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import {
  Platform,
  ActivityIndicator,
  StyleSheet,
  CameraRoll,
  Dimensions,
  Image,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Text,
  Button,
  TextInput
} from "react-native";
import { RNCamera } from "react-native-camera";
import Spinner from "react-native-loading-spinner-overlay";
import { store, persistor } from "./store/storeindex";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import LogInScreen from "./Screens/Common/LogInScreen";
import BarcodeConfirmScreen from "./Screens/Common/BarcodeConfirmScreen";
import LocationConfirmScreen from "./Screens/Common/LocationConfirmScreen";
import COFScanScreen from "./Screens/Common/COFScanScreen";
import IDValidatedScreen from "./Screens/Common/IDValidated";
import IDValidateFailScreen from "./Screens/Common/IDValidateFail";
import AddressOverwriteScree from "./Screens/Common/AddressOverwrite";
import ClientInfoScreen from "./Screens/Common/ClientInfoScreen";
import RHSurveyMainScreen from "./Screens/RH/RHSurveyMainScreen";

import RHCriticalDeficiencyQuestionScreen from "./Screens/RH/RHCriticalDeficiencyQuestionScreen";
import RHNonCriticalDeficiencyQuestionScreen from "./Screens/RH/RHNonCriticalDeficiencyQuestionScreen";
import RHPreSurveyScreen from "./Screens/RH/RHPreSurveyScreen";
import RHClientsScreen from "./Screens/RH/RHClientsScreen";
import RHCleaningProcessScreen from "./Screens/RH/RHCleaningProcessScreen";
import RHNewDecalScreen from "./Screens/RH/RHNewDecalScreen";
import RHTasksScreen from "./Screens/RH/RHTasksScreen";
import RHPrecipitatorStatusScreen from "./Screens/RH/RHPrecipitatorStatusScreen";
import RHTaskSummaryScreen from "./Screens/RH/RHTaskSummaryScreen";
import DecalBarcodeReadScreen from "./Screens/Common/DecalBarcodeReadScreen";
import RHJobSummaryScreen from "./Screens/RH/RHJobSummaryScreen";

import PFEClientsScreen from "./Screens/PFE/PFEClientsScreen";
import PFETasksScreen from "./Screens/PFE/PFETasksScreen";
import PFEAddNewScreen from "./Screens/PFE/PFEAddNewScreen";
import PFEsearchScreen from "./Screens/PFE/PFEsearchScreen";
import PFEClientLocationCheckScreen from "./Screens/PFE/PFEClientLocationCheckScreen";
import PFELocationConfirmScreen from "./Screens/PFE/PFELocationConfirmationScreen";
import PFEClientInfoScreen from "./Screens/PFE/PFEClientInfoScreen";
import PFEStartServiceScreen from "./Screens/PFE/PFEStartServiceScreen";
import PFEServicingScreen from "./Screens/PFE/PFEServicingScreen";
import PFEAddNewTagScreen from "./Screens/PFE/PFEAddNewTagScreen";
import PFEJobSummaryScreen from "./Screens/PFE/PFEJobSummaryScreen";
import PFEAddressOverWrite from "./Screens/Common/PFEAddressOverwrite";

const AppNavigator = createStackNavigator(
  {
    LogIn: { screen: LogInScreen, navigationOptions: { header: null } },
    LocationConfirm: LocationConfirmScreen,
    COFScan: COFScanScreen,
    IDValidated: IDValidatedScreen,
    IDValidateFail: IDValidateFailScreen,
    AddressOverwrite: AddressOverwriteScree,
    BarcodeConfirm: { screen: BarcodeConfirmScreen },
    ClientInfo: ClientInfoScreen,
    RHSurveyMain: RHSurveyMainScreen,
    RHPreSurvey: RHPreSurveyScreen,
    RHCleaningProcess: RHCleaningProcessScreen,
    RHCriticalDeficiencyQuestion: RHCriticalDeficiencyQuestionScreen,
    RHClients: RHClientsScreen,
    RHNonCriticalDeficiencyQuestion: RHNonCriticalDeficiencyQuestionScreen,
    RHNewDecal: RHNewDecalScreen,
    RHTasks: RHTasksScreen,
    RHPrecipitatorStatus: RHPrecipitatorStatusScreen,
    RHTaskSummary: RHTaskSummaryScreen,
    DecalBarcodeRead: DecalBarcodeReadScreen,
    RHJobSummary: RHJobSummaryScreen,
    PFEClients: PFEClientsScreen,
    PFETasks: PFETasksScreen,
    PFEAddNew: PFEAddNewScreen,
    PFEClientLocationCheck: PFEClientLocationCheckScreen,
    PFEsearch: PFEsearchScreen,
    PFELocationConfirm: PFELocationConfirmScreen,
    PFEClientInfo: PFEClientInfoScreen,
    PFEStartService: PFEStartServiceScreen,
    PFEServicing: PFEServicingScreen,
    PFEAddNewTag: PFEAddNewTagScreen,
    PFEJobSummary: PFEJobSummaryScreen,
    PFEAddressOverWrite: PFEAddressOverWrite
  },
  {
    //initialRouteName: "LogIn"
    initialRouteName: "PFEClients"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  renderLoading = () => {
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <ActivityIndicator size="large" />
    </View>;
  };
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={this.renderLoading()}>
          <AppContainer />
        </PersistGate>
      </Provider>
    );
  }
}
