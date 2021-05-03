
import {SET_PERMISSION, ADD_PERMISSION, PERMISSION_UPDATED, PERMISSION_FETCHED, PERMISSION_DELETED} from "../../constants/index"

export default function permissions(state = [], action = {} )  {

    switch(action.type) {

        case ADD_PERMISSION: 
            return [
                ...state,
                action.permission
            ];  
            
        case PERMISSION_UPDATED:
			return state.map(permission => {
				if (permission._id === action.permission._id) return action.permission;
				return permission;
			})    

        case PERMISSION_FETCHED:
            const index = state.findIndex(permission => permission._id === action.permission._id);
            if (index > -1) {
                return state.map(permission => {
                if (permission._id === action.permission._id) return action.permission;
                return permission;
                });
            } else {
                return [
                ...state,
                action.permission
                ];
            }

        case PERMISSION_DELETED:
          return state.map(permission => {
            if (permission._id === action.permissionId) {
              return action.permission;
            }
            return permission;
          });

        case SET_PERMISSION: 
          return action.permissions

        default: return state;
    }

}