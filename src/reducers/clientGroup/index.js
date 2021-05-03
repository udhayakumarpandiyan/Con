

import { ADD_CLIENT_GORUP_USER } from "../../constants/index";

export default function clientGroupUser(state = [], action = {} ) {

    switch(action.type) {

        case ADD_CLIENT_GORUP_USER: 
         return action.clientGroupUser
             
        default:
            return state;    
    }

}
