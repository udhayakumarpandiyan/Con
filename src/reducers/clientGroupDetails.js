
import { SET_CLINET_GROUP_DETAILS } from "../constants/index";

export default function clientGroups(state = [], action = {} ) {

    switch(action.type) {

        case SET_CLINET_GROUP_DETAILS: 
         return action.clientGroupDetails
             
        default:
            return state;    
    }

}