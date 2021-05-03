import { USER_DIR_LIST, USER_DIR_DETAILS, USER_DIR_STATUS, USER_DIR_ROLE, USER_DIR_GROUP, USER_DIR_ADD, USER_DIR_CLIENT, USER_DIR_EDIT } from "../../constants/index";
import { userApiUrls, clientApiUrls, masterApiUrls, adminApiUrls } from "../../util/apiManager";

// User Directory get user list API call

export function getUserList(userDirList) {
    return {
        type: USER_DIR_LIST,
        userDirList: (userDirList && userDirList.data) || []
    }
}

export function fetchUsersList(clientId, featureId, userId, apiToken) {
    var param = {
        "skip": 0,
        "limit": 500,
        "actionBy": userId,
        "clientId": clientId,
        "featureId": featureId,
        "apiToken": apiToken
    };
    return dispatch =>
        fetch(userApiUrls.getUserDashboard, {
            method: 'POST',
            body: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(getUserList(data)));

}

export function fetchUsersDashboard(param) {
    return dispatch =>
        fetch(userApiUrls.getUserDashboardNew, {
            method: 'POST',
            body: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(getUserList(data));
                return data;
            });

}

export function filterUsers(param) {
    return dispatch => {
        return fetch(`${userApiUrls.getUserDashboard}`, {
            method: 'post',
            body: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(getUserList(data)));
    }
}

// User Directory get user details API call

export function getUserDetails(userDirDetails) {
    sessionStorage.setItem("userId", userDirDetails.userId);
    return {
        type: USER_DIR_DETAILS,
        userDirDetails
    }
}

export function fetchUserDetails(userId, clientId, featureId, actionBy, apiToken) {
    if (!userId) {
        return dispatch => dispatch(getUserDetails({}));
    }
    let uri = userApiUrls.getUserDetails + userId + '&' + 'clientId=' + clientId + '&' + 'featureId=' + featureId + '&' + 'actionBy=' + actionBy + '&' + 'apiToken=' + apiToken;
    return dispatch =>
        fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(getUserDetails(((data.data && data.data.length > 0) ? data.data[0] : {}))));
}

// User Directory get status API call

export function setMasterData(userDirStatus) {
    return {
        type: USER_DIR_STATUS,
        userDirStatus: userDirStatus ? userDirStatus.data : []
    }
}

export function masterData(masterCode, userId, apiToken) {
    let uri = `${masterApiUrls.getMasterData}${masterCode}&userId=${userId}&apiToken=${apiToken}`;
    return dispatch =>
        fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(setMasterData(data, masterCode)));
}

// User Directory get role API call

export function setUserRole(userDirRole) {

    return {
        type: USER_DIR_ROLE,
        userDirRole: userDirRole ? userDirRole.data : []
    }
}

export function userRoleData() {
    //vijay has to implement
    return dispatch => {
        fetch(adminApiUrls.getRoles)
            .then(res => res.json())
            .then(data => dispatch(setUserRole(data)));
    }
}

// User Directory get group API call

export function setUserGroup(userDirGroup) {
    return {
        type: USER_DIR_GROUP,
        userDirGroup: userDirGroup ? userDirGroup.data : []
    }
}

export function userGroupData(clientId, userId, featureId, apiToken, internalCall) {
    let internalcallAccess = "";
    if (internalCall) {
        internalcallAccess = `&internalCall=${internalCall}`
    }
    let uri = `${adminApiUrls.groupsMappedToClient_v2}${clientId}&userId=${userId}&apiToken=${apiToken}&featureId=${featureId}${internalcallAccess}`;
    return dispatch => {
        return fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(setUserGroup(data)));
    }
}

// User Directory get client API call

export function setUserClients(userDirClient) {
    return {
        type: USER_DIR_CLIENT,
        userDirClient
    }
}

export function setUserClient() {
    //sushil has to implement
    return dispatch => {
        fetch(clientApiUrls.getClientList)
            .then(res => res.json())
            .then(data => dispatch(setUserClients(data.data)));
    }
}

// User Directory add user form API call

export function postUserData(userDirAdd) {
    return {
        type: USER_DIR_ADD,
        userDirAdd
    }
}

export function submitUserData(data) {
    return dispatch => {
        return fetch(userApiUrls.createUser, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(postUserData(data)));
    }
}

// User Directory edit user form API call
export function postEditUserData(userDirEdit) {
    return {
        type: USER_DIR_EDIT,
        userDirEdit
    }
}

export function submitUserEditData(data) {
    return dispatch => {
        return fetch(userApiUrls.updateUser, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(postEditUserData(data)));
    }
}
