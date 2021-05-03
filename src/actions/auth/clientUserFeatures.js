
import { SET_CLIENT_USER_FEATURES, HAS_ADMIN_ACCESS }  from "../../constants/index";

import {  adminApiUrls }  from "../../util/apiManager";

function handleResponse(response) {
    if(response.statusText === "OK") {
        return response.json();
    } else {
        let err = new Error(response.statusText);
        err.response = response;
        throw err;
    }
}

function handleQuery(self){
    let params = { "userId": localStorage.getItem("userId"), "apiToken": self.token }
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString
}


export function setClientUserFeatures(clientUserFeatures){
    return {
        type: SET_CLIENT_USER_FEATURES,
        clientUserFeatures
    }
}


export function getClientUserFeatures(clientId, generateToken, status, userId = localStorage.getItem("userId"), internalCall) {
   let internalCallStr = "";
   if(internalCall){
    internalCallStr = `&internalCall=${internalCall}`;
   }
    if (clientId && clientId !== "all") {
        let uri = `${adminApiUrls.getClientGroups_v2}${clientId}/users/${userId}/features?apiToken=${generateToken}&status=${status}${internalCallStr}`;
        return dispatch => fetch(uri)
            .then(res => res && res.json())
            .then(data => {
                dispatch(setClientUserFeatures(data.data));
                return data;
            });
    } else {
        return dispatch => dispatch(setClientUserFeatures({}))
    }
}

export function hasAdminAccess(boolean) {
    return {
        type: HAS_ADMIN_ACCESS,
        hasAdminAccess: boolean
    }
}

export function getClientAdminFeature({ clientId, featureId, userId = localStorage.getItem("userId"), apiToken }) {
    let uri = `${adminApiUrls.getClientGroups_v2}${clientId}/users/${userId}/features/${featureId}/permissions?apiToken=${apiToken}`;
    return clientId === "all" || !featureId ?
        dispatch => dispatch(hasAdminAccess(false)) :
        dispatch => {
            fetch(uri)
                .then(res => res.json())
                .then(data => {
                    return dispatch(hasAdminAccess(Array.isArray(data.data) && !!data.data.length));
                })
                .catch(err => dispatch(hasAdminAccess(false)));
        }
}


