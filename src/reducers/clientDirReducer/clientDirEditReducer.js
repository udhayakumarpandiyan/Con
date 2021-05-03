import { CLIENT_DIR_EDIT } from "./../../constants/index"

export default function clientDirEdit(state = [], action = {}) {
    switch (action.type) {
        case CLIENT_DIR_EDIT:
            return action.clientDirEdit
        default: return state;
    }
}