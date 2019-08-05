import addressCheck from "../../COF_GIS";

// Reducer for PFEJob
const init_state = {
  Location: { Latitude: "null", Longitude: "null" },
  NearestAddress: [],
  ServiceAddress: "",
  JobsCounter: 0,
  ShowCamera: 0, // 0 off ,1 for COF, 2 for old decal,3 for new decal
  TaskCounter: 0,
  Jobs: [],
  SurveyResult: {}
};

class Job {
  constructor(
    ClientName,
    ServiceAddress,
    AddressLine2,
    Borough,
    ZipCode,
    Id,
    CreateDate,
    CreateTime,
    RefId
  ) {
    this.Id = Id;
    this.CreateTime = CreateTime;
    this.CreateDate = CreateDate;
    this.CompleteTime = "N/A";
    this.ClientName = ClientName;
    this.ServiceAddress = ServiceAddress;
    this.AddressLine2 = AddressLine2;
    this.Borough = Borough;
    this.ZipCode = ZipCode;
    this.Status = "ACTIVE";
    this.Tasks = [];
    this.RefId = RefId;
    this.newTasks = 0;
  }
}

class Task {
  constructor(index, tag, StartTime, ExistingName, step) {
    ExistingName = ExistingName || "";
    step = step || 0;
    if (step === 4) {
      this.Status = "COMPLETED";
    } else this.Status = "ACTIVE";
    this.Result = "null"; //comp or non comp
    this.Index = index;
    this.Name = tag;
    this.ExistingName = ExistingName;
    // this.ExistingDecal = ExistingDecal;
    // this.NewDecal = "";
    this.StartTime = StartTime;
    this.FinishTime = "N/A";
    this.step = step;
  }
}

