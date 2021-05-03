
import { SET_ROLE, ADD_ROLE, ROLE_UPDATED, ROLE_FETCHED, ROLE_DELETED } from "../../constants/index"
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

export function setRoles(roles) {
    return {
        type: SET_ROLE,
        roles
    }
}

export function addRole(role) {
    return {
        type: ADD_ROLE,
        role
    }
}

export function roleUpdated(role) {
    return {
        type: ROLE_UPDATED,
        role
    }
}

export function roleFetched(role) {
    return {
        type: ROLE_FETCHED,
        role
    }
}

export function roleDeleted(roleId) {
    return {
        type: ROLE_DELETED,
        _id: roleId
    }
}

export function fetchRoles(token) {
    let queryString = handleQuery(this, token)
    return dispatch =>
        axios.get(`${adminApiUrls.getRoles}?${queryString}`)
            .then(res => {
                dispatch(setRoles(res.data && res.data.data ? res.data.data : []));
                return res;
            });
}


export function saveRole(data, token) {
    let queryString = handleQuery(this, token);
    return dispatch => {
        return fetch(`${adminApiUrls.getRoles}?${queryString}`, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(addRole(data));
                return data;
            });
    }
}

export function fetchRole(id) {
    let queryString = handleQuery(this);
    return dispatch => {
      return  fetch(`${adminApiUrls.getRoles}/${id}?${queryString}`)
            .then(res => res.json())
            .then(data => dispatch(roleFetched(data.data)));
    }
}


export function updateRole(data, token) {
    let queryString = handleQuery(this, token);
    return dispatch => {
        return fetch(`${adminApiUrls.getRoles}/${data._id}?${queryString}`, {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(roleUpdated(data));
                return data;
            });
    }
}


export function deleteRole(id, token) {
    let queryString = handleQuery(this, token)
    return dispatch => {
        return axios.put(`${adminApiUrls.getRoles}/${id}?${queryString}`, JSON.stringify({ status: "deleted" }), {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(data => {
            dispatch(roleDeleted(id));
            return data;
        });
    }
}


