import {TICKET_DETAILS} from "../../constants/index"

export default function ticketDetails(state = [], action = {} )  {

    switch(action.type) {
        case TICKET_DETAILS: 
        	return action.ticketDetails
        default: return state;
    }
}
