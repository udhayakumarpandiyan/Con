import { SET_AWS_REJECTED_LIST, SET_AWS_REJECTED_BY_ID, UPDATED_AWS_REJECTED_HOST } from "../../../constants/index"

export function getAwsRejectedList(state = {}, action = {}) {
    switch (action.type) {
        case SET_AWS_REJECTED_LIST:
            return action.awsRejectedList
        default: return state;
    }
}

export function getAwsRejectedById(state = {}, action = {}) {
    switch (action.type) {
        case SET_AWS_REJECTED_BY_ID:
            return action.awsRejectedView
        default: return state;
    }
}

export function updateAwsRejectedHost(state = {}, action = {}) {
    switch (action.type) {
        case UPDATED_AWS_REJECTED_HOST:
            return action.data;
        default: return state;
    }
}