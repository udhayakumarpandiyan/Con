import {MOM_DETAILS, UPDATE_MOM, MOM_TOPIC_STATUS, ON_MOM_SUBMIT} from "./../../constants/index"

export function momDetails(state = [], action = {} )  {

    switch(action.type) {
        case MOM_DETAILS: 
        	return action.momDetails
        default: return state;
    }
}

export function momUpdatedData(state = [], action = {} )  {
    switch(action.type) {
        case UPDATE_MOM: 
        	return action.momUpdatedData
        default: return state;
    }
}

export function momTopicStatus(state = [], action = {} )  {
    switch(action.type) {
        case MOM_TOPIC_STATUS: 
        	return action.momTopicStatus
        default: return state;
    }
}

export function submittedData(state = [], action = {} )  {
    switch(action.type) {
        case ON_MOM_SUBMIT: 
        	return action.submittedData
        default: return state;
    }
}


