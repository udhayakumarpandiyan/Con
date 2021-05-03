
import {
    SET_GROUPS, SET_CLINET_GROUPS,
    SET_STORE_GROUPS,
    SET_CLINET_GROUP_FEATURES,
    SET_CLINET_GROUP_USERS,
    ADD_GROUP, GROUP_UPDATED,
    GROUP_FETCHED, GROUP_DELETED,
    SET_CLINET_GROUP_DETAILS,
    ADD_CLIENT_GORUP_USER,
    ADD_GROUP_FEATURE_PERMISSION,
    SET_GROUP_FEATURE_PERMISSIONS,
    RESOURCES_FAIL,
    SET_CLIENT_VIS_GROUPS,
    ADD_CLIENT_VIS_GORUPS,
    SET_ALL_CLIENT_VIS_GROUPS,
    GROUPS_MAPPED_TO_CLIENT,
    GET_USERS_MAPPED_TO_CLIENT
} from "../../constants/index";

import { adminApiUrls, clientApiUrls } from "../../util/apiManager";
import axios from "axios";

function handleResponse(response) {
    if (response.statusText === "OK") {
        return response.json();
    }
    let err = new Error(response.statusText);
    err.response = response;
    throw err;
}

function handleQuery(query) {
    let params = { "userId": localStorage.getItem("userId"), ...query };
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString;
}

export function setGroups(groups) {
    return {
        type: SET_GROUPS,
        groups
    }
}

export function setGroupFeaturePermissions(groupFeaturePermissions) {
    return {
        type: SET_GROUP_FEATURE_PERMISSIONS,
        groupFeaturePermissions
    }
}

export function setStoreGroups(groupList) {
    return {
        type: SET_STORE_GROUPS,
        groupList
    }
}

export function setClientGroups(groups) {
    return {
        type: SET_CLINET_GROUPS,
        groups
    }
}

export function setClientGroupFeatures(featureList) {
    return {
        type: SET_CLINET_GROUP_FEATURES,
        featureList
    }
}

export function setClientGroupUsers(userList) {
    return {
        type: SET_CLINET_GROUP_USERS,
        userList
    }
}

export function setClientGroupDetails(clientGroupDetails) {
    return {
        type: SET_CLINET_GROUP_DETAILS,
        clientGroupDetails
    }
}



export function addGroup(group) {
    return {
        type: ADD_GROUP,
        group
    }
}

export function addGroupFeaturePermissions(groupFeaturePermission) {
    return {
        type: ADD_GROUP_FEATURE_PERMISSION,
        groupFeaturePermission
    }
}

export function addClientGroupUser(clientGroupUser) {
    return {
        type: ADD_CLIENT_GORUP_USER,
        clientGroupUser
    }
}

export function groupUpdated(group) {
    return {
        type: GROUP_UPDATED,
        group
    }
}

export function groupFetched(group) {
    return {
        type: GROUP_FETCHED,
        group
    }
}

export function groupDeleted(groupId) {
    return {
        type: GROUP_DELETED,
        _id: groupId
    }
}

export function setClinetVisGroups(clientVisGroups) {
    return {
        type: SET_CLIENT_VIS_GROUPS,
        clientVisGroups
    }
}

export function setAllClinetVisGroups(allClientVisGroups) {
    return {
        type: SET_ALL_CLIENT_VIS_GROUPS,
        allClientVisGroups
    }
}

export function addClientVisGroups(clientVisGroups) {
    return {
        type: ADD_CLIENT_VIS_GORUPS,
        clientVisGroups
    }
}

export function fetchGroups(query, activeStatus) {
    let queryString = handleQuery(query);
    let status = "";
    if (activeStatus) {
        status = `&status=${activeStatus}`;
    }
    return dispatch =>
        axios.get(`${adminApiUrls.getGroupList_v2}?${queryString}${status}`)
            .then(res => {
                dispatch(setGroups((res.data && res.data.data) ? res.data.data : []));
                return res;
            })
            .catch(err => {
                dispatch({ type: RESOURCES_FAIL, error: JSON.stringify(err) });
            });
}

export function addGroups() {
    fetch(`${adminApiUrls.getGroupList}`)
        .then(res => res.json())
        .then(data => setStoreGroups(data.data));
}

export function fetchClientGroups(clientId, query) {
    let queryString = handleQuery(query);
    return dispatch => {
        return fetch(`${adminApiUrls.getClientGroups_v2}/${clientId}/groups?${queryString}`)
            .then(res => res.json())
            .then(data => dispatch(setClientGroups(data)))
    }
}

function groupsMappedToSelectedClient(payload) {
    return {
        type: GROUPS_MAPPED_TO_CLIENT,
        payload
    }
}

// groupsMappedToClient
export function groupsMappedToClient(clientId, query, activeStatus) {
    let queryString = handleQuery(query);
    let status = "";
    if (activeStatus) {
        status = `&status=${activeStatus}`;
    }
    return dispatch => {
        return fetch(`${adminApiUrls.groupsMappedToClient_v2}${clientId}&${queryString}${status}`)
            .then(res => res.json())
            .then(data => dispatch(groupsMappedToSelectedClient(data.data)))
    }
}

