
import { AZURE_HOST_LIST, PM_AZURE_LIST, ON_DEMAND_AZURE_CLIENT, ON_DEMAND_AZURE_SANDBOX, SET_AZURE_ON_DEMAND_TOKEN, SET_AZURE_ON_DEMAND_SET_INTERVAL_ID, AZURE_BULK_APPROVES, AZURE_BULK_REJECTS, AZURE_SYNC_HOST_STATUS, AZURE_MANUAL_START_HOST, AZURE_MANUAL_STOP_HOST, GET_AZURE_SEARCH_HOST } from "./../../constants/index"

export function azureList(state = [], action = {}) {
    switch (action.type) {
        case AZURE_HOST_LIST:
            return action.azureList
        default: return state;
    }
}

export function getAzureList(state = {}, action) {
    switch (action.type) {
        case PM_AZURE_LIST:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function onDemandAutoDiscoveryAzure(state = {}, action) {
    switch (action.type) {
        case ON_DEMAND_AZURE_CLIENT:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function onDemandADAzureSandbox(state = {}, action) {
    switch (action.type) {
        case ON_DEMAND_AZURE_SANDBOX:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function setAzureAutoDiscoveryToken(state = {}, action) {
    switch (action.type) {
        case SET_AZURE_ON_DEMAND_TOKEN:
            return action.azureOnDemandToken ? action.azureOnDemandToken : {};
        default: return state;
    }
}

export function setAzureOnDemandSetIntervalId(state = "", action) {
    switch (action.type) {
        case SET_AZURE_ON_DEMAND_SET_INTERVAL_ID:
            return action.setIntervalId ? action.setIntervalId : "";
        default: return state;
    }
}


export function bulkApproveAzure(state = {}, action) {
    switch (action.type) {
        case AZURE_BULK_APPROVES:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function bulkRejectAzure(state = {}, action) {
    switch (action.type) {
        case AZURE_BULK_REJECTS:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function azureCurrentState(state = {}, action) {
    switch (action.type) {
        case AZURE_SYNC_HOST_STATUS:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function azureSearchHost(state = {}, action) {
    switch (action.type) {
        case GET_AZURE_SEARCH_HOST:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function manualStartAzureHost(state = {}, action) {
    switch (action.type) {
        case AZURE_MANUAL_START_HOST:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function manualStopAzureHost(state = {}, action) {
    switch (action.type) {
        case AZURE_MANUAL_STOP_HOST:
            return action.data ? action.data : {};
        default: return state;
    }
}