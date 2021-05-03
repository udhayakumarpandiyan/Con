import { CHANGE_LIST, CHANGE_DETAILS, DELETE_CHANGE, CHANGE_USER_LIST, ADD_CHANGE_REGISTER, CHANGE_TYPE, EDIT_CHANGE_REGISTER, SUBMIT_CHANGE } from "../../constants/index"

import { changeRegisterUrls, userApiUrls, masterApiUrls } from "./../../util/apiManager";


export function fetchChangeList(userId, apiToken) {
    return dispatch =>
        fetch(`${changeRegisterUrls.findChange}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getChangeList(data)));
}


export function getChangeList(changeList) {
    return {
        type: CHANGE_LIST,
        changeList
    }
}

export function fetchChangeDetails(changeId, userId, apiToken) {
    if (!changeId) {
        return dispatch => dispatch(getChangeDetails([]));
    }
    return dispatch =>
        fetch(changeRegisterUrls.findChangeDetails + changeId + '&userId=' + userId + '&apiToken=' + apiToken)
            .then(res => res.json())
            .then(data => dispatch(getChangeDetails(data)));
}


export function getChangeDetails(changeRegDetails) {
    return {
        type: CHANGE_DETAILS,
        changeRegDetails
    }
}


export function fetchChangeUsers(userId, clientId, featureId, apiToken) {
    var param = {
        "skip": 0,
        "limit": 100,
        "actionBy": userId,
        "clientId": clientId,
        "featureId": featureId,
        "apiToken": apiToken
    };
    let uri = userApiUrls.getUserDashboard;
    return dispatch => {
        fetch(uri, {
            method: 'POST',
            body: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(getChangeUsers(data.data)));

    }
}

export function getChangeUsers(changeUserList) {
    return {
        type: CHANGE_USER_LIST,
        changeUserList
    }
}


export function saveChangeRequest(data) {

    let uri = changeRegisterUrls.saveChange;
    return dispatch => {
        return fetch(uri, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(addChange(data)));
    }
}


export function addChange(addChangeRegister) {
    return {
        type: ADD_CHANGE_REGISTER,
        addChangeRegister

    }

}

export function editChangeRequest(data) {
    let req = {};
    req.changeId = data.changeId;
    req.userId = data.userId;
    req.clientId = data.clientId;
    req.featureId = data.featureId;
    req.apiToken = data.apiToken;
    delete data.userId;
    delete data.clientId;
    delete data.featureId;
    delete data.apiToken;
    req.updateKeys = data;
    let uri = changeRegisterUrls.updateChange
    return dispatch => {
        return fetch(uri, {
            method: 'PUT',
            body: JSON.stringify(req),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(editChange(data)));
    }
}

export function editChange(editChangeRegister) {
    return {
        type: EDIT_CHANGE_REGISTER,
        editChangeRegister

    }

}
export function deleteChangeDetails(changeId, userId, clientId, featureId, apiToken) {
    let req = {};

    req.changeId = changeId;
    req.userId = userId;
    req.clientId = clientId;
    req.featureId = featureId;
    req.apiToken = apiToken;
    let uri = changeRegisterUrls.deleteChange;
    return dispatch => {
        return fetch(uri, {
            method: 'PUT',
            body: JSON.stringify(req),
            headers: {
                "Content-Type": "application/json"
            }

        }).then(res => res.json())
            .then(data => dispatch(deleteChange(data)));
    }

}


export function deleteChange(changeDeleteDetails) {

    return {
        type: DELETE_CHANGE,
        changeDeleteDetails
    }
}

export function getChange(changeRegDetails) {

    return {
        type: CHANGE_DETAILS,
        changeRegDetails
    }
}


export function setMasterData(changeType) {
    return {
        type: CHANGE_TYPE,
        changeType
    }
}

export function masterData(masterCode, userId, apiToken) {
    return dispatch => {
        fetch(`${masterApiUrls.getMasterData}${masterCode}&userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(setMasterData(data.data)));
    }
}

export function submitChangeDetails(data) {
    // let req = {};
    // req.changeId = data;
    // req.updateKeys=data;
    let uri = changeRegisterUrls.submitStatus;
    return dispatch => {
        return fetch(uri, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }

        }).then(res => res.json())
            .then(data => dispatch(submitChange(data)));
    }

}


export function submitChange(changeSubmitDetails) {

    return {
        type: SUBMIT_CHANGE,
        changeSubmitDetails
    }
}
