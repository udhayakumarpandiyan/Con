import {DELETE_MOM} from "./../../constants/index"

export default function momDeletedData(state = [], action = {} )  {

    switch(action.type) {
        case DELETE_MOM: 
        	return action.momDeletedData
        default: return state;
    }
}
