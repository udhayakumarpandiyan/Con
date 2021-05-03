import { USER_DIR_LIST } from "./../../constants/index"

export default function userDirList(state = [], action = {}) {
    switch (action.type) {
        case USER_DIR_LIST:
            return action.userDirList
        default: return state;
    }
}