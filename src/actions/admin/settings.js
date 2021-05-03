import {
    TICKET_SETTINGS, GET_LOGS, EMAIL_TEMPLATES, SYSTEM_LOG_LEVEL, MAX_LOGINS, TIME_ZONES,
    EDIT_TICKET_SETTINGS, GET_BAN_LIST, GET_TEMPLATES, GET_EMAIL_LIST, GET_EMAIL_DETAILS, DELETE_EMAIL,
    UPDATE_EMAIL, ADD_NEW_EMAIL, DELETE_EMAIL_BANLIST, DELETE_TEMPLATE, GET_PROTOCOL
} from "../../constants/index";

import { adminSettingsApiUrls } from "./../../util/apiManager";

function handleResponse(response) {
    if (response.statusText === "OK") {
        return response.json();
    } else {
        let err = new Error(response.statusText);
        err.response = response;
        throw err;
    }
}

export function getTicketSettings(ticketSettings) {
    return {
        type: TICKET_SETTINGS,
        ticketSettings
    }
}

export function fetchTicketSettings(userId, apiToken) {
    let uri = `${adminSettingsApiUrls.getTicketSettings}?userId=${userId}&apiToken=${apiToken}`;
    return dispatch => {
        fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(getTicketSettings(data.data)));
    }
}

export function getLogs(getLogs) {

    return {
        type: GET_LOGS,
        getLogs
    }
}

export function fetchLogs(userId, apiToken) {
    let uri = `${adminSettingsApiUrls.getLogs}?userId=${userId}&apiToken=${apiToken}`;
    return dispatch => {
        fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(getLogs(data.data)));
    }
}

export function getSystemLogs(systemLogs) {
    return {
        type: SYSTEM_LOG_LEVEL,
        systemLogs
    }
}

export function fetchSystemLogs(userId, apiToken) {
    let uri = `${adminSettingsApiUrls.getSystemLogLevel}?userId=${userId}&apiToken=${apiToken}`;
    return dispatch => {
        fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(getSystemLogs(data.data)));
    }
}


export function getEmailTemplates(emailTemplates) {
    return {
        type: EMAIL_TEMPLATES,
        emailTemplates
    }
}

export function fetchEmailTemplates(userId, apiToken) {
    let uri = `${adminSettingsApiUrls.getEmailTemplates}?userId=${userId}&apiToken=${apiToken}`;
    return dispatch => {
        fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(getEmailTemplates(data.data)));
    }
}

export function getMaxLogins(maxLogins) {
    return {
        type: MAX_LOGINS,
        maxLogins
    }
}

export function fetchMaxLogins(userId, apiToken) {
    return dispatch => {
        fetch(`${adminSettingsApiUrls.getMaxLogins}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getMaxLogins(data.data)));
    }
}

export function getTimeZones(timeZones) {
    return {
        type: TIME_ZONES,
        timeZones
    }
}

export function fetchTimeZones(userId, apiToken) {
    return dispatch => {
        fetch(`${adminSettingsApiUrls.getTimeZones}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getTimeZones(data.data)));
    }
}


export function saveTicketSettings(editTicketSettings) {
    return {
        type: EDIT_TICKET_SETTINGS,
        editTicketSettings
    }
}

export function updateTicketSettings(request) {
    return dispatch => {
        return fetch(adminSettingsApiUrls.updateTicketSettings, {
            method: 'put',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(saveTicketSettings(data.data));
                return data;
            });
    }
}

export function getBanLists(banList) {
    return {
        type: GET_BAN_LIST,
        banList
    }
}

export function fetchBanList(userId, apiToken) {
    return dispatch => {
        fetch(`${adminSettingsApiUrls.getBanList}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getBanLists(data.data)));
    }
}

export function getTemplates(templateList) {
    return {
        type: GET_TEMPLATES,
        templateList
    }
}

export function fetchTemplates(userId, apiToken) {
    return dispatch => {
        fetch(`${adminSettingsApiUrls.getTemplateList}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getTemplates(data.data)));
    }
}

export function getEmailLists(emailList) {
    return {
        type: GET_EMAIL_LIST,
        emailList
    }
}

export function fetchEmailList(userId, apiToken) {
    return dispatch => {
        fetch(`${adminSettingsApiUrls.getEmailList}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getEmailLists(data.data)));
    }
}

export function getEmailDetails(emailDetails) {
    emailDetails = (emailDetails.length > 0) ? emailDetails[0] : {};
    return {
        type: GET_EMAIL_DETAILS,
        emailDetails
    }
}

export function fetchEmailDetails(id, userId, apiToken) {
    let uri = `${adminSettingsApiUrls.viewEmail}${id}&userId=${userId}&apiToken=${apiToken}`;
    return dispatch => {
        return fetch(uri)
            .then(res => res.json())
            .then(data => {
                dispatch(getEmailDetails(data.data));
                return data;
            });
    }
}

export function emailDeleted(deletedEmail) {
    return {
        type: DELETE_EMAIL,
        deletedEmail
    }
}

export function emailDelete(request) {
    return dispatch => {
        return fetch(adminSettingsApiUrls.deleteEmail, {
            method: 'put',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(emailDeleted(data.data));
                return data;
            });
    }
}

export function emailUpdated(updatedEmail) {
    return {
        type: UPDATE_EMAIL,
        updatedEmail
    }
}

export function emailUpdate(request) {
    return dispatch => {
        return fetch(adminSettingsApiUrls.updateEmail, {
            method: 'put',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(emailUpdated(data.data)));
    }
}

export function addEmail(newEmail) {
    return {
        type: ADD_NEW_EMAIL,
        newEmail
    }
}

export function addNewEmail(request) {
    return dispatch => {
        return fetch(adminSettingsApiUrls.createEmail, {
            method: 'post',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(addEmail(data.data));
                return data;
            });
    }
}

export function templateDeleted(deletedTemplate) {
    return {
        type: DELETE_TEMPLATE,
        deletedTemplate
    }
}

export function templateDelete(request) {
    return dispatch => {
        return fetch(adminSettingsApiUrls.deleteTempl, {
            method: 'put',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(templateDeleted(data)));
    }
}

export function banEmailDeleted(deletedBanEmail) {
    return {
        type: DELETE_EMAIL_BANLIST,
        deletedBanEmail
    }
}

export function deleteEmailbanList(request) {
    return dispatch => {
        return fetch(adminSettingsApiUrls.deleteBan, {
            method: 'put',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(banEmailDeleted(data)));
    }
}

export function getProtoList(protoList) {
    return {
        type: GET_PROTOCOL,
        protoList
    }
}

export function protocolList(userId, apiToken) {
    return dispatch => {
        fetch(`${adminSettingsApiUrls.protocol}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getProtoList(data.data)));
    }
}