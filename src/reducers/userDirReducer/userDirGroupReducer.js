import { USER_DIR_GROUP } from "./../../constants/index"

export default function userDirGroup(state = [], action = {}) {
    switch (action.type) {
        case USER_DIR_GROUP:
            return action.userDirGroup
        default: return state;
    }
}