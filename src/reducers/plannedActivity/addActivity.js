import {ADD_PLAN_ACTIVITY, ACTIVITY_DETAILS} from "../../constants/index";

export  function newActivity(state = [], action = {} )  {
  switch(action.type) {
      case ADD_PLAN_ACTIVITY: 
          return action.newActivity
          
      default: return state;
  }
}

export  function activityDetails(state = [], action = {} )  {
    switch(action.type) {
        case ACTIVITY_DETAILS: 
            return action.activityDetails
            
        default: return state;
    }
}