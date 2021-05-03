import { MASTER_DATA, GROUP_HELP_TOPICS, GET_TOKEN, CLIENT_USERS, SET_TOKEN_EXPIRED_TIME, SET_CLIENT_LOGO } from "../../constants/index";
import { masterApiUrls, adminApiUrls, authServerApiUrls, clientApiUrls } from "../../util/apiManager";
import crypto from "crypto";
import moment from 'moment';

function handleQuery(query) {
    let params = { "userId": localStorage.getItem("userId"), ...query };
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString
}

export function getMasterDataForCodes(masterData) {
    return {
        type: MASTER_DATA,
        masterData
    }
}

function generateDuplicateToken(generateToken) {
    return {
        type: GET_TOKEN,
        generateToken
    }
}

export function getAllMasterData(masterCodes, userId, apiToken) {
    return dispatch => {
        return fetch(`${masterApiUrls.getMasterData}${masterCodes}&userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getMasterDataForCodes(data.data)));
    }
}

export function getHelpTopics(groupHelpTopics) {
    return {
        type: GROUP_HELP_TOPICS,
        groupHelpTopics
    }
}

export function groupHelpTopics(groupId, query, internalCall) {
    let internalCallAccess = "";
    if (internalCall) {
        internalCallAccess = `&internalCall=${internalCall}`;
    }
    if (!groupId) {
        return dispatch => dispatch(getHelpTopics([]));
    }
    let queryString = handleQuery(query);
    let uri = `${adminApiUrls.getGroups_v2}${groupId}/helpTopics?${queryString}${internalCallAccess}`;
    return dispatch => {
        return fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(getHelpTopics(data.data)));
    }
}

function generateSaltToken(data, password) {
    let generateToken = crypto.createHmac('sha256', (password + data.salt)).digest('hex');
    return {
        type: GET_TOKEN,
        generateToken
    }
}

function setTokenExpiredTime() {
    return {
        type: SET_TOKEN_EXPIRED_TIME,
        endTime: moment().add(270, 'seconds').format()
    }
}


export function generateToken() {
    let userId = localStorage.getItem("userId");
    let password = localStorage.getItem("password");
    let uri = authServerApiUrls.getSalt + userId;
    return (dispatch, getState) => {
        const tokenExpiredTime = getState().tokenExpiredTime;
        const expiredTime = new Date(tokenExpiredTime);
        if (new Date(expiredTime) > new Date()) {
            const generateToken = getState().generateToken;
            return Promise.resolve(dispatch(generateDuplicateToken(generateToken)));
        }
        if (!password) {
            return;
        }
        return fetch(uri)
            .then(res => res.json())
            .then(data => {
                if (data && data.status === 200) {
                    dispatch(setTokenExpiredTime());
                    return dispatch(generateSaltToken(data.data, password));
                }
            }).catch(err => {
                return err;
            });
    }
}

function clientUsers(clientUsers) {
    if (clientUsers.data && clientUsers.data.mappedUsers && clientUsers.data.mappedUsers.length > 0) {
        clientUsers = clientUsers.data.mappedUsers;
    } else {
        clientUsers = [];
    }
    return {
        type: CLIENT_USERS,
        clientUsers
    }
}
/**
 * @param {Object} request req object
 * @param {*} internalCall 
 */
export function getClientUsers(request, internalCallObj) {
    let internalCall = "";
    if (internalCallObj) {
        internalCall = `&internalCall=${internalCallObj}`;
    }
    let uri = `${clientApiUrls.getClientUsers}${request.clientId}&userId=${request.userId}&featureId=${request.featureId}&apiToken=${request.apiToken}${internalCall}`;
    return dispatch => {
        return fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(clientUsers(data)));
    }
}

export function setClientLogos(payload) {
    return {
        type: SET_CLIENT_LOGO,
        payload
    }
}
export function setMasterDataOptions(data) {
    return dispatch => {
        return dispatch(getMasterDataForCodes(data))
    }
}

export function setSelectedClientName(clientName) {
    return dispatch => {
        return dispatch({ type: "SELECTED_CLIENT_NAME", clientName });
    }
}