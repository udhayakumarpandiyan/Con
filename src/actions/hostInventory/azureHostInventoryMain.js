import {
    AZURE_HOST_LIST, AZURE_HOST_DETAILS, AZURE_HOST_ADD, HOST_CLIENTS,
    AZURE_HOST_STOP_DETAILS, AZURE_HOST_START_DETAILS, REGION_LIST_AZURE, AZURE_REJECT_DETAILS, AZURE_APPROVE_DETAILS, DELETE_AWS_HOST, DELETE_AZURE_HOST, UPDATE_AZURE_HOST,
    PM_AZURE_LIST, ON_DEMAND_AZURE_CLIENT, ON_DEMAND_AZURE_SANDBOX, SET_AZURE_ON_DEMAND_TOKEN, SET_AZURE_ON_DEMAND_SET_INTERVAL_ID, AZURE_BULK_APPROVES, AZURE_BULK_REJECTS, AZURE_SYNC_HOST_STATUS, AZURE_MANUAL_START_HOST, AZURE_MANUAL_STOP_HOST
    , GET_AZURE_SEARCH_HOST
} from "../../constants/index";
import { hostInventoryApiUrls, clientApiUrls } from "./../../util/apiManager";
import axios from 'axios';

export function getHost(azureList) {
    return {
        type: AZURE_HOST_LIST,
        azureList
    }
}

export function displayAllAzure(clientId, userId, status) {
    return dispatch => {
        return fetch(hostInventoryApiUrls.getAzureHosts + clientId + "&userId=" + userId + "&approvalStatus=" + status)
            .then(res => res.json())
            .then(data => {
                dispatch(getHost(data.data));
                return data;
            });
    }
}

export function getDetails(azureHostDetails) {
    return {
        type: AZURE_HOST_DETAILS,
        azureHostDetails
    }
}

export function fetchAzureHostDetails(request) {
    if (!request) {
        return dispatch => { dispatch(getDetails({})) };
    }
    let uri = hostInventoryApiUrls.displayAzureHostsById;
    return dispatch => {
        return fetch(uri, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(getDetails(((data.data && data.data.length > 0) ? data.data[0] : {})));
                return data;
            });
    }
}


export function addAzureHost(addAzureHost) {
    return {
        type: AZURE_HOST_ADD,
        addAzureHost
    }
}


export function saveAzureHost(request) {
    return dispatch =>
        axios.post(hostInventoryApiUrls.createAzureHost, request)
            .then(res => dispatch(addAzureHost(res.data)))
            .catch(err => err);
}



export function approveDetailsAz(azureApproveDetails) {
    return {
        type: AZURE_APPROVE_DETAILS,
        azureApproveDetails
    }
}

export function approveHostDetailsAz(hostId, hostname, approvalReqBy, userId) {
    var param = {
        "hostInventoryId": hostId,
        "approvalReqBy": approvalReqBy,
        "hostname": hostname,
        "userId": userId
    };
    let uri = hostInventoryApiUrls.approveHostDetailsAz;
    return dispatch => {
        return fetch(uri, {
            method: 'PUT',
            body: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(approveDetailsAz(data)));

    }
}


export function rejectHostDetailsAz(hostInventoryId, approvalReqBy, userId) {
    var param = { hostInventoryId, approvalReqBy, userId };
    let uri = hostInventoryApiUrls.rejectHostDetailsAz;
    return dispatch => {
        return fetch(uri, {
            method: 'PUT',
            body: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(rejectDetailsAz(data)));

    }
}

export function rejectDetailsAz(azureRejectDetails) {
    return {
        type: AZURE_REJECT_DETAILS,
        azureRejectDetails
    }
}
//
export function fetchClients(userId, clientId, featureId, apiToken) {
    let uri = clientApiUrls.getClientListLinkedToUser + userId + "&userId=" + userId + "&clientId=" + clientId + "&featureId=" + featureId + "&apiToken=" + apiToken;
    return dispatch => {
        return fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(getClientsOnUser(data.data)));
    }
}

export function getClientsOnUser(hostClients) {
    return {
        type: HOST_CLIENTS,
        hostClients
    }
}


export function startVm(startVmData) {
    return {
        type: AZURE_HOST_START_DETAILS,
        startVmData
    }
}

export function startVirtualMachine(hostId, clientId, vmName, region) {
    var data =
    {
        "hostId": hostId,
        "clientId": clientId,
        "vmName": vmName,
        "region": region
    }

    let uri = hostInventoryApiUrls.startVm + data;

    return dispatch => {
        fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(startVm(((data.data && data.data.length > 0) ? data.data[0] : {}))));
    }
}

