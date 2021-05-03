

import { ADD_GROUP_FEATURE_PERMISSION, SET_GROUP_FEATURE_PERMISSIONS } from "../../constants/index";

export default function groupFeaturePermissions(state = [], action = {} ) {

    switch(action.type) {

        case SET_GROUP_FEATURE_PERMISSIONS:
            return action.groupFeaturePermissions

        case ADD_GROUP_FEATURE_PERMISSION: 
            return action.groupFeaturePermission
             
        default:
            return state;    
    }

}
