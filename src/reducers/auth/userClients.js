

import { SET_USER_CLIENTS } from "../../constants/index";

export default (state = [], action = {} ) => {

    switch(action.type) {
        case SET_USER_CLIENTS:
            return action.userClients
            
        default:
            return state;    
    }

}