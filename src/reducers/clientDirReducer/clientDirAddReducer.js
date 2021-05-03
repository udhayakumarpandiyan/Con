import { CLIENT_DIR_ADD } from "./../../constants/index"

export default function clientDirAdd(state = [], action = {}) {
    switch (action.type) {
        case CLIENT_DIR_ADD:
            return action.clientDirAdd
        default: return state;
    }
}