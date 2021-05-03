import {TICKET_PRIORITY}  from "../../constants/index"


export default function masterData(state = [], action = {} )  {
    switch(action.type) {
        case TICKET_PRIORITY: 
            return action.ticketPriority
            
        default: return state;
    }
}