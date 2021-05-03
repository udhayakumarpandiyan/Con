
import {
    AWS_HOST_LIST, HOST_CLIENTS, ENV_LIST, TYPE_LIST, OS_LIST, REGION_LIST_AWS, REGION_LIST_AZURE,
    AWS_SSO_URL, PM_AWS_LIST, GET_USER_HOST, CLIENT_AUTO_DISCOVER, CLIENT_AD_UPDATE,
    SANDBOX_AUTO_DISCOVER, SANDBOX_AD_UPDATE, ON_DEMAND_AWS_CLIENT, ON_DEMAND_AWS_SANDBOX, REMOVE_AWS_HOST,
    SEND_APPROVAL_AWS, GET_AUTO_DISCOVERY_STATUS, SET_AWS_ON_DEMAND_TOKEN, SET_AWS_ON_DEMAND_SET_INTERVAL_ID, AWS_BULK_APPROVES, AWS_BULK_REJECTS, AWS_SYNC_HOST_STATUS, AWS_MANUAL_START_HOST, AWS_MANUAL_STOP_HOST, GET_AWS_SEARCH_HOST
} from "./../../constants/index"

export function awsList(state = [], action = {}) {

    switch (action.type) {
        case AWS_HOST_LIST:
            return action.awsList


        default: return state;
    }
}

export function hostClients(state = [], action = {}) {
    switch (action.type) {
        case HOST_CLIENTS:
            return action.hostClients
        default: return state;
    }
}

export function getEnvList(state = [], action = {}) {
    switch (action.type) {
        case ENV_LIST:
            return action.getEnvList
        default: return state;
    }
}

export function getRegionAWS(state = [], action = {}) {
    switch (action.type) {
        case REGION_LIST_AWS:
            return action.getRegionAWS
        default: return state;
    }
}

export function getRegionAzure(state = [], action = {}) {
    switch (action.type) {
        case REGION_LIST_AZURE:
            return action.getRegionAzure
        default: return state;
    }
}

export function getTypeList(state = [], action = {}) {
    switch (action.type) {
        case TYPE_LIST:
            return action.getTypeList
        default: return state;
    }
}

export function getOsList(state = [], action = {}) {
    switch (action.type) {
        case OS_LIST:
            return action.getOsList
        default: return state;
    }
}

export function getSsoUrl(state = {}, action) {
    let { type, ssoUrls } = action;
    switch (type) {
        case AWS_SSO_URL:
            return ssoUrls;
        default:
            return state;
    }
}

export function getAwsList(state = {}, action) {
    switch (action.type) {
        case PM_AWS_LIST:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function getUserForHost(state = {}, action) {
    switch (action.type) {
        case GET_USER_HOST:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function getClientAutoDiscover(state = {}, action) {
    switch (action.type) {
        case CLIENT_AUTO_DISCOVER:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function updateClientAutoDiscover(state = {}, action) {
    switch (action.type) {
        case CLIENT_AD_UPDATE:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function getSandboxAutoDiscover(state = {}, action) {
    switch (action.type) {
        case SANDBOX_AUTO_DISCOVER:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function updateSandboxAutoDiscover(state = {}, action) {
    switch (action.type) {
        case SANDBOX_AD_UPDATE:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function onDemandAutoDiscoveryAws(state = {}, action) {
    switch (action.type) {
        case ON_DEMAND_AWS_CLIENT:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function onDemandADAwsSandbox(state = {}, action) {
    switch (action.type) {
        case ON_DEMAND_AWS_SANDBOX:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function removeAwsHost(state = {}, action) {
    switch (action.type) {
        case REMOVE_AWS_HOST:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function sendForApprovalAws(state = {}, action) {
    switch (action.type) {
        case SEND_APPROVAL_AWS:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function getAutoDiscoveryStatus(state = {}, action) {
    switch (action.type) {
        case GET_AUTO_DISCOVERY_STATUS:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function setAWSAutoDiscoveryToken(state = {}, action) {
    switch (action.type) {
        case SET_AWS_ON_DEMAND_TOKEN:
            return action.awsOnDemandToken ? action.awsOnDemandToken : {};
        default: return state;
    }
}

export function getOnDemandSetIntervalId(state = "", action) {
    switch (action.type) {
        case SET_AWS_ON_DEMAND_SET_INTERVAL_ID:
            return action.setIntervalId ? action.setIntervalId : "";
        default: return state;
    }
}

export function bulkApproveAws(state = {}, action) {
    switch (action.type) {
        case AWS_BULK_APPROVES:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function bulkRejectAws(state = {}, action) {
    switch (action.type) {
        case AWS_BULK_REJECTS:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function awsCurrentState(state = {}, action) {
    switch (action.type) {
        case AWS_SYNC_HOST_STATUS:
            return action.data ? action.data : {};
        default: return state;
    }
}
export function awsSearchHost(state = {}, action) {
    switch (action.type) {
        case GET_AWS_SEARCH_HOST:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function manualStartAwsHost(state = {}, action) {
    switch (action.type) {
        case AWS_MANUAL_START_HOST:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function manualStopAwsHost(state = {}, action) {
    switch (action.type) {
        case AWS_MANUAL_STOP_HOST:
            return action.data ? action.data : {};
        default: return state;
    }
}
