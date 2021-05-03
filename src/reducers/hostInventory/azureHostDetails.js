import { AZURE_HOST_DETAILS, AZURE_HOST_START_DETAILS, AZURE_HOST_STOP_DETAILS, AZURE_REJECT_DETAILS, AZURE_APPROVE_DETAILS, DELETE_AZURE_HOST, UPDATE_AZURE_HOST } from "./../../constants/index"

export default function azureHostDetails(state = [], action = {}) {

    switch (action.type) {
        case AZURE_HOST_DETAILS:
            return action.azureHostDetails
        default: return state;
    }
}


export function azureApproveDetails(state = [], action = {}) {

    switch (action.type) {
        case AZURE_APPROVE_DETAILS:
            return action.azureApproveDetails
        default: return state;
    }
}

export function azureRejectDetails(state = [], action = {}) {

    switch (action.type) {
        case AZURE_REJECT_DETAILS:
            return action.azureRejectDetails
        default: return state;
    }
}
export function startVmData(state = [], action = {}) {

    switch (action.type) {
        case AZURE_HOST_START_DETAILS:
            return action.startvMData
        default: return state;
    }
}


export function stopVmData(state = [], action = {}) {

    switch (action.type) {
        case AZURE_HOST_STOP_DETAILS:
            return action.stopVMData
        default: return state;
    }
}

export function deleteAzureHost(state = {}, action) {
    switch (action.type) {
        case DELETE_AZURE_HOST:
            return action.data
        default: return state;
    }
}

export function updateAzureHost(state = {}, action) {
    switch (action.type) {
        case UPDATE_AZURE_HOST:
            return action.data
        default: return state;
    }
}
