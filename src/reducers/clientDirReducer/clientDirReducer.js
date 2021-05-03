import { CLIENT_DIR_LIST } from "./../../constants/index"

export default function clientDirList(state = [], action = {}) {
    switch (action.type) {
        case CLIENT_DIR_LIST:
            return action.clientDirList
        default: return state;
    }
}