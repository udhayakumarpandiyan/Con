
import { SET_CLINET_GROUP_USERS } from "../constants/index";

export default function userList(state = [], action = {} ) {

    switch(action.type) {

        case SET_CLINET_GROUP_USERS: 
         return action.userList
             
        default:
            return state;    
    }

}