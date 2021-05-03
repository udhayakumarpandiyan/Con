import { SET_AZURE_AUTO_DISCOVERY_LIST, SET_AZURE_AUTO_DISCOVERY_BY_ID, DELETE_AUTO_DISCOVERY_AZURE_HOST, AZURE_SEND_APPROVAL_HOST, UPDATE_AUTO_DISCOVERY_AZURE_HOST } from "../../../constants/index";

export function getAzureAutoDiscoveryList(state = {}, action = {}) {
    switch (action.type) {
        case SET_AZURE_AUTO_DISCOVERY_LIST:
            return action.azureAutoDiscoveryList;
        default: return state;
    }
}

export function getAzureAutoDiscoveryById(state = {}, action = {}) {
    switch (action.type) {
        case SET_AZURE_AUTO_DISCOVERY_BY_ID:
            return action.azureAutoDiscoveryView;
        default: return state;
    }
}

export function deleteAutoDiscoveryHost(state = {}, action = {}) {
    switch (action.type) {
        case DELETE_AUTO_DISCOVERY_AZURE_HOST:
            return action.data;
        default: return state;
    }
}

export function azureSendForApprovalHost(state = {}, action = {}) {
    switch (action.type) {
        case AZURE_SEND_APPROVAL_HOST:
            return action.data;
        default: return state;
    }
}

export function updateAzureDiscoverHost(state = {}, action = {}) {
    switch (action.type) {
        case UPDATE_AUTO_DISCOVERY_AZURE_HOST:
            return action.data;
        default: return state;
    }
}
