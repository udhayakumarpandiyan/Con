import {
    CLIENT_DIR_LIST, CLIENT_DIR_STATUS, CLIENT_DIR_LEVEL, CLIENT_DIR_DETAILS,
    CLIENT_DIR_SMS, CLIENT_DIR_UNSUBSCRIBED_SERVICES, CLIENT_DIR_SUBSCRIBED_SERVICES,
    CLIENT_DIR_SERVICE_DELETE, CLIENT_DIR_SERVICE_ADD, CLIENT_DIR_COUNTRY, USER_DIR_LIST_FOR_CLIENT,
    CLIENT_DIR_ADD, CLIENT_DIR_EDIT, CLIENT_DIR_POLICIES, MASTER_CLIENT_CD
} from "../../constants/index";
import { clientApiUrls, userApiUrls, masterApiUrls } from "./../../util/apiManager";

export function getClientList(clientDirList) {
    return {
        type: CLIENT_DIR_LIST,
        clientDirList
    }
}

export function fetchClientsList(param) {
    // var param = {
    //     "userId": userId,
    //     "clientId": clientId,
    //     "featureId": featureId,
    //     "apiToken": apiToken,
    //     "filter": {}
    // };

    return dispatch =>
        fetch(clientApiUrls.searchClient, {
            method: 'POST',
            body: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(getClientList(data)));
}

export function filterClients(param) {
    return dispatch =>
        fetch(clientApiUrls.searchClient, {
            method: 'post',
            body: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(getClientList(data)));
}

export function setMasterData(clientDirStatus) {
    return {
        type: CLIENT_DIR_STATUS,
        clientDirStatus
    }
}

export function masterData(masterCode, userId, apiToken) {
    return dispatch => {
        fetch(`${masterApiUrls.getMasterData}${masterCode}&userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(setMasterData(data.data, masterCode)));
    }
}

export function setClientLevel(clientDirLevel) {
    return {
        type: CLIENT_DIR_LEVEL,
        clientDirLevel
    }
}

export function clientLevelData(clientLevelCode, userId, apiToken) {
    return dispatch => {
        fetch(`${masterApiUrls.getMasterData}${clientLevelCode}&userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(setClientLevel(data.data, clientLevelCode)));
    }
}

export function getClientDetails(clientDirDetails) {
    // sessionStorage.setItem("clientId", clientDirDetails.clientId);
    return {
        type: CLIENT_DIR_DETAILS,
        clientDirDetails
    }
}

export function fetchClientDetails(clientId, featureId, userId, clientIds, apiToken) {
    if (!clientId) {
        return dispatch => dispatch(getClientDetails({}));
    }
    var param = {
        "userId": userId,
        "clientId": clientIds,
        "featureId": featureId,
        "apiToken": apiToken,
        "filter": {
            "clientIds": [clientId]
        }
    };
    return dispatch =>
        fetch(clientApiUrls.searchClient, {
            method: 'post',
            body: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(getClientDetails(((data.data.clients && data.data.clients.length > 0) ? data.data.clients[0] : {}))));
}

export function submitPageSms(clientDirSubmitSms) {
    return {
        type: CLIENT_DIR_SMS,
        clientDirSubmitSms
    }
}

export function submitClientSms(data) {
    return dispatch => {
        return fetch(clientApiUrls.sendSmsToClient, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => dispatch(submitPageSms(data)));
    }
}

export function getUnSubscribedServices(clientDirUnsubscribedServices) {
    clientDirUnsubscribedServices = clientDirUnsubscribedServices.data.serviceProfile;
    return {
        type: CLIENT_DIR_UNSUBSCRIBED_SERVICES,
        clientDirUnsubscribedServices
    }
}

export function getUnSubscribedServicesData(featureId, userId, apiToken, clientId) {
    return dispatch => {
        fetch(clientApiUrls.unSubscribedServices + clientId + '&' + 'featureId=' + featureId + '&' + 'userId=' + userId + '&' + 'apiToken=' + apiToken)
            .then(res => res.json())
            .then(data => dispatch(getUnSubscribedServices(data)));
    }
}

export function getSubscribedServices(clientDirSubscribedServices) {
    clientDirSubscribedServices = clientDirSubscribedServices.data.serviceProfile;
    return {
        type: CLIENT_DIR_SUBSCRIBED_SERVICES,
        clientDirSubscribedServices
    }
}

export function getSubscribedServicesData(featureId, userId, apiToken, clientId) {
    return dispatch => {
        fetch(clientApiUrls.subscribedServices + clientId + '&' + 'featureId=' + featureId + '&' + 'userId=' + userId + '&' + 'apiToken=' + apiToken)
            .then(res => res.json())
            .then(data => dispatch(getSubscribedServices(data)));
    }
}

export function getDeleteData(clientDirServiceDelete) {
    return {
        type: CLIENT_DIR_SERVICE_DELETE,
        clientDirServiceDelete
    }
}

export function callDeleteService(data) {
    return dispatch => {
        return fetch(clientApiUrls.removeSubscription, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => dispatch(getDeleteData(data)));
    }
}

export function getAddData(clientDirServiceAdd) {
    return {
        type: CLIENT_DIR_SERVICE_ADD,
        clientDirServiceAdd
    }
}

export function callAddService(data) {
    return dispatch => {
        return fetch(clientApiUrls.addSubscription, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => dispatch(getAddData(data)));
    }
}

export function setClientCounrty(clientDirCountry) {
    return {
        type: CLIENT_DIR_COUNTRY,
        clientDirCountry
    }
}

export function clientCountryData(clientCountryCode, userId, apiToken) {
    return dispatch => {
        fetch(`${masterApiUrls.getMasterData}${clientCountryCode}&userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(setClientCounrty(data.data, clientCountryCode)));
    }
}

export function getUserListForClient(userDirListForClient) {
    userDirListForClient = userDirListForClient.data;
    return {
        type: USER_DIR_LIST_FOR_CLIENT,
        userDirListForClient
    }
}

export function fetchUsersListForlient(clientId, featureId, userId, apiToken) {
    var param = {
        "skip": 0,
        "limit": 100,
        "actionBy": userId,
        "clientId": clientId,
        "featureId": featureId,
        "apiToken": apiToken
    };
    return dispatch => {
        fetch(userApiUrls.getUserDashboard, {
            method: 'POST',
            body: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(getUserListForClient(data)));
    }
}

// Client Directory add client form API call

export function postClientData(clientDirAdd) {
    return {
        type: CLIENT_DIR_ADD,
        clientDirAdd
    }
}

export function submitClientData(data) {
    return dispatch => {
        return fetch(clientApiUrls.createClient, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(postClientData(data)));
    }
}

// Client Directory edit client form API call

export function updateClientData(clientDirEdit) {
    return {
        type: CLIENT_DIR_EDIT,
        clientDirEdit
    }
}

export function submitClientEditData(data) {
    var userId = data.userId;
    var featureId = data.featureId;
    var apiToken = data.apiToken;
    var clientId = data.clientId;
    delete data.userId;
    delete data.featureId;
    delete data.clientId;
    var tempReq = {
        clientId: clientId,
        userId: userId,
        featureId: featureId,
        apiToken: apiToken,
        updateKeys: data
    }
    return dispatch => {
        return fetch(clientApiUrls.updateClient, {
            method: 'POST',
            body: JSON.stringify(tempReq),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(updateClientData(data)));
    }
}

export function getPolicies(clientDirPolicies) {
    return {
        type: CLIENT_DIR_POLICIES,
        clientDirPolicies
    }
}

export function getPoliciesData(clientId) {
    return dispatch => {
        return fetch(clientApiUrls.getPolicy + clientId)
            .then(res => res.json())
            .then(data => dispatch(getPolicies(data.data)));
    }
}

export function getMasterClientData(masterClientCD) {
    return {
        type: MASTER_CLIENT_CD,
        masterClientCD
    }
}

export function getClientMasterClientApi() {
    return dispatch => {
        return fetch(clientApiUrls.getMasterClient)
            .then(res => res.json())
            .then(data => dispatch(getMasterClientData(data.data)));
    }
}