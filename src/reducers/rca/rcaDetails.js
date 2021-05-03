
import { RCA_DETAILS, GET_GROUPS_LIST, GET_USERS } from "./../../constants/index"

export function rcaDetails(state = [], action = {} )  {

    switch(action.type) {
        case RCA_DETAILS: 
        	return action.rcaDetails
        default: return state;
    }
}

export function groupsList(state = [], action = {} )  {

    switch(action.type) {
        case GET_GROUPS_LIST:
            return action.groupsList
        default: return state;
    }
}

export function usersList(state = [], action = {} )  {
    switch(action.type) {
        case GET_USERS:
            return action.usersList
        default: return state;
    }
} 