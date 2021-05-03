import { CLIENT_DIR_SERVICE_DELETE } from "./../../constants/index"

export default function clientDirServiceDelete(state = [], action = {}) {
    switch (action.type) {
        case CLIENT_DIR_SERVICE_DELETE:
            return action.clientDirServiceDelete
        default: return state;
    }
}