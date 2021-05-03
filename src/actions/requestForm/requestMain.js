import {
    GET_REQUEST, GET_REQUEST_TYPE, ADD_USER_REQUEST, ADD_CLIENT_REQUEST, GET_HOST_REQUEST_TYPE,
    ADD_HOST_REQUEST, GET_CLIENT_NAME, GET_TASK_TYPE_REQUEST, ADD_PROBE_REQUEST, GET_PROJECT_TYPE_REQUEST,
    ADD_PROJECT_REQUEST, REQUEST_PROJECT_LIST, ADD_PSG_REQUEST, ADD_SERVICE_REQUEST, ADD_IP_REQUEST
} from "../../constants/index";

import { requestFormApiUrls, clientApiUrls, projectApiUrls } from "./../../util/apiManager";

// function handleResponse(response) {
//     if(response.statusText === "OK") {
//         return response.json();
//     } else {
//         let err = new Error(response.statusText);
//         err.response = response;
//         throw err;
//     }
// }

export function getRequest(request) {
    return {
        type: GET_REQUEST,
        request
    }
}

export function addUser(addUserRequest) {
    return {
        type: ADD_USER_REQUEST,
        addUserRequest
    }
}
export function addClient(addClientRequest) {
    return {
        type: ADD_CLIENT_REQUEST,
        addClientRequest
    }
}

export function fetchRequest(userId, apiToken) {
    return dispatch =>
        fetch(`${requestFormApiUrls.getModuleName}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getRequest(data)));
}



export function fetchRequestType(userId, apiToken) {
    return dispatch => {
        fetch(`${requestFormApiUrls.getRequestType}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getRequestType(data.data)));
    }
}
export function getRequestType(requestType) {
    return {
        type: GET_REQUEST_TYPE,
        requestType
    }
}



export function fetchHostRequestType(userId, apiToken) {
    return dispatch => {
        fetch(`${requestFormApiUrls.getMemoryRequestType}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getHostRequestType(data.data)));
    }
}
export function getHostRequestType(hostRequestType) {
    return {
        type: GET_HOST_REQUEST_TYPE,
        hostRequestType
    }
}

export function fetchClientName(userId, clientId, featureId, apiToken) {
    return dispatch =>
        fetch(clientApiUrls.getClientListLinkedToUser + userId + "&userId=" + userId + "&clientId=" + clientId + "&featureId=" + featureId + "&apiToken=" + apiToken)
            .then(res => res.json())
            .then(data => dispatch(getClientName(data)));
}
export function getClientName(requestClientName) {
    return {
        type: GET_CLIENT_NAME,
        requestClientName
    }
}

export function fetchTaskType(userId, apiToken) {
    return dispatch => {
        fetch(`${requestFormApiUrls.getTypeCheck}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getTaskTyep(data.data)));
    }
}
export function getTaskTyep(requestTaskType) {
    return {
        type: GET_TASK_TYPE_REQUEST,
        requestTaskType
    }
}


export function fetchProjectType(userId, apiToken) {
    return dispatch =>
        fetch(`${requestFormApiUrls.viewProjectType}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getProjectType(data.data)));
}

export function getProjectType(requestProjectType) {
    return {
        type: GET_PROJECT_TYPE_REQUEST,
        requestProjectType
    }
}

export function fetchProjects(clientId, userId, featureId, apiToken) {
    let uri = projectApiUrls.getClientProjects + clientId + "&actionBy=" + userId + "&featureId=" + featureId + "&apiToken=" + apiToken;
    return dispatch => {
        fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(getProjects(data.data)));
    }
}

export function getProjects(requestProjectList) {
    return {
        type: REQUEST_PROJECT_LIST,
        requestProjectList
    }
}



export function saveUserRequest(data) {
    return dispatch => {
        return fetch(requestFormApiUrls.saveUserRequest, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(addUser(data)));
    }
}

export function saveClientRequest(data) {
    return dispatch => {
        return fetch(requestFormApiUrls.saveClientRequest, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(addClient(data)));
    }
}


export function addHost(addHostRequest) {

    return {
        type: ADD_HOST_REQUEST,
        addHostRequest
    }
}
export function saveHostRequest(data) {
    return dispatch => {
        return fetch(requestFormApiUrls.saveHostRequest, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(addHost(data)));
    }
}

export function addProbe(addProbeRequest) {
    return {
        type: ADD_PROBE_REQUEST,
        addProbeRequest
    }
}
export function saveNetworkRequest(data) {
    return dispatch => {
        return fetch(requestFormApiUrls.addProbe, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(addProbe(data)));
    }
}

export function addProject(addProjectRequest) {
    return {
        type: ADD_PROJECT_REQUEST,
        addProjectRequest
    }
}

export function saveProjectRequest(data) {
    return dispatch => {
        return fetch(requestFormApiUrls.saveProjectRequest, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(addProject(data)));
    }
}

export function addPsg(addPsgRequest) {

    return {
        type: ADD_PSG_REQUEST,
        addPsgRequest
    }
}

export function savePsgRequest(data) {
    return dispatch => {
        return fetch(requestFormApiUrls.savePsgRequest, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(addPsg(data)));
    }
}

export function addRequestForm(serviceRequest) {
    return {
        type: ADD_SERVICE_REQUEST,
        serviceRequest
    }
}

export function requestService(data) {
    return dispatch => {
        return fetch(requestFormApiUrls.requestService, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(addRequestForm(data)));
    }
}

export function addIPRequest(IPRequest) {
    return {
        type: ADD_IP_REQUEST,
        IPRequest
    }
}

export function infraServiceRequest(data) {
    return dispatch => {
        return fetch(requestFormApiUrls.infraServiceRequest, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(addIPRequest(data)));
    }
}
