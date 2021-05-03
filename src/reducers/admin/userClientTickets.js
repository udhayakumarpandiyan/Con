

import { SET_USER_CLIENT_TICKETS } from "../../constants/index";

export default function userClientTickets(state = [], action = {} ) {

    switch(action.type) {

        case SET_USER_CLIENT_TICKETS:
            return action.userClientTickets || []
            
        default:
            return state;    
    }

}
