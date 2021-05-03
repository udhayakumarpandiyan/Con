import {
    MY_TICKETS_SLA_STATS, ACKNOWLEDGE_EVENTS_TRENDS, EVENT_STATISTICS,
    TICKET_STATISTICS, MY_PERFORMANCE, MY_RESPONSE_RESOLUTION, ESCALATION_TICKET_LIST,
    EVENTS_BY_SOURCE,
    EVENTS_BY_TRENDS
} from "../constants/index";


export function EscalateTickets(state = [], action = {}) {
    switch (action.type) {
        case ESCALATION_TICKET_LIST:
            return action.data;
        default: return state;
    }
}

export function MyTicketSLAStas(state = {}, action = {}) {
    switch (action.type) {
        case MY_TICKETS_SLA_STATS:
            return action.data
        default: return state;
    }
}
export function AcknowledgeEvents(state = [], action = {}) {
    switch (action.type) {
        case ACKNOWLEDGE_EVENTS_TRENDS:
            return action.data
        default: return state;
    }
}
export function EventStats(state = {}, action = {}) {
    switch (action.type) {
        case EVENT_STATISTICS:
            return action.data
        default: return state;
    }
}
export function TicketStats(state = {}, action = {}) {
    switch (action.type) {
        case TICKET_STATISTICS:
            return action.data
        default: return state;
    }
}
export function MyPerformanceStats(state = [], action = {}) {
    switch (action.type) {
        case MY_PERFORMANCE:
            return action.data
        default: return state;
    }
}

export function MyResponseResolution(state = [], action = {}) {
    switch (action.type) {
        case MY_RESPONSE_RESOLUTION:
            return action.data
        default: return state;
    }
}

export function eventsBySource(state = [], action = {}) {
    switch (action.type) {
        case EVENTS_BY_SOURCE:
            return action.data
        default: return state;
    }
}

export function eventsToolsTrendsData(state = [], action = {}) {
    switch (action.type) {
        case EVENTS_BY_TRENDS:
            return action.data
        default: return state;
    }
}