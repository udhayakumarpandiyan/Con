import { GET_CEM_ACTIVE_EVENTS, CEM_FILTER_DATA, GET_CEM_BUTTONS, GET_CEM_ALL_EVENTS_LISTS, GET_CEM_GRAPHANA_WIDGETS, EVENT_BY_THE_TIME, EVENT_BY_RECURRENCE, CEM_DASHBOARD_SEND_MAIL, TICKETS_BY_EVENTS, EVENT_ACKNOWLEDGE, GET_INCIDENT_DETAILS } from "../../constants/index";

export function getAllActiveEvents(state = [], payload) {
    switch (payload.type) {
        case GET_CEM_ACTIVE_EVENTS:
            return payload.data
        default: return state
    }
}
export function getAllEventList(state = [], payload) {
    switch (payload.type) {
        case GET_CEM_ALL_EVENTS_LISTS:
            return payload.data
        default: return state
    }
}

export function getActiveFilteredEvents(state = [], payload) {
    switch (payload.type) {
        case CEM_FILTER_DATA:
            return payload.filteredEvents
        default: return state
    }
}

export function loginDetailsByClientId(state = [], payload) {
    switch (payload.type) {
        case GET_CEM_BUTTONS:
            return payload.data
        default: return state;
    }
}

export function graphanaWidgetList(state = [], payload) {
    switch (payload.type) {
        case GET_CEM_GRAPHANA_WIDGETS:
            return payload.data
        default: return state
    }
}

export function eventByRecurrence(state = [], payload) {
    switch (payload.type) {
        case EVENT_BY_RECURRENCE:
            return payload.data
        default: return state
    }
}

export function eventByTheTime(state = [], payload) {
    switch (payload.type) {
        case EVENT_BY_THE_TIME:
            return payload.data
        default: return state
    }
}

export function sendMailCemDashboard(state = [], payload) {
    switch (payload.type) {
        case CEM_DASHBOARD_SEND_MAIL:
            return payload.data
        default: return state
    }
}

export function ticketByEvents(state = [], payload) {
    switch (payload.type) {
        case TICKETS_BY_EVENTS:
            return payload.ticketsEventData;
        default: return state;
    }
}

export function getAcknowledgeEvents(state = [], payload) {
    switch (payload.type) {
        case EVENT_ACKNOWLEDGE:
            return payload.data;
        default: return state;
    }
}

export function incidentDetails(state = [], payload) {
    switch (payload.type) {
        case GET_INCIDENT_DETAILS:
            return payload.data;
        default: return state;
    }
}

export function updateEvent(state = [], payload) {
    switch (payload.type) {
        case "UPDATE_EVENT":
            return payload.data;
        default: return state;
    }
}

export function availableOrchTemplate(state = [], payload) {
    switch (payload.type) {
        case "AVAILABLE_ORCHTEMPLATE":
            return payload.data;
        default: return state;
    }
}
