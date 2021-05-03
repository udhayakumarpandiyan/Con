import { RCA_LIST, RCA_DETAILS, GET_CLIENTS, GET_USERS, GET_GROUPS_LIST } from "../../constants/index";
import { rcaApiUrls, clientApiUrls, adminApiUrls } from "../../util/apiManager";

function handleResponse(response) {
    if (response.statusText === "OK") {
        return response.json();
    } else {
        let err = new Error(response.statusText);
        err.response = response;
        throw err;
    }
}

export function rcaList(rcas) {
    return {
        type: RCA_LIST,
        rcas
    }
}

export function fetchRca(request) {
    return dispatch =>
        fetch(rcaApiUrls.getRcaList, {
            method: 'post',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(rcaList(data)));
}

export function getRcaDetails(rcaDetails) {
    return {
        type: RCA_DETAILS,
        rcaDetails
    }
}

export function fetchRcaDetails(ticketId, userId, apiToken, clientId, featureId) {
    if (!ticketId) {
        return dispatch => Promise.resolve(dispatch(getRcaDetails({})));
    }
    let uri = rcaApiUrls.getRcaDetails + parseInt(ticketId, 10) + "&userId=" + userId + "&apiToken=" + apiToken + "&clientId=" + clientId + "&featureId=" + featureId;
    return dispatch =>
        fetch(uri)
            .then(res => res.json())
            .then(data => {
                dispatch(getRcaDetails(data.data));
                return data;
            });
}

export function editRca(rcaEdit) {
    return {
        type: "@@redux-form/SET_SUBMIT_SUCCEEDED",
        rcaEdit
    }
}

export function getClients(clientsList) {
    return {
        type: GET_CLIENTS,
        clientsList
    }
}

export function getClientDetails(userId, clientId, featureId, apiToken) {
    const uri = `${clientApiUrls.getClientList}?userId=${userId}&clientId=${clientId}&featureId=${featureId}&apiToken=${apiToken}`;
    return dispatch =>
        fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(getClients(data.data)));
}

export function getUsersList(usersList) {
    return {
        type: GET_USERS,
        usersList
    }
}

export function getUsers(request) {
    let uri = adminApiUrls.getGroups + request.groupId + '/client/' + request.clientId + '/users_detail?userId=' + request.userId + '&apiToken=' + request.apiToken;
    return dispatch => {
        fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(getUsersList((data.data && data.data.userDetails && data.data.userDetails.data
                && data.data.userDetails.data.length > 0) ? data.data.userDetails.data : [])));
    }
}

export function getGroupsList(groupsList) {
    return {
        type: GET_GROUPS_LIST,
        groupsList
    }
}

export function getGroups(clientId, userId, apiToken, featureId, internalCall) {
    let internalCallAccess = "";
    if (internalCall) {
        internalCallAccess = `&internalCall=${internalCall}`;
    }
    let uri = `${adminApiUrls.groupsMappedToClient_v2}${clientId}&userId=${userId}&apiToken=${apiToken}&featureId=${featureId}${internalCallAccess}`;
    return dispatch => fetch(uri)
        .then(res => res.json())
        .then(data => dispatch(getGroupsList(data.data)));
}

export function fetchRCASearch(payload) {
    if (!payload) {
        return dispatch => Promise.resolve(dispatch(rcaList({})));
    }
    return dispatch =>
        fetch(rcaApiUrls.searchRca, {
            method: 'post',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                dispatch(rcaList(data));
                return data;
            });
}