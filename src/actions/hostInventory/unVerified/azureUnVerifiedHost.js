import axios from 'axios';
import { SET_AZURE_UN_VERIFIED_LIST, SET_AZURE_UN_VERIFIED_BY_ID, SEND_TO_AZURE_PREVIOUS_STATE } from "../../../constants/index"
import { hostInventoryApiUrls } from "../../../util/apiManager";

export function getAzureUnVerifiedList(payload) {
    if (!payload) {
        return dispatch => Promise.resolve(dispatch({}));
    }
    return (dispatch) =>
        axios.post(hostInventoryApiUrls.azureUnVerifiedList, payload)
            .then(res => dispatch(setUnVerifiedList(res.data)))
            .catch(err => err);
}

function setUnVerifiedList(azureUnVerifiedList) {
    return {
        type: SET_AZURE_UN_VERIFIED_LIST,
        azureUnVerifiedList
    }
}
function setUnVerifiedView(azureUnVerifiedView) {
    return {
        type: SET_AZURE_UN_VERIFIED_BY_ID,
        azureUnVerifiedView
    }
}

export function getAzureUnVerifiedById(payload) {
    if (!payload) {
        return dispatch => Promise.resolve(dispatch({}));
    }
    return (dispatch) =>
        axios.post(hostInventoryApiUrls.azureUnVerifiedHost, payload)
            .then(res => dispatch(setUnVerifiedView(res.data)))
            .catch(err => err);
}

export function sendToAzurePreviousState(payload) {
    return dispatch => axios.put(hostInventoryApiUrls.sendAzurePreviousState, payload)
        .then(res => dispatch({ data: res.data, type: SEND_TO_AZURE_PREVIOUS_STATE }))
        .catch(err => err)
}