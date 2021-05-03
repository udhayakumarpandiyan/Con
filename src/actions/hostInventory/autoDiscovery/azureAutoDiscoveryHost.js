import axios from 'axios';
import {
    SET_AZURE_AUTO_DISCOVERY_LIST, SET_AZURE_AUTO_DISCOVERY_BY_ID, DELETE_AUTO_DISCOVERY_AZURE_HOST,
    AZURE_SEND_APPROVAL_HOST, UPDATE_AUTO_DISCOVERY_AZURE_HOST, SEND_TO_AZURE_PREVIOUS_STATE
} from "../../../constants/index"
import { hostInventoryApiUrls } from "../../../util/apiManager";

export function getAzureAutoDiscoveryList(payload) {
    if (!payload) {
        return dispatch => Promise.resolve(dispatch(setAutoDiscoveryList({})));
    }
    return (dispatch) =>
        axios.post(hostInventoryApiUrls.azureDiscoverList, payload)
            .then(res => dispatch(setAutoDiscoveryList(res.data)))
            .catch(err => err);
}

function setAutoDiscoveryList(azureAutoDiscoveryList) {
    return {
        type: SET_AZURE_AUTO_DISCOVERY_LIST,
        azureAutoDiscoveryList
    }
}
function setAutoDiscoveryView(azureAutoDiscoveryView) {
    return {
        type: SET_AZURE_AUTO_DISCOVERY_BY_ID,
        azureAutoDiscoveryView
    }
}

export function getAzureAutoDiscoveryById(payload) {
    if (!payload) {
        return dispatch => Promise.resolve(dispatch(setAutoDiscoveryView({})));
    }
    return (dispatch) =>
        axios.post(hostInventoryApiUrls.azureDiscoveredHost, payload)
            .then(res => dispatch(setAutoDiscoveryView(res.data)))
            .catch(err => err);
}

export function deleteAutoDiscoveryHost(payload) {
    return dispatch =>
        axios.post(hostInventoryApiUrls.removeAzureHost, payload)
            .then(res => dispatch({ type: DELETE_AUTO_DISCOVERY_AZURE_HOST, data: res.data }))
            .catch(err => err);
}

export function azureSendForApprovalHost(payload) {
    return dispatch =>
        axios.post(hostInventoryApiUrls.sendAzureHostForApproval, payload)
            .then(res => dispatch({ type: AZURE_SEND_APPROVAL_HOST, data: res.data }))
            .catch(err => err);
}

export function updateAzureDiscoverHost(payload) {
    return dispatch => axios.put(hostInventoryApiUrls.updateAzureDiscoverHost, payload)
        .then(res => dispatch({ data: res.data, type: UPDATE_AUTO_DISCOVERY_AZURE_HOST }))
        .catch(err => err)
}


