import { CLIENT_DIR_DETAILS } from "./../../constants/index"

export default function clientDirDetails(state = [], action = {}) {
    switch (action.type) {
        case CLIENT_DIR_DETAILS:
            return action.clientDirDetails
        default: return state;
    }
}