export default (state = init_state, action) => {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  // if (action.type === "RESET") {
  //     console.log("reset all reducer,jobReducer")
  //     return init_state
  // }
  // if(action.type === "Reset_JobReducer"){
  //     console.log("Reset Jobreducer")
  //     return init_state
  // }

  // if (action.type === "Add_Job") {
  //     const newState = JSON.parse(JSON.stringify(state));
  //     let Id = newState.JobsCounter;
  //     let CreateTime = new Date();
  //     let mm = month[CreateTime.getMonth()];
  //     let dd = CreateTime.getDate();
  //     let CreateDate = `${mm} ${dd}`;
  //     let newJob = new Job(action.ClientName, action.ServiceAddress, action.AddressLine2, action.Borough,action.ZipCode,Id, CreateDate, CreateTime.toString(),action.RefId)
  //     newState.Jobs.push(newJob);
  //     newState.JobsCounter = newState.JobsCounter + 1;//set counter for next job

  //     return newState;
  // }
  // if (action.type === 'Add_Task') {
  //     const newState = JSON.parse(JSON.stringify(state));
  //     let index = newState.Jobs[action.JobId].Tasks.length;
  //     let StartTime = (new Date()).toString();
  //     newState.Jobs[action.JobId].Tasks.push(new Task(index, action.ExistingDecal, action.PreviousDecal, StartTime));

  //     return newState;
  // }

  // if (action.type === "Turn_On_Old_Decal_Camera") {
  //     const newState = JSON.parse(JSON.stringify(state));
  //     newState.ShowCamera = 2;
  //     console.log("Turn On Old Decal  Camera")
  //     return newState;
  // }
  // if (action.type === "Turn_Off_Camera") {
  //     const newState = JSON.parse(JSON.stringify(state));
  //     newState.ShowCamera = 0;
  //     console.log("Turn Off    Camera")
  //     return newState;
  // }
  // if (action.type === "Turn_On_New_Decal_Camera") {
  //     const newState = JSON.parse(JSON.stringify(state));
  //     newState.ShowCamera = 3;
  //     console.log("turn on new decal camera")
  //     return newState;
  // }

  // if (action.type === "Save_New_Decal") {
  //     const newState = JSON.parse(JSON.stringify(state));
  //     let JobId = action.JobId; let taskIndex = action.taskIndex;

  //     newState.Jobs[JobId].Tasks[taskIndex].NewDecal = action.NewDecal;
  //     //newState.Jobs[JobId].Tasks[taskIndex].Status = "COMPLETED";
  //     newState.Jobs[JobId].Tasks[taskIndex].FinishTime = (new Date()).toString();

  //     console.log(newState);

  //     return newState;
  // }
  // if (action.type === "Finish_Task") {
  //     const newState = JSON.parse(JSON.stringify(state));
  //     let JobId = action.JobId; let taskIndex = action.taskIndex;
  //     newState.Jobs[JobId].Tasks[taskIndex].Status = "COMPLETED";
  //     return newState;

  // }
  // if (action.type === "Delete_Tasks") {
  //     const newState = JSON.parse(JSON.stringify(state));
  //     let { JobId, deleteSelection } = action;
  //     let tempTasks = newState.Jobs[JobId].Tasks;
  //     deleteSelection.forEach(i => {
  //         delete tempTasks[i]
  //     });
  //     console.log(tempTasks);
  //     return newState
  // }
  // if(action.type ==="Submit_Job"){
  //     const newState = JSON.parse(JSON.stringify(state));
  //     let JobId = action.JobId;
  //     newState.Jobs[JobId].CompleteTime = new Date();
  //     newState.Jobs[JobId].Status = "COMPLETED";
  //     return newState
  // }

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
    switch (action.BoroughCode) {
      case "1":
        newState.Borough = "Manhattan";
        break;
      case "2":
        newState.Borough = "Bronx";
        break;
      case "3":
        newState.Borough = "Brooklyn";
        break;
      case "4":
        newState.Borough = "Queens";
        break;
      case "5":
        newState.Borough = "Staten Island";
        break;
    }

    // AsyncStorage.setItem("Service_Address", action.Address);
    return newState;
  }

  if (action.type === "Add_PFE_Job") {
    const newState = JSON.parse(JSON.stringify(state));
    let Id = newState.JobsCounter;
    let CreateTime = new Date();
    let mm = month[CreateTime.getMonth()];
    let dd = CreateTime.getDate();
    let CreateDate = `${mm} ${dd}`;
    let newJob = new Job(
      action.ClientName,
      action.ServiceAddress,
      action.AddressLine2,
      action.Borough,
      action.ZipCode,
      Id,
      CreateDate,
      CreateTime.toString(),
      action.RefId
    );
    newState.Jobs.push(newJob);
    newState.JobsCounter = newState.JobsCounter + 1; //set counter for next job

    return newState;
  }

  if (action.type === "Add_PFE_Jobs") {
    console.log("add pfe jobs reducer ");
    console.log(action);
    const newState = JSON.parse(JSON.stringify(state));

    let StartTime = new Date().toString();
    const jobsList = action.jobs;
    // console.log(jobsList);
    jobsList.map(tag => {
      let tasks = newState.Jobs[action.JobId].Tasks;
      let duplicate = false;
      if (tasks !== null && tasks !== undefined && tasks.length > 0) {
        let matches = tasks.find(ob => {
          return ob !== null && ob.Name === tag;
        });

        if (
          matches !== undefined &&
          matches !== null &&
          Object.keys(matches).length > 0
        ) {
          duplicate = true;
        }
      } else {
        duplicate = false;
      }

      if (!duplicate) {
        let index = newState.Jobs[action.JobId].Tasks.length;
        newState.Jobs[action.JobId].Tasks.push(
          new Task(index, tag, StartTime, "", 4)
        );
        newState.Jobs[action.JobId].newTasks =
          newState.Jobs[action.JobId].newTasks + 1;
      }
    });
    return newState;
  }
  if (action.type === "Add_PFE_Task") {
    const newState = JSON.parse(JSON.stringify(state));
    let index = newState.Jobs[action.JobId].Tasks.length;
    let StartTime = new Date().toString();
    let existingName = action.pfetag || "";
    let step = action.step || 0;
    let tagNo = action.tagNo || "";
    newState.Jobs[action.JobId].Tasks.push(
      new Task(index, tagNo, StartTime, existingName, step)
    );

    return newState;
  }
  if (action.type === "Update_Task") {
    const newState = JSON.parse(JSON.stringify(state));
    let index = newState.Jobs[action.JobId].Tasks.length;
    let StartTime = new Date().toString();
    newState.Jobs[action.JobId].Tasks[action.taskIndex].Name = action.pfetag;
    newState.Jobs[action.JobId].Tasks[action.taskIndex].step = action.step;

    if (action.step === 3) {
      newState.Jobs[action.JobId].Tasks[action.taskIndex].Status = "COMPLETED";
    }
    return newState;
  }

  if (action.type === "Delete_PFE_Tasks") {
    console.log("delete tasks");
    console.log(action);
    const newState = JSON.parse(JSON.stringify(state));
    let { JobId, deleteSelection } = action;
    let tempTasks = newState.Jobs[JobId].Tasks;
    console.log("TEMP TASKS = ");
    console.log(tempTasks);
    deleteSelection.forEach(i => {
      //delete tempTasks[i];
      console.log("deleting index = " + tempTasks[i].Index);
      newState.Jobs[JobId].Tasks = newState.Jobs[JobId].Tasks.filter(
        task => task.Index !== tempTasks[i].Index
      );
      console.log("newStage");
      console.log(newState);
    });

    return newState;
  }

  if (action.type === "Turn_On_New_PFE_Camera") {
    const newState = JSON.parse(JSON.stringify(state));
    newState.ShowCamera = 4;
    console.log("turn on new pfe tag camera");
    return newState;
  }

  if (action.type === "Turn_Off_Camera") {
    const newState = JSON.parse(JSON.stringify(state));
    newState.ShowCamera = 0;
    console.log("Turn Off    Camera");
    return newState;
  }

  return state;
};
