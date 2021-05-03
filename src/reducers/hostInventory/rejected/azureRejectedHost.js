import { SET_AZURE_REJECTED_LIST, SET_AZURE_REJECTED_BY_ID, UPDATE_REJECTED_AZURE_HOST } from "../../../constants/index"

export function getAzureRejectedList(state = {}, action = {}) {
    switch (action.type) {
        case SET_AZURE_REJECTED_LIST:
            return action.azureRejectedList
        default: return state;
    }
}

export function getAzureRejectedById(state = {}, action = {}) {
    switch (action.type) {
        case SET_AZURE_REJECTED_BY_ID:
            return action.azureRejectedView
        default: return state;
    }
}

export function updateAzureRejectedHost(state = {}, action = {}) {
    switch (action.type) {
        case UPDATE_REJECTED_AZURE_HOST:
            return action.data
        default: return state;
    }
}