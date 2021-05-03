import { CLIENT_DIR_UNSUBSCRIBED_SERVICES } from "./../../constants/index"

export default function clientDirUnsubscribedServices(state = [], action = {}) {
    switch (action.type) {
        case CLIENT_DIR_UNSUBSCRIBED_SERVICES:
            return action.clientDirUnsubscribedServices
        default: return state;
    }
}