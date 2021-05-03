import {CREATE_MOM} from "./../../constants/index"

export default function momClientList(state = [], action = {} )  {

    switch(action.type) {
        case CREATE_MOM: 
        	return action.momData
        default: return state;
    }
}
