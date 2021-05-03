import { CLIENT_DIR_POLICIES } from "./../../constants/index"

export default function clientDirPolicies(state = [], action = {}) {
    switch (action.type) {
        case CLIENT_DIR_POLICIES:
            return action.clientDirPolicies
        default: return state;
    }
}