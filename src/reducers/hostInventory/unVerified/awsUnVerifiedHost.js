import { SET_AWS_UN_VERIFIED_LIST, SET_AWS_UN_VERIFIED_BY_ID, SEND_PREVIOUS_STATE_AWS } from "../../../constants/index"

export function getAwsUnVerifiedList(state = {}, action = {}) {
    switch (action.type) {
        case SET_AWS_UN_VERIFIED_LIST:
            return action.awsUnVerifiedList
        default: return state;
    }
}

export function getAwsUnVerifiedById(state = {}, action = {}) {
    switch (action.type) {
        case SET_AWS_UN_VERIFIED_BY_ID:
            return action.awsUnVerifiedView
        default: return state;
    }
}

export function sendPreviousStateAws(state = {}, action = {}) {
    switch (action.type) {
        case SEND_PREVIOUS_STATE_AWS:
            return action.data;
        default: return state;
    }
}