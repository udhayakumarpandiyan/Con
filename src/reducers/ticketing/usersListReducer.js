import {USERS_LIST}  from "../../constants/index"


export default function usersLists(state = [], action = {} )  {
    switch(action.type) {
        case USERS_LIST: 
            return action.usersLists
            
        default: return state;
    }
}