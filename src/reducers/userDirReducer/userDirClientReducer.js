import { USER_DIR_CLIENT } from "./../../constants/index"

export default function userDirClient(state = [], action = {}) {
    switch (action.type) {
        case USER_DIR_CLIENT:
            return action.userDirClient
        default: return state;
    }
}