

import { SET_USER_GROUP_CLIENT_TICKETS } from "../../constants/index";

export default (state = [], action = {} ) => {

    switch(action.type) {
        case SET_USER_GROUP_CLIENT_TICKETS: 
            return action.userTopClientTickets
            
        default:
            return state;    
    }

}