import { USER_DIR_ROLE } from "./../../constants/index"

export default function userDirRole(state = [], action = {}) {
    switch (action.type) {
        case USER_DIR_ROLE:
            return action.userDirRole
        default: return state;
    }
}