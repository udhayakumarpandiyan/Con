
import {
    SET_CLIENT,
    ADD_CLIENT,
    CLIENT_UPDATED,
    CLIENT_FETCHED,
    CLIENT_DELETED
} from "../../constants/index"

import { adminApiUrls } from "../../util/apiManager"
import axios from "axios";

function handleResponse(response) {
    if (response.statusText === "OK") {
        return response.json();
    } else {
        let err = new Error(response.statusText);
        err.response = response;
        throw err;
    }
}

function handleQuery(self, token) {
    let params = {};
    if (self || token) {
        params = { "userId": localStorage.getItem("userId"), "apiToken": token || self.token }
    }
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString
}

export function setClients(clients) {
    return {
        type: SET_CLIENT,
        clients
    }
}

export function addClient(client) {
    return {
        type: ADD_CLIENT,
        client
    }
}

export function clientUpdated(client) {
    return {
        type: CLIENT_UPDATED,
        client
    }
}

export function clientFetched(client) {
    return {
        type: CLIENT_FETCHED,
        client
    }
}

export function clientDeleted(clientId) {
    return {
        type: CLIENT_DELETED,
        _id: clientId
    }
}

export function fetchClients(token) {
    let queryString = handleQuery(this, token);
    return dispatch =>
        axios.get(`${adminApiUrls.getClients}?${queryString}`)
            .then(res => {
                dispatch(setClients(res.data && res.data.data ? res.data.data : []));
                return res;
            });
}


export function saveClient(data, token) {
    let queryString = handleQuery(this, token);
    return dispatch => {
        return fetch(`${adminApiUrls.clients}?${queryString}`, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleResponse)
            .then(data => {
                dispatch(addClient(data));
                return data;
            });
    }
}

export function fetchClient(id) {
    return dispatch => {
        fetch(`${adminApiUrls.clients}/${id}`)
            .then(res => res.json())
            .then(data => dispatch(clientFetched(data.data)));
    }
}


export function updateClient(data, token) {
    let queryString = handleQuery(this, token);
    return dispatch => {
        return fetch(`${adminApiUrls.clients}/${data._id}?${queryString}`, {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleResponse)
            .then(data => {
                dispatch(clientUpdated(data));
                return data;
            });
    }
}


export function deleteClient(id, token) {
    let queryString = handleQuery(this, token);
    return dispatch => {
        return axios.put(`${adminApiUrls.clients}/${id}?${queryString}`, JSON.stringify({ status: "deleted" }), {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(data => {
            dispatch(clientDeleted(id));
            return data;
        });
    }
}






