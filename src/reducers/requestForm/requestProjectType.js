import {GET_PROJECT_TYPE_REQUEST} from "./../../constants/index"

export default function groups(state = [], action = {} )  {
    switch(action.type) {
          case GET_PROJECT_TYPE_REQUEST: 
          return action.requestProjectType
        default: return state;
    }
}