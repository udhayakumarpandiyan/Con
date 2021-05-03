import axios from 'axios';
import { SET_AWS_REJECTED_LIST, SET_AWS_REJECTED_BY_ID, UPDATED_AWS_REJECTED_HOST } from "../../../constants/index"
import { hostInventoryApiUrls } from "../../../util/apiManager";

export function getAwsRejectedList(payload) {
    if (!payload) {
        return dispatch => Promise.resolve(dispatch(setRejectedList({})));
    }
    return (dispatch) =>
        axios.post(hostInventoryApiUrls.awsRejectedList, payload)
            .then(res => dispatch(setRejectedList(res.data)))
            .catch(err => err);
}

function setRejectedList(awsRejectedList) {
    return {
        type: SET_AWS_REJECTED_LIST,
        awsRejectedList
    }
}
function setRejectedView(awsRejectedView) {
    return {
        type: SET_AWS_REJECTED_BY_ID,
        awsRejectedView
    }
}

export function getAwsRejectedById(payload) {
    if (!payload) {
        return dispatch => Promise.resolve(dispatch(setRejectedView({})));
    }
    return (dispatch) =>
        axios.post(hostInventoryApiUrls.awsRejectedHost, payload)
            .then(res => dispatch(setRejectedView(res.data)))
            .catch(err => err);
}


export function updateAwsRejectedHost(payload) {
    if (!payload) {
        return dispatch => Promise.resolve(dispatch(setUpdatedRejected({})));
    }
    return (dispatch) =>
        axios.put(hostInventoryApiUrls.updateAwsRejectedHost, payload)
            .then(res => dispatch(setUpdatedRejected(res.data)))
            .catch(err => err);
}

function setUpdatedRejected(data) {
    return {
        type: UPDATED_AWS_REJECTED_HOST,
        data
    }
}