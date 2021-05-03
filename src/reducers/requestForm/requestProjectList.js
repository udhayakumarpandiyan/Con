import {REQUEST_PROJECT_LIST} from "./../../constants/index"

export default function groups(state = [], action = {} )  {
    switch(action.type) {
          case REQUEST_PROJECT_LIST: 
          return action.requestProjectList
        default: return state;
    }
}