import { USER_DIR_ADD } from "./../../constants/index"

export default function userDirAdd(state = [], action = {}) {
    switch (action.type) {
        case USER_DIR_ADD:
            return action.userDirAdd
        default: return state;
    }
}