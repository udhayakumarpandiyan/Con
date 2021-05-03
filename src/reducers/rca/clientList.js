
import {GET_CLIENTS} from "./../../constants/index"

export default function clientsList(state = [], action = {} )  {

    switch(action.type) {
        case GET_CLIENTS:
          return action.clientsList
        default: return state;
    }
}