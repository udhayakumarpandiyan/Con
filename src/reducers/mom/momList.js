
import {MOM_LIST} from "./../../constants/index"

export default function mom(state = [], action = {} )  {

    switch(action.type) {
        case MOM_LIST: 
          return action.mom
          

        default: return state;
    }
}