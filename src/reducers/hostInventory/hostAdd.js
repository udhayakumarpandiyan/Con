import {HOST_ADD,AZURE_HOST_ADD,HOST_EDIT, AWS_MAPPING_INFO, DELETE_AWS_HOST, UPDATE_AWS_HOST} from "./../../constants/index"

export  function addHost(state = [], action = {} )  {
    switch(action.type) {
        case HOST_ADD: 
        	return action.addHost
        default: return state;
    }
}


export  function addAzureHost(state = [], action = {} )  {
    switch(action.type) {
        case AZURE_HOST_ADD: 
        	return action.addAzureHost
        default: return state;
    }
}

export  function editHost(state = [], action = {} )  {

    switch(action.type) {
        case HOST_EDIT: 
        	return action.editHost
        default: return state;
    }
}

export  function roleInfo(state = [], action = {} )  {

    switch(action.type) {
        case AWS_MAPPING_INFO: 
        	return action.roleInfo
        default: return state;
    }
}

export  function deleteAWSHost(state = {}, action = {} )  {
    switch(action.type) {
        case DELETE_AWS_HOST: 
        	return action.data
        default: return state;
    }
}

export  function updateAWSHost(state = {}, action = {} )  {
    switch(action.type) {
        case UPDATE_AWS_HOST: 
        	return action.data
        default: return state;
    }
}


