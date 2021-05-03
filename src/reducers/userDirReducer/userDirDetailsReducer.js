import { USER_DIR_DETAILS } from "./../../constants/index"

export default function userDirDetails(state = [], action = {}) {
    switch (action.type) {
        case USER_DIR_DETAILS:
            return action.userDirDetails
        default: return state;
    }
}