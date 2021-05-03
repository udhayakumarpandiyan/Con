

import { SET_CLIENT_USER_FEATURES, HAS_ADMIN_ACCESS } from "../../constants/index";

export default function clientUserFeatures(state = [], action = {} ) {

    switch(action.type) {

        case SET_CLIENT_USER_FEATURES:
            return action.clientUserFeatures
            
        default:
            return state;    
    }

}

export function hasAdminAccess(state = false, action = {}) {
    switch (action.type) {
        case HAS_ADMIN_ACCESS:
            return action.hasAdminAccess;
        default:
            return state;
    }
}