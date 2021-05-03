import {TICKET_STORY} from "../../constants/index"

export default function ticketStory(state = [], action = {} )  {

    switch(action.type) {
        case TICKET_STORY: 
        	return action.ticketStory
        default: return state;
    }
}
