import { USER_DIR_EDIT } from "./../../constants/index"

export default function userDirEdit(state = [], action = {}) {
    switch (action.type) {
        case USER_DIR_EDIT:
            return action.userDirEdit
        default: return state;
    }
}