import { GET_REQUEST, ADD_USER_REQUEST, ADD_PROBE_REQUEST, ADD_PROJECT_REQUEST, ADD_PSG_REQUEST, ADD_CLIENT_REQUEST, ADD_HOST_REQUEST, ADD_SERVICE_REQUEST, ADD_IP_REQUEST } from "./../../constants/index"

export function request(state = [], action = {}) {
    switch (action.type) {
        case GET_REQUEST:
            return action.request
        default: return state;
    }
}

export function addUserRequest(state = [], action = {}) {
    switch (action.type) {
        case ADD_USER_REQUEST:
            return action.addUserRequest
        default: return state;
    }
}



export function addProbeRequest(state = [], action = {}) {
    switch (action.type) {
        case ADD_PROBE_REQUEST:
            return action.addProbeRequest
        default: return state;
    }
}

export function addProjectRequest(state = [], action = {}) {
    switch (action.type) {
        case ADD_PROJECT_REQUEST:
            return action.addProjectRequest
        default: return state;
    }
}

export function addPsgRequest(state = [], action = {}) {
    switch (action.type) {
        case ADD_PSG_REQUEST:
            return action.addPsgRequest
        default: return state;
    }
}

export function addClientRequest(state = [], action = {}) {
    switch (action.type) {
        case ADD_CLIENT_REQUEST:
            return action.addClientRequest
        default: return state;
    }
}

export function addHostRequest(state = [], action = {}) {
    switch (action.type) {
        case ADD_HOST_REQUEST:
            return action.addHostRequest
        default: return state;
    }
}

export function addServiceRequest(state = [], action = {}) {
    switch (action.type) {
        case ADD_SERVICE_REQUEST:
            return action.serviceRequest;
        default: return state;
    }
}
export function addIPRequest(state = [], action = {}) {
    switch (action.type) {
        case ADD_IP_REQUEST:
            return action.IPRequest;
        default: return state;
    }
}