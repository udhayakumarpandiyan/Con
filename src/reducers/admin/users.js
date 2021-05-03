
import { SET_USER, ADD_USER, USER_UPDATED, USER_FETCHED, USER_DELETED } from "../../constants/index"

export default function groups(state = [], action = {} )  {

    switch(action.type) {

        case ADD_USER: 
            return [
                ...state,
                action.user
            ];  
            
        case USER_UPDATED:
			return state.map(user => {
				if (user._id === action.user._id) return action.user;
				return user;
			})    

        case USER_FETCHED:
            const index = state.findIndex(user => user._id === action.user._id);
            if (index > -1) {
                return state.map(user => {
                if (user._id === action.user._id) return action.user;
                return user;
                });
            } else {
                return [
                ...state,
                action.user
                ];
            }

        case USER_DELETED:
          return state.map(user => {
            if (user._id === action.userId) {
              return action.user;
            }
            return user;
          });

        case SET_USER: 
          return action.users

        default: return state;
    }

}