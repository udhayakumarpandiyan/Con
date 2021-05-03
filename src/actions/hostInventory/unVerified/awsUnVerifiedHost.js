import axios from 'axios';
import { SET_AWS_UN_VERIFIED_LIST, SET_AWS_UN_VERIFIED_BY_ID, SEND_PREVIOUS_STATE_AWS } from "../../../constants/index"
import { hostInventoryApiUrls } from "../../../util/apiManager";

export function getAwsUnVerifiedList(payload) {
    if (!payload) {
        return dispatch => Promise.resolve(dispatch(setUnVerifiedList({})));
    }
    return (dispatch) =>
        axios.post(hostInventoryApiUrls.awsUnVerifiedList, payload)
            .then(res => dispatch(setUnVerifiedList(res.data)))
            .catch(err => err);
}

function setUnVerifiedList(awsUnVerifiedList) {
    return {
        type: SET_AWS_UN_VERIFIED_LIST,
        awsUnVerifiedList
    }
}
function setUnVerifiedView(awsUnVerifiedView) {
    return {
        type: SET_AWS_UN_VERIFIED_BY_ID,
        awsUnVerifiedView
    }
}

export function getAwsUnVerifiedById(payload) {
    if (!payload) {
        return dispatch => Promise.resolve(dispatch(setUnVerifiedView({})));
    }
    return (dispatch) =>
        axios.post(hostInventoryApiUrls.awsUnVerifiedHost, payload)
            .then(res => dispatch(setUnVerifiedView(res.data)))
            .catch(err => err);
}

export function sendPreviousStateAws(payload) {
    return (dispatch) =>
        axios.put(hostInventoryApiUrls.sendAwsPreviousState, payload)
            .then(res => dispatch(setPreviousStateAws(res.data)))
            .catch(err => err);
}

function setPreviousStateAws(data) {
    return {
        type: SEND_PREVIOUS_STATE_AWS,
        data
    }
}