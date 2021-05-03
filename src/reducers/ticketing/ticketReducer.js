import {    TICKET_LIST, MERGED_TICKETS , MERGED_PARENT_TICKETS, MERGED_CHILD_TICKETS , UN_MERGED_TICKETS,
            MERGED_PARENT_TICKETS_DASHBOARD } from "../../constants/index"

export default function tickets(state = [], action = {}) {

    switch (action.type) {
        case TICKET_LIST:
            return action.tickets

        case MERGED_TICKETS:
            return action.tickets   

        case MERGED_PARENT_TICKETS:
            return action.tickets 
            
        case MERGED_CHILD_TICKETS:
            return action.tickets  

        case UN_MERGED_TICKETS:
            return action.tickets   
        case MERGED_PARENT_TICKETS_DASHBOARD:
            return action.tickets    

        default: return state;
    }
}