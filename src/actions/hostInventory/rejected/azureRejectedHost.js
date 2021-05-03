import axios from 'axios';
import { SET_AZURE_REJECTED_LIST, SET_AZURE_REJECTED_BY_ID, UPDATE_REJECTED_AZURE_HOST } from "../../../constants/index"
import { hostInventoryApiUrls } from "../../../util/apiManager";

export function getAzureRejectedList(payload) {
    if (!payload) {
        return dispatch => Promise.resolve(dispatch(setRejectedList({})));
    }
    return (dispatch) =>
        axios.post(hostInventoryApiUrls.azureRejectedList, payload)
            .then(res => dispatch(setRejectedList(res.data)))
            .catch(err => err);
}

function setRejectedList(azureRejectedList) {
    return {
        type: SET_AZURE_REJECTED_LIST,
        azureRejectedList
    }
}
function setRejectedView(azureRejectedView) {
    return {
        type: SET_AZURE_REJECTED_BY_ID,
        azureRejectedView
    }
}


export function getAzureRejectedById(payload) {
    if (!payload) {
        return dispatch => Promise.resolve(dispatch(setRejectedView({})));
    }
    return (dispatch) =>
        axios.post(hostInventoryApiUrls.azureRejectedHost, payload)
            .then(res => dispatch(setRejectedView(res.data)))
            .catch(err => err);
}

export function updateAzureRejectedHost(payload) {
    return dispatch => axios.put(hostInventoryApiUrls.updateAzureRejectHost, payload)
        .then(res => dispatch({ data: res.data, type: UPDATE_REJECTED_AZURE_HOST }))
        .catch(err => err)
}


