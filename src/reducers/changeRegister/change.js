import {CHANGE_LIST,CHANGE_DETAILS,DELETE_CHANGE, CHANGE_USER_LIST,ADD_CHANGE_REGISTER,CHANGE_TYPE,EDIT_CHANGE_REGISTER,SUBMIT_CHANGE} from "./../../constants/index"

export function changeList(state = [], action = {} )  {

    switch(action.type) {
        case CHANGE_LIST: 
          return action.changeList
          

        default: return state;
    }
}


export function changeRegDetails(state = [], action = {} )  {

    switch(action.type) {
        case CHANGE_DETAILS: 
        	return action.changeRegDetails
        default: return state;
    }
}

export function changeDeleteDetails(state = [], action = {} )  {

    switch(action.type) {
        case DELETE_CHANGE: 
        	return action.changeDeleteDetails
        default: return state;
    }
}

export function changeUserList(state = [], action = {} )  {

    switch(action.type) {
        case CHANGE_USER_LIST: 
        	return action.changeUserList
        default: return state;
    }
}

export function addChangeRegister(state = [], action = {} )  {

    switch(action.type) {
        case ADD_CHANGE_REGISTER: 
        	return action.addChangeRegister
        default: return state;
    }
}

export function changeType(state = [], action = {} )  {

    switch(action.type) {
        case CHANGE_TYPE: 
        	return action.changeType
        default: return state;
    }
}

export function editChangeRegister(state = [], action = {} )  {

    switch(action.type) {
        case EDIT_CHANGE_REGISTER: 
        	return action.editChangeRegister
        default: return state;
    }
}
export function changeSubmitDetails(state = [], action = {} )  {

    switch(action.type) {
        case SUBMIT_CHANGE: 
        	return action.changeSubmitDetails
        default: return state;
    }
}

