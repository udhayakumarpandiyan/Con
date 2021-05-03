
import {MONITORING_LIST} from "./../../constants/index"

export default function monitoringReducer(state = [], action = {} )  {
    switch(action.type) {
        case MONITORING_LIST: 
          return action.monitoring
        default: return state;
    }
}