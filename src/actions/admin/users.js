
import { SET_USER, ADD_USER, USER_UPDATED, USER_FETCHED, USER_DELETED } from "../../constants/index";

import { adminApiUrls } from "../../util/apiManager"
import axios from "axios";

function handleQuery(token) {
    let params = { "userId": localStorage.getItem("userId"), "apiToken": token}
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString
}
function handleResponse(response) {
    if (response.statusText === "OK") {
        return response.json();
    } else {
        let err = new Error(response.statusText);
        err.response = response;
        throw err;
    }
}

export function setUsers(users) {
    return {
        type: SET_USER,
        users
    }
}

export function addUser(user) {
    return {
        type: ADD_USER,
        user
    }
}

export function userUpdated(user) {
    return {
        type: USER_UPDATED,
        user
    }
}

export function userFetched(user) {
    return {
        type: USER_FETCHED,
        user

    }
}

export function userDeleted(userId) {
    return {
        type: USER_DELETED,
        _id: userId
    }
}

export function fetchUsers() {
    return dispatch =>
        axios.get(`${adminApiUrls.getUsers}`)
            .then(res => {
                dispatch(setUsers(res.data && res.data.data ? res.data.data : []));
                return res;
            });
}


export function saveUser(data, token) {
    const queryString = handleQuery(token);
    return dispatch => {
        return fetch(`${adminApiUrls.users}?${queryString}`, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleResponse)
            .then(data => {
                dispatch(addUser(data));
                return data;
            });
    }
}

export function fetchUser(id) {
    return dispatch => 
        fetch(`${adminApiUrls.users}/${id}`)
            .then(res => res.json())
            .then(data => {
                dispatch(userFetched(data.data));
                return data;
            });
}


export function updateUser(data, token) {
    const queryString = handleQuery(token);
    return dispatch => {
        return fetch(`${adminApiUrls.users}/${data._id}?${queryString}`, {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleResponse)
            .then(data => {
                dispatch(userUpdated(data));
                return data;
            });
    }
}


export function deleteUser(id) {
    return dispatch => {
        return fetch(`${adminApiUrls.users}/${id}`, {
            method: 'put',
            body: JSON.stringify({ status: "deleted" }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleResponse)
            .then(data => dispatch(userDeleted(id)));
    }
}


