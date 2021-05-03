import { CLIENT_DIR_SMS } from "./../../constants/index"

export default function clientDirSubmitSms(state = [], action = {}) {
    switch (action.type) {
        case CLIENT_DIR_SMS:
            return action.clientDirSubmitSms
        default: return state;
    }
}