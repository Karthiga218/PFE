// Reducer for RHJobs 
const init_state = {

    Location: { Latitude: 'null', Longitude: 'null' },
    NearestAddress: [],
    ServiceAddress: '',
    Borough:'',
    ZipCode:'',
    JobsCounter: 0,
    ShowCamera: 0,// 0 off ,1 for COF, 2 for old decal,3 for new decal
    TaskCounter: 0,
    Jobs: [],
    UsedDecal:[],

}

class Job {
    constructor(ClientName, ServiceAddress, AddressLine2, Borough,ZipCode,Id, CreateDate, CreateTime,RefId) {
        this.Id = Id;
        this.CreateTime = CreateTime;
        this.CreateDate = CreateDate;
        this.CompleteTime = "N/A"
        this.ClientName = ClientName;
        this.ServiceAddress = ServiceAddress;
        this.AddressLine2 = AddressLine2;
        this.Borough = Borough;
        this.ZipCode = ZipCode;
        this.Status = "ACTIVE";
        this.Tasks = [];
        this.RefId= RefId;

    }
}


class Task {
    constructor(index, ExistingDecal, PreviousDecal, StartTime) {
        this.Status = "ACTIVE";
        this.Result = null; //comp or non comp
        this.Index = index;
        this.Name = PreviousDecal;
        this.SurveyResult = { Crit: null, Critical: {}, NonCrit: null, NonCritical: {} };
        this.ExistingDecal = ExistingDecal;
        this.NewDecal = "";
        this.StartTime = StartTime;
        this.FinishTime = "N/A"
        this.Precipitator = { status: null, service: null, compliant: null }
    }
}




