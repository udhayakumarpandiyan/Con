import {CLIENT_LIST} from "./../../constants/index"

export default function momClientList(state = [], action = {} )  {

    switch(action.type) {
        case CLIENT_LIST: 
        	return action.momClientList
        default: return state;
    }
}
