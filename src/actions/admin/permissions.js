
import { SET_PERMISSION, ADD_PERMISSION, PERMISSION_UPDATED, PERMISSION_FETCHED, PERMISSION_DELETED } from "../../constants/index"
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

function handleQuery(query) {
    let params = { "userId": localStorage.getItem("userId"), ...query };
    return Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

export function setPermissions(permissions) {
    return {
        type: SET_PERMISSION,
        permissions
    }
}

export function addPermission(permission) {
    return {
        type: ADD_PERMISSION,
        permission
    }
}

export function permissionUpdated(permission) {
    return {
        type: PERMISSION_UPDATED,
        permission
    }
}

export function permissionFetched(permission) {
    return {
        type: PERMISSION_FETCHED,
        permission
    }
}

export function permissionDeleted(permissionId) {
    return {
        type: PERMISSION_DELETED,
        _id: permissionId
    }
}

export function fetchPermissions(query) {
    let queryString = handleQuery(query);
    return dispatch =>
        axios.get(`${adminApiUrls.getPermissions_v2}?${queryString}`)
            .then(res => {
                dispatch(setPermissions(res.data && res.data.data ? res.data.data : []));
                return res;
            });
}


export function savePermission(data, query) {
    let queryString = handleQuery(query);
    return dispatch => {
        return fetch(`${adminApiUrls.getPermissions_v2}?${queryString}`, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(addPermission(data));
                return data;
            });
    }
}

export function fetchPermission(id, query) {
    let queryString = handleQuery(query)
    return dispatch =>
        fetch(`${adminApiUrls.getPermissions_v2}/${id}?${queryString}`)
            .then(res => res.json())
            .then(data => {
                dispatch(permissionFetched(data.data));
                return data;
            });
}


export function updatePermission(data, query) {
    let queryString = handleQuery(query);
    const id = data._id;
    delete data._id;
    return dispatch => {
        return fetch(`${adminApiUrls.getPermissions_v2}/${id}?${queryString}`, {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(permissionUpdated(data));
                return data;
            });
    }
}


export function deletePermission(id, query) {
    let queryString = handleQuery(query)
    return dispatch => {
        return axios.delete(`${adminApiUrls.getPermissions_v2}/${id}?${queryString}`, { status: "deleted" }, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            dispatch(permissionDeleted(id));
            return res;
        });
    }
}


