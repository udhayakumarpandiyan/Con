import { CLIENT_DIR_SERVICE_ADD } from "./../../constants/index"

export default function clientDirServiceAdd(state = [], action = {}) {
    switch (action.type) {
        case CLIENT_DIR_SERVICE_ADD:
            return action.clientDirServiceAdd
        default: return state;
    }
}