export function fetchClientGroupDetails(clientId, query) {
    let queryString = handleQuery(query);
    let url = `${adminApiUrls.getClientGroups_v2}${clientId}/fetchGroups?internalCall=1&${queryString}`
    return dispatch => {
        return fetch(url)
            .then(res => res.json())
            .then(data => dispatch(setClientGroupDetails(data.data)))
    }
}


export function fetchclientGroupFeatures(query) {
    let queryString = handleQuery(query);
    return dispatch => {
        return fetch(`${adminApiUrls.getFeatures_v2}?${queryString}`)
            .then(res => res.json())
            .then(data => dispatch(setClientGroupFeatures(data.data)))
    }
}

export function fetchclientGroupUsers(token) {
    let queryString = handleQuery({ apiToken: token });
    return dispatch => {
        return fetch(`${adminApiUrls.getUsers}?${queryString}`)
            .then(res => res.json())
            .then(data => dispatch(setClientGroupUsers(data.data)))
    }
}


export function saveClientGroupUser(data, query) {
    let queryString = handleQuery(query);
    let newData = {
        addUserIds: data.addUserIds,
        deleteUserIds: data.deleteUserIds,
        groupOwner: "Client",
        groupOwnerId: data.clientId,
        groupId: data.groupId
    }
    return dispatch => {
        return fetch(`${adminApiUrls.getGroupList_v2}/${data.groupId}/createClientGroupUsers?${queryString}`, {
            method: 'post',
            body: JSON.stringify(newData),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(addClientGroupUser(data)));
    }
}

export function saveGroup(data, query) {
    let queryString = handleQuery(query);
    return dispatch => {
        return fetch(`${adminApiUrls.getGroupList_v2}?${queryString}`, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(addGroup(data));
                return data;
            });
    }
}

export function saveGroupFeaturePermissions(groupId, data, query) {
    let queryString = handleQuery(query);
    return dispatch => {
        return fetch(`${adminApiUrls.getGroupList_v2}/${groupId}/permissions?${queryString}`, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(addGroupFeaturePermissions(data.data));
                return data;
            });
    }
}

export function fetchGroupFeaturePermissions(clientId, groupId, query) {
    let queryString = handleQuery(query);
    return dispatch => {
        return fetch(`${adminApiUrls.getClientGroupList_v2}/${clientId}/groups/${groupId}/permissions?${queryString}`)
            .then(res => res.json())
            .then(data => dispatch(setGroupFeaturePermissions(data.data)));
    }
}



export function fetchGroup(id, query) {
    let queryString = handleQuery(query);
    return dispatch =>
        fetch(`${adminApiUrls.getGroups_v2}${id}?${queryString}`)
            .then(res => res.json())
            .then(data => {
                dispatch(groupFetched(data.data));
                return data;
            });
}


export function updateGroup(data, query) {
    let queryString = handleQuery(query);
    const id = data._id;
    delete data._id;
    return dispatch => {
        return fetch(`${adminApiUrls.getGroupList_v2}/${id}?${queryString}`, {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(groupUpdated(data));
                return data;
            });
    }
}

export function deleteGroup(id, query) {
    let queryString = handleQuery(query);
    return dispatch => {
        return axios.delete(`${adminApiUrls.getGroupList_v2}/${id}?${queryString}`, { status: "deleted" }, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(data => {
            dispatch(groupDeleted(id));
            return data;
        }).catch(err => err);
    }
}

export function fetchClinetVisGroups(clientId, query) {
    let queryString = handleQuery(query);
    return dispatch => {
        return fetch(`${adminApiUrls.adminClientGroups_v2}?${queryString}&clientId=${clientId}`)
            .then(res => res.json())
            .then(data => dispatch(setClinetVisGroups(data.data)));
    }
}

export function fetchAllClinetVisGroups(query) {
    let queryString = handleQuery(query);
    return dispatch => {
        return fetch(`${adminApiUrls.adminClientGroups_v2}?${queryString}`)
            .then(res => res.json())
            .then(data => dispatch(setAllClinetVisGroups(data.data)));
    }
}

export function saveClientVisGroups(data, query) {
    let queryString = handleQuery(query);
    return dispatch => {
        return fetch(`${adminApiUrls.getClientVisList_v2}/${data.groupOwnerId}/createClientGroups?${queryString}`, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res && res.json())
            .then((res) => {
                dispatch(addClientVisGroups(data))
                return res;
            });
    }
}

function setSelectedClientUsers(payload) {
    return {
        type: GET_USERS_MAPPED_TO_CLIENT,
        payload
    }
}

/**
 * @param {Object} request req object
 * @param {*} internalCall 
 */
export function getSelectedClientUsers(request, internalCallObj) {
    const userId = localStorage.getItem('userId');
    let internalCall = "";
    if (internalCallObj) {
        internalCall = `&internalCall=${internalCallObj}`;
    }
    let uri = `${clientApiUrls.getClientUsers}${request.clientId}&featureId=${request.featureId}&apiToken=${request.apiToken}&userId=${userId}${internalCall}`;
    return dispatch => {
        return axios(uri)
            .then(data => {
                dispatch(setSelectedClientUsers(data && data.data && data.data.data));
                return data;
            }).catch(err => err);
    }
}

