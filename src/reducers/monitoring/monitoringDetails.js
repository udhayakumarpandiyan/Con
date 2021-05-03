
import {MONITORING_DETAILS, MASTER_CLIENT} from "./../../constants/index"

export function monitoringDetails(state = [], action = {} )  {
    switch(action.type) {
        case MONITORING_DETAILS: 
          return action.monitoringDetails
          

        default: return state;
    }
}

export function masterClient(state = [], action = {} )  {
    switch(action.type) {
        case MASTER_CLIENT: 
          return action.masterClient
    
        default: return state;
    }
}