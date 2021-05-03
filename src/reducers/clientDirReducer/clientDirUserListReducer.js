import { USER_DIR_LIST_FOR_CLIENT } from "./../../constants/index"

export default function userDirListForClient(state = [], action = {}) {
    switch (action.type) {
        case USER_DIR_LIST_FOR_CLIENT:
            return action.userDirListForClient
        default: return state;
    }
}