export function stopVm(stopVmData) {
    return {
        type: AZURE_HOST_STOP_DETAILS,
        stopVmData
    }
}

export function stopVirtualMachine(hostId, clientId, vmName, region) {
    return dispatch => {
        fetch(hostInventoryApiUrls.stopVm)
            .then(res => res.json())
            .then(data => dispatch(stopVm(((data.data && data.data.length > 0) ? data.data[0] : {}))));
    }
}

export function fetchRegionAzure(userId, apiToken) {
    return dispatch => {
        fetch(`${hostInventoryApiUrls.fetchRegionAzure}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getRegionAzure(data.data)));
    }
}

export function getRegionAzure(getRegionAzure) {
    return {
        type: REGION_LIST_AZURE,
        getRegionAzure
    }
}

export function deleteAzureHost(request) {
    return dispatch =>
        axios.post(hostInventoryApiUrls.deleteAzureHost, request)
            .then(res => dispatch({ type: DELETE_AZURE_HOST, data: res.data }))
            .catch(err => err);
}


// export function updateAzureHost(request) {
//     return dispatch =>
//         axios.put(hostInventoryApiUrls.updateAzureHost, request)
//             .then(res => dispatch({ type: UPDATE_AZURE_HOST, data: res.data }))
//             .catch(err => err);
// }

//New Apis of Azure
export function getAzureList(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.listAzureHost}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: PM_AZURE_LIST, data: res.data }))
            .catch(err => err);
    }
}

export function updateAzureHost(request) {
    return dispatch =>
        axios.put(hostInventoryApiUrls.EditAzureHost, request)
            .then(res => dispatch({ type: UPDATE_AZURE_HOST, data: res.data }))
            .catch(err => err);
}

// On demand discovery at client level : In AZURE Inventory module
export function onDemandAutoDiscoveryAzure(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.clientLevelAutoDiscoveryForAzure}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: ON_DEMAND_AZURE_CLIENT, data: res.data }))
            .catch(err => err);
    }
}

// On demand discovery at sandbox level
export function onDemandADAzureSandbox(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.autoDiscoveryForAzureAccount}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: ON_DEMAND_AZURE_SANDBOX, data: res.data }))
            .catch(err => err);
    }
}

export function setAzureAutoDiscoveryToken(azureOnDemandToken) {
    return dispatch => dispatch({ type: SET_AZURE_ON_DEMAND_TOKEN, azureOnDemandToken });
}

export function setAzureOnDemandSetIntervalId(setIntervalId) {
    return dispatch => dispatch({ type: SET_AZURE_ON_DEMAND_SET_INTERVAL_ID, setIntervalId });
}


export function bulkApproveAzure(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.bulkApproveAzure}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: AZURE_BULK_APPROVES, data: res.data }))
            .catch(err => err);
    }
}

export function bulkRejectAzure(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.bulkRejectAzure}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: AZURE_BULK_REJECTS, data: res.data }))
            .catch(err => err);
    }
}

export function azureCurrentState(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.azureCurrentState}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: AZURE_SYNC_HOST_STATUS, data: res.data }))
            .catch(err => err);
    }
}

export function manualStartAzureHost(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.manualStartAzureHost}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: AZURE_MANUAL_START_HOST, data: res.data }))
            .catch(err => err);
    }
}

export function manualStopAzureHost(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.manualStopAzureHost}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: AZURE_MANUAL_STOP_HOST, data: res.data }))
            .catch(err => err);
    }
}
//search azure host api data
export function azureSearchHost(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.azureSearchHost}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: GET_AZURE_SEARCH_HOST, data: res.data }))
            .catch(err => err);
    }
}