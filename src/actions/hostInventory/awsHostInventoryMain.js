import {
    AWS_HOST_LIST, AWS_HOST_DETAILS, AWS_HOST_START_DETAILS, AWS_HOST_STOP_DETAILS, HOST_ADD,
    HOST_CLIENTS, ENV_LIST, TYPE_LIST, OS_LIST, REGION_LIST_AWS, AWS_APPROVE_DETAILS
    , AWS_REJECT_DETAILS, AWS_MAPPING_INFO, AWS_SSO_URL, DELETE_AWS_HOST, UPDATE_AWS_HOST, PM_AWS_LIST, GET_USER_HOST,
    CLIENT_AUTO_DISCOVER, CLIENT_AD_UPDATE, SANDBOX_AUTO_DISCOVER, SANDBOX_AD_UPDATE, ON_DEMAND_AWS_CLIENT,
    ON_DEMAND_AWS_SANDBOX, REMOVE_AWS_HOST, SEND_APPROVAL_AWS, GET_AUTO_DISCOVERY_STATUS, SET_AWS_ON_DEMAND_TOKEN, SET_AWS_ON_DEMAND_SET_INTERVAL_ID, AWS_BULK_APPROVES, AWS_BULK_REJECTS, AWS_SYNC_HOST_STATUS, AWS_MANUAL_STOP_HOST, AWS_MANUAL_START_HOST
    , GET_AWS_SEARCH_HOST
} from "../../constants/index";
import { hostInventoryApiUrls, clientApiUrls, masterApiUrls } from "../../util/apiManager.jsx";
import _ from 'lodash';
import axios from 'axios';

export function getHost(awsList) {
    return {
        type: AWS_HOST_LIST,
        awsList
    }
}

export function displayHosts() {
    return dispatch => {
        fetch()
            .then(res => res.json())
            .then(data => dispatch(getHost(data.data)));
    }
}
export function displayAll(clientId, userId, status) {
    return dispatch => {
        return fetch(hostInventoryApiUrls.getHosts + clientId + "&userId=" + userId + "&approvalStatus=" + status)
            .then(res => res.json())
            .then(data => {
                dispatch(getHost(data.data));
                return data;
            });
    }
}

export function getSwitchRole(roleInfo) {
    return {
        type: AWS_MAPPING_INFO,
        roleInfo
    }
}

export function switchRole(token, clientId, userId) {
    return dispatch => {
        return fetch(clientApiUrls.getAWSMapping + clientId + "&userId=" + userId + "&apiToken=" + token)
            .then(res => res.json())
            .then(data => dispatch(getSwitchRole(data.data)));
    }
}

export function getDetails(awsHostDetails) {
    return {
        type: AWS_HOST_DETAILS,
        awsHostDetails
    }
}

export function fetchHostDetails(request) {
    let uri = hostInventoryApiUrls.displayAwsHostsById;
    if (!request) {
        return (dispatch) => dispatch(getDetails({}));
    }
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

export function approveDetails(awsApproveDetails) {
    return {
        type: AWS_APPROVE_DETAILS,
        awsApproveDetails
    }
}

export function approveHostDetails(hostInventoryId, hostname, approvalReqBy, userId) {
    var param = { hostInventoryId, "approvalReqBy": approvalReqBy, hostname, userId };
    let uri = hostInventoryApiUrls.approveHostDetails;
    return dispatch => {
        return fetch(uri, {
            method: 'PUT',
            body: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(approveDetails(data)));
    }
}


export function rejectHostDetails(hostInventoryId, approvalReqBy, userId) {
    var param = { hostInventoryId, approvalReqBy, userId };
    let uri = hostInventoryApiUrls.rejectHostDetails;
    return dispatch => {
        return fetch(uri, {
            method: 'PUT',
            body: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(rejectDetails(data)));
    }
}

export function rejectDetails(awsRejectDetails) {
    return {
        type: AWS_REJECT_DETAILS,
        awsRejectDetails
    }
}
export function startInstance(startEc2Data) {
    return {
        type: AWS_HOST_START_DETAILS,
        startEc2Data
    }
}

export function startEc2(reqBody) {
    let uri = hostInventoryApiUrls.startEC2;
    return dispatch =>
        axios.post(uri, reqBody)
            .then(res => dispatch(startInstance(res.data)))
            .catch(err => err);
}

export function stopInstance(stopEc2Data) {
    return {
        type: AWS_HOST_STOP_DETAILS,
        stopEc2Data
    }
}

export function stopEc2(request) {
    return dispatch =>
        axios.post(hostInventoryApiUrls.stopEC2, request)
            .then(res => dispatch(stopInstance(res.data)))
            .catch(err => err);
}

export function addHost(addHost) {
    return {
        type: HOST_ADD,
        addHost
    }
}


export function saveHost(values) {
    return dispatch =>
        axios.post(hostInventoryApiUrls.createHost, values)
            .then(res => dispatch(addHost(res.data)))
            .catch(err => err);
}

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


export function fetchEnv(userId, apiToken) {
    return dispatch => {
        fetch(`${hostInventoryApiUrls.fetchEnv}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getEnv(data.data)));
    }
}

export function getEnv(getEnvList) {
    return {
        type: ENV_LIST,
        getEnvList
    }
}

export function fetchRegionAWS(userId, apiToken) {
    return dispatch => {
        // ?userId=${userId}&apiToken=${apiToken}
        fetch(`${hostInventoryApiUrls.fetchRegionAWS}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getRegionAWS(data.data)));
    }
}

export function getRegionAWS(getRegionAWS) {
    return {
        type: REGION_LIST_AWS,
        getRegionAWS
    }
}

export function fetchType(userId, apiToken) {
    return dispatch => {
        fetch(`${hostInventoryApiUrls.fetchType}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getType(data.data)));
    }
}

export function getType(getTypeList) {
    return {
        type: TYPE_LIST,
        getTypeList
    }
}

export function fetchOs(userId, apiToken) {
    return dispatch => {
        fetch(`${hostInventoryApiUrls.fetchOs}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getOs(data.data)));
    }
}

export function getOs(getOsList) {
    return {
        type: OS_LIST,
        getOsList
    }
}

export function fetchSsoLoginUrl() {
    return async dispatch => {
        const res = await axios.get(`${masterApiUrls.gethealthboardFlagSSO}`);
        if (res.data.status === 200) {
            let { awsSsoUrl, ssoLoginUrl } = res.data.data;
            let ssoUrls = { awsSsoUrl, ssoLoginUrl };
            dispatch(getSsoUrl(ssoUrls));
        }
        return res;
    }
}

export function getSsoUrl(ssoUrls) {
    return {
        type: AWS_SSO_URL,
        ssoUrls
    }
}

export function deleteAwsHost(request) {
    return (dispatch) =>
        axios.post(hostInventoryApiUrls.deleteHost, request)
            .then(res => dispatch({ type: DELETE_AWS_HOST, data: res.data }))
            .catch(err => err)
}


// export function updateAWSHost(body) {
//     return dispatch =>
//         axios.put(hostInventoryApiUrls.updateHost, body)
//             .then(res => dispatch({ type: UPDATE_AWS_HOST, data: res.data }))
//             .catch(err => err)
// }

//New Apis of Host Inventory
export function getAwsList(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.listAwsHost}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: PM_AWS_LIST, data: res.data }))
            .catch(err => err);
    }
}

