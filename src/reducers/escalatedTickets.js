import { ESCALATED_TICKETS } from "../constants/index";

export function EscalateTickets(state = {}, action = {}) {
    switch (action.type) {
        case ESCALATED_TICKETS:
            return action.data
        default:
            return state;
    }
}