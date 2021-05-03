import {GET_HOST_REQUEST_TYPE} from "./../../constants/index"

export default function groups(state = [], action = {} )  {
    switch(action.type) {
          case GET_HOST_REQUEST_TYPE: 
          return action.hostRequestType
        default: return state;
    }
}