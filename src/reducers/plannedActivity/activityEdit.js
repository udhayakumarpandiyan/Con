import { SET_PLAN_ACTIVITY_DETAILS} from "./../../constants/index"
   
export function saveActivityInfo(state =[], action = {}){
    switch(action.type) {
        case SET_PLAN_ACTIVITY_DETAILS: 
            return action.saveActivityInfo
            
        default: return state;
    }
 }