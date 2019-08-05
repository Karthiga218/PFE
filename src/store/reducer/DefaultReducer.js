import AsyncStorage from '@react-native-community/async-storage';



// May NEED TO CHANGE INIT STATE, IF MULTI-USER.....

const init_state = {
    ShowCamera: 1,//0 for off Camera, 1 for on COF Camera, 2 for on ... Camera
    BarCodeResult: '',
    // OCRResult:'',
    CERT: '',
    CertType: '',
    Expiration: '',
    Employer: '',
    HolderName: '',
    Location: { Latitude: 'null', Longitude: 'null' },
    SurveyType: '',
    ValidateHolder: 'NO',
    LogInTime: null,
    //LogInTime: null,
    AppMessage: '',


}

export default (state = init_state, action) => {
    if (action.type === "Save_Barcode_Result") {
        const newState = JSON.parse(JSON.stringify(state));
        newState.BarCodeResult = action.Barcode.substring(0, 8);
        //newState.CERT = action.Barcode.substring(0, 8);
        newState.ShowCamera = 0;
        //AsyncStorage.setItem('COF', action.Barcode);
        console.log("COF Barcode Saved,and Turn off COF Barcode Camera")
        // newState.CertType = action.Barcode.substring(action.Barcode.length-3); 
        return newState;
    }
    if (action.type === "Save_CERT") {
        const newState = JSON.parse(JSON.stringify(state));
        newState.CERT = action.BarCodeResult;
        //newState.LogInTime = new Date();
        return newState;
    }
    // if(action.type === "Save_OCR_Result"){
    //     const newState = JSON.parse(JSON.stringify(state));
    //     newState.OCRResult = action.OCR;
    //     // const temp3 = action.OCR.split('\n').filter(i =>i.search(/EXPIRES/g)!=-1)[0];
    //     // newState.Expiration = temp3.slice(temp1.search(/EXPIRES/g)+8);

    //     const temp2 = action.OCR.split('\n').filter(i =>i.search(/NAME/g)!=-1);
    //     if(temp2.length != 0){newState.LastName = temp2[0].split(' ')[2];}
    //     else{newState.LastName = ""}
    //     // newState.Expiration = action.OCR.split('\n').filter(i => i.startsWith("EXPIRES"))[0].slice(7);

    //     const temp1 = action.OCR.split('\n').filter(i=>i.startsWith("EMPLOYER"));
    //     if(temp1.length != 0 ){newState.Employer = temp1[0].slice(9)}
    //     else {newState.Employer = ""}
    //     // newState.Employer = action.OCR.split('\n').filter(i=>i.startsWith("EMPLOYER"))[0].slice(9);
    //     // newState.LastName = action.OCR.split('\n').filter(i=>i.startsWith("NAME"))[0].split(' ').reverse()[0];
    //     return newState;
    // }

    if (action.type === "Turn_On_COF_Camera") {
        const newState = JSON.parse(JSON.stringify(state));
        newState.ShowCamera = 1;
        console.log("Turn On COF Barcode Camera")
        return newState;
    }
    if (action.type === "Validation_Result") {
        const newState = JSON.parse(JSON.stringify(state));
        newState.AppMessage = action.appMessage;
        newState.ValidateHolder = action.validateHolder;
        if (action.validateHolder === "YES") {
            newState.LogInTime = new Date();
            newState.CertType = action.fullResponse.certType;
            newState.Employer = action.fullResponse.employerName;
            newState.Expiration = action.fullResponse.expirationDate;
            newState.HolderName = action.fullResponse.holderName;
            newState.SurveyType = action.fullResponse.surveyType;
            console.log("CertType is ", newState.CertType);
            //AsyncStorage.multiSet([["COF_CertType", action.fullResponse.certType], ["Employer", action.fullResponse.employerName], ["Expiration", action.fullResponse.expirationDate], ["HolderName", action.fullResponse.holderName]])
        }
        return newState;
    }

    // if (action.type === "Save_Answer") {
    //     const newState = JSON.parse(JSON.stringify(state));

    //     if (!newState.SurveyResult.hasOwnProperty(action.question)) {
    //         newState.SurveyResult[action.question] = [action.answer]
    //     }
    //     else {
    //         if (!newState.SurveyResult[action.question].includes(action.answer)) {
    //             newState.SurveyResult[action.question] = [...new Set(newState.SurveyResult[action.question]), action.answer]
    //         }
    //         else {
    //             if (action.answer === "Other") {
    //                 newState.SurveyResult[action.question] = newState.SurveyResult[action.question].filter(i => !i.hasOwnProperty("comment"))
    //             }
    //             newState.SurveyResult[action.question] = newState.SurveyResult[action.question].filter(i => i != action.answer)
    //         }

    //     }

    //     console.log(newState.SurveyResult)
    //     return newState
    // }
    // if (action.type === "Save_Comment") {
    //     const newState = JSON.parse(JSON.stringify(state));
    //     newState.SurveyResult[action.question] = [...new Set(newState.SurveyResult[action.question]), { comment: action.comment.replace(/\n/ig, '') }]
    //     // newState.SurveyResult[action.question]["Comment"]=action.comment.replace(/\n/ig, '');



    //     console.log(newState.SurveyResult)
    //     return newState
    // }
    if (action.type === "Save_YesNo_Answer") {
        const newState = JSON.parse(JSON.stringify(state))
        newState.SurveyResult[action.question] = action.answer;
        console.log(newState.SurveyResult)
        return newState

    }
    if (action.type === "RESET") {


        console.log("reset all reducer,default reducer")
        return init_state
    }
    return state
}

