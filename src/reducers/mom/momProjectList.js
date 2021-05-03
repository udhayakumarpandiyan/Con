import {PROJECT_LIST} from "./../../constants/index"

export default function rcas(state = [], action = {} )  {

    switch(action.type) {
        case PROJECT_LIST: 
          return action.momProjectList
          

        default: return state;
    }
}