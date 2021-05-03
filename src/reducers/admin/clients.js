
import {SET_CLIENT, ADD_CLIENT, CLIENT_UPDATED, CLIENT_FETCHED, CLIENT_DELETED} from "../../constants/index"

export default function clients(state = [], action = {} )  {
    switch(action.type) {
        case ADD_CLIENT: 
            return [
                ...state,
                action.client  
            ];  
        case CLIENT_UPDATED:
			return state.map(client => {
				if (client._id === action.client._id) return action.client;
				return client;
			})
        case CLIENT_FETCHED:
            const index = state.findIndex(client => client._id === action.client._id);
            if (index > -1) {
                return state.map(client => {
                if (client._id === action.client._id) return action.client;
                return client;
                });
            } else {
                return [
                ...state,
                action.client
                ];
            }
        case CLIENT_DELETED:
          return state.map(client => {
            if (client._id === action.clientId) {
              return action.client;
            }
            return client;
          });
        case SET_CLIENT: 
          return action.clients

        default: return state;
    }

}