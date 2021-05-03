import { USER_DIR_STATUS } from "./../../constants/index"

export default function userDirStatus(state = [], action = {}) {
    switch (action.type) {
        case USER_DIR_STATUS:
            return action.userDirStatus
        default: return state;
    }
}