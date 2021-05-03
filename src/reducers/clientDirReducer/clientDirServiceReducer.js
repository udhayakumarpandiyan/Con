import { CLIENT_DIR_SUBSCRIBED_SERVICES } from "./../../constants/index"

export default function clientDirSubscribedServices(state = [], action = {}) {
    switch (action.type) {
        case CLIENT_DIR_SUBSCRIBED_SERVICES:
            return action.clientDirSubscribedServices
        default: return state;
    }
}