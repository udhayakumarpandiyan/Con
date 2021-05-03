import {
    MOM_LIST, MOM_DETAILS, MOM_STATUS, CLIENT_LIST, ON_MOM_SUBMIT,
    PROJECT_LIST, CREATE_MOM, UPDATE_MOM, DELETE_MOM, MOM_TOPIC_STATUS
} from "../../constants/index";
import { momApiUrls, clientApiUrls, projectApiUrls } from "./../../util/apiManager";

export function getMom(mom) {
    return {
        type: MOM_LIST,
        mom
    }
}

export function fetchMom(userId, apiToken) {
    return dispatch => {
        return fetch(`${momApiUrls.fetchMomData}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => {
                dispatch(getMom(data.data));
                return data;
            });
    }
}

export function getStatus(momStatus) {
    return {
        type: MOM_STATUS,
        momStatus
    }
}

export function fetchStatus(userId, apiToken) {
    return dispatch => {
        fetch(`${momApiUrls.fetchStatus}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getStatus(data.data)));
    }
}

export function getDetails(momDetails) {
    return {
        type: MOM_DETAILS,
        momDetails
    }
}

export function fetchMomDetails(momId, userId, apiToken) {
    let uri = `${momApiUrls.getMomDetails}${momId}&userId=${userId}&apiToken=${apiToken}`;
    return dispatch => {
        return fetch(uri)
            .then(res => res.json())
            .then(data => {
                dispatch(getDetails(data.data));
                return data;
            });
    }
}


export function getClientsOnUser(momClientList) {
    return {
        type: CLIENT_LIST,
        momClientList
    }
}

export function fetchClients(userId, clientId, featureId, apiToken) {
    let uri = clientApiUrls.getClientListLinkedToUser + userId + "&userId=" + userId + "&clientId=" + clientId + "&featureId=" + featureId + "&apiToken=" + apiToken;
    return dispatch =>
        fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(getClientsOnUser(data.data)));
}

export function getProjects(momProjectList) {
    return {
        type: PROJECT_LIST,
        momProjectList
    }
}

export function fetchProjects(clientId, userId, featureId, apiToken) {
    if (!clientId) {
        return dispatch => dispatch(getProjects({}));
    }
    let uri = projectApiUrls.getClientProjects + clientId + "&actionBy=" + userId + "&featureId=" + featureId + "&apiToken=" + apiToken + "&isConnectedDevices=false";
    return dispatch => {
        return fetch(uri)
            .then(res => res.json())
            .then(data => {
                dispatch(getProjects(data.data));
                return data;
            });
    }
}

export function fileteredList(filter) {
    return dispatch => {
        return fetch(momApiUrls.getCliStat, {
            method: 'POST',
            body: JSON.stringify(filter),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(getMom(data.data));
                return data;
            });
    }
}

export function createMom(momData) {
    return {
        type: CREATE_MOM,
        momData
    }
}

export function addMom(data) {
    return dispatch => {
        fetch(momApiUrls.createMom, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(createMom(data.data)));
    }
}

export function updMom(momUpdatedData) {
    return {
        type: UPDATE_MOM,
        momUpdatedData
    }
}

export function updateMom(data) {
    return dispatch => {
        return fetch(momApiUrls.updateMom, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(updMom((Object.keys(data.data) && Object.keys(data.data).length > 0) ? data : {}))
            );
    }
}

export function delMom(momDeletedData) {
    return {
        type: DELETE_MOM,
        momDeletedData
    }
}

export function deleteMom(data) {
    // let request = {};
    // request.id = data
    return dispatch => {
        return fetch(momApiUrls.deleteMom, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(delMom(data)));
    }
}

export function getTopicStatus(momTopicStatus) {
    return {
        type: MOM_TOPIC_STATUS,
        momTopicStatus
    }
}

export function fetchTopicStatus(userId, apiToken) {
    return dispatch => {
        fetch(`${momApiUrls.fetchTopicStatus}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getTopicStatus(data.data)));
    }
}

export function onSubmit(submittedData) {
    return {
        type: ON_MOM_SUBMIT,
        submittedData
    }
}

export function momSubmit(data) {
    return dispatch => {
        return fetch(momApiUrls.onMomSubmit, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(onSubmit(data)));
    }
}
