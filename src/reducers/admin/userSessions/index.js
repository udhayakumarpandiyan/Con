
import { SESSIONS_SELECTED_TAB, ACTIVE_USER_SESSIONS } from "../../../constants/index"

export function SelectedSessionTab(state = {}, payload) {

    switch (payload.type) {
        case SESSIONS_SELECTED_TAB:
            return payload.selectedTab
        default:
            return state;
    }
}


export function activeSessions(state = [], payload) {
    switch (payload.type) {
        case ACTIVE_USER_SESSIONS:
            return payload.activeSessions;
        default:
            return state;
    }
}