export function updateAWSHost(body) {
    return dispatch =>
        axios.put(hostInventoryApiUrls.updateAwsHost, body)
            .then(res => dispatch({ type: UPDATE_AWS_HOST, data: res.data }))
            .catch(err => err)
}

export function getUserForHost(request) {
    if (!request) {
        return dispatch => Promise.resolve(dispatch({ type: GET_USER_HOST, data: {} }));
    }
    return dispatch =>
        axios.post(hostInventoryApiUrls.getUserListForHost, request)
            .then(res => dispatch({ type: GET_USER_HOST, data: res.data }))
            .catch(err => err);
}

// Enable Auto Discovery at client level
export function getClientAutoDiscover(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.clientMappingExist}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: CLIENT_AUTO_DISCOVER, data: res.data }))
            .catch(err => err);
    }
}

export function updateClientAutoDiscover(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.clientAutoDiscover}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: CLIENT_AD_UPDATE, data: res.data }))
            .catch(err => err);
    }
}

// Enable Auto Discovery at sandbox level
export function getSandboxAutoDiscover(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.sandboxMappingExist}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: SANDBOX_AUTO_DISCOVER, data: res.data }))
            .catch(err => err);
    }
}

export function updateSandboxAutoDiscover(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.sandboxAutoDiscover}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: SANDBOX_AD_UPDATE, data: res.data }))
            .catch(err => err);
    }
}

// On demand discovery at client level : In AWS Inventory module
export function onDemandAutoDiscoveryAws(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.clientLevelAutoDiscoveryForAws}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: ON_DEMAND_AWS_CLIENT, data: res.data }))
            .catch(err => err);
    }
}

// On demand discovery at sandbox level
export function onDemandADAwsSandbox(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.autoDiscoveryForAwsAccount}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: ON_DEMAND_AWS_SANDBOX, data: res.data }))
            .catch(err => err);
    }
}

//delete AWS Host
export function removeAwsHost(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.removeAwsHost}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: REMOVE_AWS_HOST, data: res.data }))
            .catch(err => err);
    }
}

export function sendForApprovalAws(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.sendAwsHostForApproval}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: SEND_APPROVAL_AWS, data: res.data }))
            .catch(err => err);
    }
}

export function getAutoDiscoveryStatus(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.getManualAutoDiscoveryStatus}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: GET_AUTO_DISCOVERY_STATUS, data: res.data }))
            .catch(err => err);
    }
}

export function setAWSAutoDiscoveryToken(awsOnDemandToken) {
    return dispatch => dispatch({ type: SET_AWS_ON_DEMAND_TOKEN, awsOnDemandToken });
}

export function setOnDemandSetIntervalId(setIntervalId) {
    return dispatch => dispatch({ type: SET_AWS_ON_DEMAND_SET_INTERVAL_ID, setIntervalId });
}

export function bulkApproveAws(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.bulkApproveAws}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: AWS_BULK_APPROVES, data: res.data }))
            .catch(err => err);
    }
}

export function bulkRejectAws(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.bulkRejectAws}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: AWS_BULK_REJECTS, data: res.data }))
            .catch(err => err);
    }
}


export function awsCurrentState(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.awsCurrentState}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: AWS_SYNC_HOST_STATUS, data: res.data }))
            .catch(err => err);
    }
}


//search aws host api data
export function awsSearchHost(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.awsSearchHost}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: GET_AWS_SEARCH_HOST, data: res.data }))
            .catch(err => err);
    }
}
export function manualStartAwsHost(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.manualStartAwsHost}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: AWS_MANUAL_START_HOST, data: res.data }))
            .catch(err => err);
    }
}

export function manualStopAwsHost(postData) {
    return dispatch => {
        return axios.post(`${hostInventoryApiUrls.manualStopAwsHost}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: AWS_MANUAL_STOP_HOST, data: res.data }))
            .catch(err => err);
    }
}
