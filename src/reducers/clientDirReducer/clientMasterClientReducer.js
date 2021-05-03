import { MASTER_CLIENT_CD } from "./../../constants/index"

export default function masterClientCD(state = [], action = {}) {
    switch (action.type) {
        case MASTER_CLIENT_CD:
            return action.masterClientCD
        default: return state;
    }
}