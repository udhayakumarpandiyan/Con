
import {SET_ROLE, ADD_ROLE, ROLE_UPDATED, ROLE_FETCHED, ROLE_DELETED} from "../../constants/index"

export default function roles(state = [], action = {} )  {

    switch(action.type) {

        case ADD_ROLE: 
            return [
                ...state,
                action.roles  
            ];  
            
        case ROLE_UPDATED:
			return state.map(role => {
				if (role._id === action.role._id) return action.role;
				return role;
			})    

        case ROLE_FETCHED:
            const index = state.findIndex(role => role._id === action.role._id);
            if (index > -1) {
                return state.map(role => {
                if (role._id === action.role._id) return action.role;
                return role;
                });
            } else {
                return [
                ...state,
                action.role
                ];
            }

        case ROLE_DELETED:
          return state.map(role => {
            if (role._id === action.roleId) {
              return action.role;
            }
            return role;
          });

        case SET_ROLE: 
          return action.roles

        default: return state;
    }

}