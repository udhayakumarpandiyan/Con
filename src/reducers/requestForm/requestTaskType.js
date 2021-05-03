import {GET_TASK_TYPE_REQUEST} from "./../../constants/index"

export default function groups(state = [], action = {} )  {
    switch(action.type) {
          case GET_TASK_TYPE_REQUEST: 
          return action.requestTaskType
        default: return state;
    }
}