import { CLIENT_DIR_LEVEL } from "./../../constants/index"

export default function clientDirLevel(state = [], action = {}) {
    switch (action.type) {
        case CLIENT_DIR_LEVEL:
            return action.clientDirLevel
        default: return state;
    }
}