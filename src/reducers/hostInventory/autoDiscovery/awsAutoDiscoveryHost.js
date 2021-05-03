import { SET_AWS_AUTO_DISCOVERY_LIST, SET_AWS_AUTO_DISCOVERY_BY_ID, UPDATED_AWS_DISCOVERED_HOST } from "../../../constants/index"

export function getAwsAutoDiscoveryList(state = {}, action = {}) {
    switch (action.type) {
        case SET_AWS_AUTO_DISCOVERY_LIST:
            return action.awsAutoDiscoveryList
        default: return state;
    }
}

export function getAwsAutoDiscoveryById(state = {}, action = {}) {
    switch (action.type) {
        case SET_AWS_AUTO_DISCOVERY_BY_ID:
            return action.awsAutoDiscoveryView
        default: return state;
    }
}

export function updateAwsDiscoveredHost(state = {}, action = {}) {
    switch (action.type) {
        case UPDATED_AWS_DISCOVERED_HOST:
            return action.data;
        default: return state;
    }
}