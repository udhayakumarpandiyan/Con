import {MOM_STATUS} from "./../../constants/index"

export default function rcas(state = [], action = {} )  {

    switch(action.type) {
        case MOM_STATUS: 
          return action.momStatus
          
        default: return state;
    }
}