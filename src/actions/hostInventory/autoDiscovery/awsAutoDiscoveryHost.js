import axios from 'axios';
import { SET_AWS_AUTO_DISCOVERY_LIST, SET_AWS_AUTO_DISCOVERY_BY_ID, UPDATED_AWS_DISCOVERED_HOST } from "../../../constants/index"
import { hostInventoryApiUrls } from "../../../util/apiManager";

export function getAwsAutoDiscoveryList(payload) {
    if (!payload) {
        return dispatch => Promise.resolve(dispatch(setAutoDiscoveryList({})));
    }
    return (dispatch) =>
        axios.post(hostInventoryApiUrls.awsDiscoverList, payload)
            .then(res => dispatch(setAutoDiscoveryList(res.data)))
            .catch(err => err);
}

function setAutoDiscoveryList(awsAutoDiscoveryList) {
    return {
        type: SET_AWS_AUTO_DISCOVERY_LIST,
        awsAutoDiscoveryList
    }
}
function setAutoDiscoveryView(awsAutoDiscoveryView) {
    return {
        type: SET_AWS_AUTO_DISCOVERY_BY_ID,
        awsAutoDiscoveryView
    }
}

export function getAwsAutoDiscoveryById(payload) {
    if (!payload) {
        return dispatch => Promise.resolve(dispatch(setAutoDiscoveryView({})));
    }
    return (dispatch) =>
        axios.post(hostInventoryApiUrls.awsDiscoveredHost, payload)
            .then(res => dispatch(setAutoDiscoveryView(res.data)))
            .catch(err => err);
}

export function updateAwsDiscoveredHost(payload) {
    if (!payload) {
        return dispatch => Promise.resolve(dispatch(setUpdateDiscovered({})));
    }
    return (dispatch) =>
        axios.put(hostInventoryApiUrls.updateAwsDiscoveredHost, payload)
            .then(res => dispatch(setUpdateDiscovered(res.data)))
            .catch(err => err);
}

function setUpdateDiscovered(data) {
    return {
        type: UPDATED_AWS_DISCOVERED_HOST,
        data
    }
}
