import { SET_AZURE_UN_VERIFIED_LIST, SET_AZURE_UN_VERIFIED_BY_ID, SEND_TO_AZURE_PREVIOUS_STATE } from "../../../constants/index"

export function getAzureUnVerifiedList(state = {}, action = {}) {
    switch (action.type) {
        case SET_AZURE_UN_VERIFIED_LIST:
            return action.azureUnVerifiedList
        default: return state;
    }
}

export function getAzureUnVerifiedById(state = {}, action = {}) {
    switch (action.type) {
        case SET_AZURE_UN_VERIFIED_BY_ID:
            return action.azureUnVerifiedView
        default: return state;
    }
}

export function sendToAzurePreviousState(state = {}, action = {}) {
    switch (action.type) {
        case SEND_TO_AZURE_PREVIOUS_STATE:
            return action.data;
        default: return state;
    }
}