export default (state = init_state, action) => {
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (action.type === "RESET") {
        console.log("reset all reducer,jobReducer")
        return init_state
    }
    if(action.type === "Reset_JobReducer"){
        console.log("Reset Jobreducer")
        return init_state
    }
    if (action.type === "Save_Location") {
        const newState = JSON.parse(JSON.stringify(state));
        newState.Location.Latitude = action.Latitude;
        newState.Location.Longitude = action.Longitude;
        return newState;
    }
    if (action.type === "Save_Nearest_Address") {
        const newState = JSON.parse(JSON.stringify(state));
        newState.NearestAddress = action.AddressList;
        return newState;
    }
    if (action.type === "Save_Service_Address") {
        const newState = JSON.parse(JSON.stringify(state));
        newState.ServiceAddress = action.Address;
        newState.ZipCode = action.ZipCode;
        switch (action.BoroughCode){
            case '1':
                newState.Borough = 'Manhattan';
                break;
            case '2':
                newState.Borough = 'Bronx';
                break;
            case '3':
                newState.Borough = 'Brooklyn';
                break;
            case '4':
                newState.Borough = 'Queens';
                break;
            case '5':
                newState.Borough = 'Staten Island';
                break;
        }


        // AsyncStorage.setItem("Service_Address", action.Address);
        return newState;
    }

    if (action.type === "Add_Job") {
        const newState = JSON.parse(JSON.stringify(state));
        let Id = newState.JobsCounter;
        let CreateTime = new Date();
        let mm = month[CreateTime.getMonth()];
        let dd = CreateTime.getDate();
        let CreateDate = `${mm} ${dd}`;
        let newJob = new Job(action.ClientName, action.ServiceAddress, action.AddressLine2, action.Borough,action.ZipCode,Id, CreateDate, CreateTime.toString(),action.RefId)
        newState.Jobs.push(newJob);
        newState.JobsCounter = newState.JobsCounter + 1;//set counter for next job

        return newState;
    }
    if (action.type === 'Add_Task') {
        const newState = JSON.parse(JSON.stringify(state));
        let index = newState.Jobs[action.JobId].Tasks.length;
        let StartTime = (new Date()).toString();
        newState.UsedDecal = [...new Set([...newState.UsedDecal,action.PreviousDecal])]
        newState.Jobs[action.JobId].Tasks.push(new Task(index, action.ExistingDecal, action.PreviousDecal, StartTime));
        console.log(JSON.stringify(newState.Jobs[action.JobId].Tasks[index]))
        return newState;
    }
    if (action.type === "Precipitator_Status_Yes") {
        const newState = JSON.parse(JSON.stringify(state));
        //console.log(typeof(action.JobId))
        newState.Jobs[action.JobId].Tasks[action.taskIndex].Precipitator.status = true;
        return newState
    }

    if (action.type === "Precipitator_Status_No") {
        const newState = JSON.parse(JSON.stringify(state));
        //console.log(typeof(action.JobId))
        newState.Jobs[action.JobId].Tasks[action.taskIndex].Precipitator.status = false;
        newState.Jobs[action.JobId].Tasks[action.taskIndex].Precipitator.service = null;
        newState.Jobs[action.JobId].Tasks[action.taskIndex].Precipitator.compliant = null;
        return newState
    }
    if (action.type === "Precipitator_Service_Yes") {
        const newState = JSON.parse(JSON.stringify(state));
        //console.log(typeof(action.JobId))
        newState.Jobs[action.JobId].Tasks[action.taskIndex].Precipitator.service = true;
        return newState
    }

    if (action.type === "Precipitator_Service_No") {
        const newState = JSON.parse(JSON.stringify(state));
        //console.log(typeof(action.JobId))
        newState.Jobs[action.JobId].Tasks[action.taskIndex].Precipitator.service = false;
        newState.Jobs[action.JobId].Tasks[action.taskIndex].Precipitator.compliant = null;
        return newState
    }
    if (action.type === "Precipitator_Compliant_Yes") {
        const newState = JSON.parse(JSON.stringify(state));
        //console.log(typeof(action.JobId))
        newState.Jobs[action.JobId].Tasks[action.taskIndex].Precipitator.compliant = true;
        return newState
    }

    if (action.type === "Precipitator_Compliant_No") {
        const newState = JSON.parse(JSON.stringify(state));
        //console.log(typeof(action.JobId))
        newState.Jobs[action.JobId].Tasks[action.taskIndex].Precipitator.compliant = false;
        return newState
    }






    // if (action.type === "Update_Task_Result") {
    //     const newState = JSON.parse(JSON.stringify(state));
    //     let JobId = action.JobId; let taskIndex = action.taskIndex;
    //     newState.Jobs[JobId].Tasks[taskIndex].Result = action.result;
    //     if (action.result === "Compliant") {
    //         newState.Jobs[JobId].Tasks[taskIndex].SurveyResult = { Critical: {}, NonCritical: {} };
    //     }
    //     console.log(newState)
    //     return newState
    // }



    if (action.type === "Check_Compliant") {
        const newState = JSON.parse(JSON.stringify(state));
        newState.Jobs[action.JobId].Tasks[action.taskIndex].Result = "Compliant";
        newState.Jobs[action.JobId].Tasks[action.taskIndex].SurveyResult = { Crit: false, Critical: {}, NonCrit: null, NonCritical: {} };
        return newState;
    }



    if (action.type === "Check_NonCompliant") {
        const newState = JSON.parse(JSON.stringify(state));
        newState.Jobs[action.JobId].Tasks[action.taskIndex].Result = "Non-Compliant";
        newState.Jobs[action.JobId].Tasks[action.taskIndex].SurveyResult = { Crit: true, Critical: {}, NonCrit: null, NonCritical: {} };
        return newState;
    }
    if (action.type === "NonCrit_Yes") {
        const newState = JSON.parse(JSON.stringify(state));
        newState.Jobs[action.JobId].Tasks[action.taskIndex].SurveyResult.NonCrit = true;
        return newState;

    }
    if (action.type === "NonCrit_No") {
        const newState = JSON.parse(JSON.stringify(state));
        newState.Jobs[action.JobId].Tasks[action.taskIndex].SurveyResult.NonCrit = false;
        newState.Jobs[action.JobId].Tasks[action.taskIndex].SurveyResult.NonCritical = {};

        return newState;

    }




    if (action.type === "Save_Answer") {
        let JobId = action.JobId; let taskIndex = action.taskIndex; let deficiency = action.deficiency;
        const newState = JSON.parse(JSON.stringify(state));

        if (!newState.Jobs[JobId].Tasks[taskIndex].SurveyResult[deficiency].hasOwnProperty(action.question)) {
            newState.Jobs[JobId].Tasks[taskIndex].SurveyResult[deficiency][action.question] = [action.answer]
        }
        else {
            if (!newState.Jobs[JobId].Tasks[taskIndex].SurveyResult[deficiency][action.question].includes(action.answer)) {
                newState.Jobs[JobId].Tasks[taskIndex].SurveyResult[deficiency][action.question] = [...new Set(newState.Jobs[JobId].Tasks[taskIndex].SurveyResult[deficiency][action.question]), action.answer]
            }
            else {
                if (action.answer === "Other") {
                    newState.Jobs[JobId].Tasks[taskIndex].SurveyResult[deficiency][action.question] = newState.Jobs[JobId].Tasks[taskIndex].SurveyResult[deficiency][action.question].filter(i => !i.hasOwnProperty("comment"))
                }
                newState.Jobs[JobId].Tasks[taskIndex].SurveyResult[deficiency][action.question] = newState.Jobs[JobId].Tasks[taskIndex].SurveyResult[deficiency][action.question].filter(i => i != action.answer);
                if (newState.Jobs[JobId].Tasks[taskIndex].SurveyResult[deficiency][action.question].length === 0) { delete newState.Jobs[JobId].Tasks[taskIndex].SurveyResult[deficiency][action.question] }
            }

        }

        console.log(newState.Jobs)
        return newState
    }
    if (action.type === "Save_Comment") {
        let JobId = action.JobId; let taskIndex = action.taskIndex; let deficiency = action.deficiency;
        const newState = JSON.parse(JSON.stringify(state));
        let result = newState.Jobs[JobId].Tasks[taskIndex].SurveyResult[deficiency][action.question];
        let index = result.findIndex(i => i.hasOwnProperty("comment"))
        if (index === -1) {
            console.log("new comment", action.comment)


            newState.Jobs[JobId].Tasks[taskIndex].SurveyResult[deficiency][action.question] = [...result, { comment: action.comment.replace(/\n/ig, '') }];
            //console.log(result)
            console.log(newState)
            return newState
        } else {
            console.log("replace comment", action.comment)
            newState.Jobs[JobId].Tasks[taskIndex].SurveyResult[deficiency][action.question].splice(index, 1, { comment: action.comment.replace(/\n/ig, '') })
            console.log(newState)
            return newState
        }

        // newState.SurveyResult[action.question]["Comment"]=action.comment.replace(/\n/ig, '');



        // console.log(newState.Jobs)

    }
    if (action.type === "Turn_On_Old_Decal_Camera") {
        const newState = JSON.parse(JSON.stringify(state));
        newState.ShowCamera = 2;
        console.log("Turn On Old Decal  Camera")
        return newState;
    }
    if (action.type === "Turn_Off_Camera") {
        const newState = JSON.parse(JSON.stringify(state));
        newState.ShowCamera = 0;
        console.log("Turn Off    Camera")
        return newState;
    }
    if (action.type === "Turn_On_New_Decal_Camera") {
        const newState = JSON.parse(JSON.stringify(state));
        newState.ShowCamera = 3;
        console.log("turn on new decal camera")
        return newState;
    }


    if (action.type === "Save_New_Decal") {
        const newState = JSON.parse(JSON.stringify(state));
        let JobId = action.JobId; let taskIndex = action.taskIndex
        //add decal to used decal array
        newState.UsedDecal = [...new Set([...newState.UsedDecal,action.NewDecal])]
        newState.Jobs[JobId].Tasks[taskIndex].NewDecal = action.NewDecal;
        newState.Jobs[JobId].Tasks[taskIndex].FinishTime = (new Date()).toString();

        console.log(newState);

        return newState;
    }
    if(action.type === "OverWrite_New_Decal"){
        const newState = JSON.parse(JSON.stringify(state));
        let JobId = action.JobId; let taskIndex = action.taskIndex;
        newState.Jobs[JobId].Tasks[taskIndex].NewDecal ='';
        newState.Jobs[JobId].Tasks[taskIndex].FinishTime ='N/A';
        return newState

    }




    if (action.type === "Finish_Task") {
        const newState = JSON.parse(JSON.stringify(state));
        let JobId = action.JobId; let taskIndex = action.taskIndex;
        newState.Jobs[JobId].Tasks[taskIndex].Status = "COMPLETED";
        console.log(JSON.stringify(newState.Jobs[JobId].Tasks[taskIndex]))
        return newState;



    }
    if (action.type === "Delete_Tasks") {
        const newState = JSON.parse(JSON.stringify(state));
        let { JobId, deleteSelection } = action;
        let tempTasks = newState.Jobs[JobId].Tasks;
        deleteSelection.forEach(i => {
            //delete tempTasks[i]
            tempTasks[i].Status = "DELETED";
            if(newState.UsedDecal.includes(tempTasks[i].NewDecal)){
                newState.UsedDecal=newState.UsedDecal.filter( decal => decal !== tempTasks[i].NewDecal)
            }
        });
        console.log(tempTasks);
        return newState
    }
    if(action.type ==="Submit_Job"){
        const newState = JSON.parse(JSON.stringify(state));
        let JobId = action.JobId;
        newState.Jobs[JobId].CompleteTime = new Date();
        newState.Jobs[JobId].Status = "COMPLETED";
        return newState
    }
    return state
}


