
import { SET_USER_CLIENTS, SET_USER_SELECTED_CLIENT } from "../../constants/index"

import { clientApiUrls } from "../../util/apiManager";

function handleResponse(response) {
    if (response.statusText === "OK") {
        return response.json();
    } else {
        let err = new Error(response.statusText);
        err.response = response;
        throw err;
    }
}

function handleQuery(self) {
    let params = {};
    if (self) {
        params = { "userId": localStorage.getItem("userId"), "apiToken": self.token }
    }
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString;
}

export function setUserClients(userClients) {
    return {
        type: SET_USER_CLIENTS,
        userClients
    }
}

export function getClientListLinkedToUser(current_user) {
    let queryString = handleQuery(this)
    return dispatch =>
        fetch(clientApiUrls.getClientListLandingPage + current_user.payload.userId + "&" + queryString)
            .then(res => res.json())
            .then(data => {
                dispatch(setUserClients(data.data));
                return data;
            });
}

export function getDefaultClientFromUser(userId, token) {
    let params = { "userId": userId, "apiToken": token }
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return dispatch => {
        return fetch(clientApiUrls.getClientListLandingPage + userId + "&" + queryString)
            .then(res => res.json())
            .then(data => dispatch(setUserClients(data.data)));
    }
}

export function getDefaultClientSAMLFromUser(userId, token) {
    let params = { "userId": userId, "apiToken": token }
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return dispatch => {
        return fetch(clientApiUrls.getClientListLandingPage + userId + "&" + queryString)
            .then(res => res.json())
            .then(data => dispatch(setUserClients(data.data)));
    }
}

export function getCurrentUserClientList(client) {
    return {
        type: SET_USER_SELECTED_CLIENT,
        payload: { "client": client || localStorage.getItem("client") }
    }
}

export function setSelectedClientInState(client) {
    return {
        type: SET_USER_SELECTED_CLIENT,
        payload: { "client": client }
    }
}




