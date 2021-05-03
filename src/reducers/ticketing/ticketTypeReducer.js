import {TICKET_TICKETTYPE}  from "../../constants/index"


export default function masterData(state = [], action = {} )  {
    switch(action.type) {
        case TICKET_TICKETTYPE: 
            return action.ticketType
            
        default: return state;
    }
}