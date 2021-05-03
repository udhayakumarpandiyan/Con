import { CLIENT_DIR_STATUS } from "./../../constants/index"

export default function clientDirStatus(state = [], action = {}) {
    switch (action.type) {
        case CLIENT_DIR_STATUS:
            return action.clientDirStatus
        default: return state;
    }
}