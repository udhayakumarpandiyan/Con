
import { SET_GROUPS, SET_CLINET_GROUPS, ADD_GROUP, GROUP_UPDATED, GROUP_FETCHED, GROUP_DELETED, RESOURCES_FAIL, GET_AVEREAGE_TICKETS, GET_SLA_INFO, CEM_EVENT_BAR_GRAPH_DATA, TICKET_STATUS_DATA, GET_AVAILABLE_TICKET_ARTICLES, GET_EVENTS_BY_SOURCE, GET_TICKET_COUNT_BY_STATUS, GET_TICKET_AVERAGE_TIME } from "../../constants/index"

export default function groups(state = [], action = {}) {
    switch (action.type) {
        case ADD_GROUP:
            return [
                ...state,
                action.group
            ];

        case GROUP_UPDATED:
            return state;
        /* state.map(group => {
            if (group._id === action.group._id) return action.group;
            return group;
        }) */
        case GROUP_FETCHED:
            const index = state.findIndex(group => group._id === action.group._id);
            if (index > -1) {
                return state.map(group => {
                    if (group._id === action.group._id) return action.group;
                    return group;
                });
            } else {
                return [
                    ...state,
                    action.group
                ];
            }

        case GROUP_DELETED:
            return state.map(group => {
                if (group._id === action.groupId) {
                    return action.group;
                }
                return group;
            });

        case SET_GROUPS:
            return action.groups

        case SET_CLINET_GROUPS:
            if (action.groups === undefined) {
                return action.groups = { "data": "" }
            } else {
                return action.groups
            }

        case RESOURCES_FAIL:
            return Object.assign({}, state, { isFormError: true })

        default: return state;
    }

}

export function getAverageTickets(state = {}, action) {
    switch (action.type) {
        case GET_AVEREAGE_TICKETS:
            return action.data
        default:
            return state;
    }
}

export function getSLAInfo(state = {}, action) {
    switch (action.type) {
        case GET_SLA_INFO:
            return action.data;
        default:
            return state;
    }
}

export function cemEventBarGraphData(state = {}, action) {
    switch (action.type) {
        case CEM_EVENT_BAR_GRAPH_DATA:
            return action.data;
        default:
            return state;
    }
}

export function getTicketStatus(state = {}, action) {
    switch (action.type) {
        case TICKET_STATUS_DATA:
            return action.data;
        default:
            return state;
    }
}

export function getAvailableTicketArticles(state = {}, action) {
    switch (action.type) {
        case GET_AVAILABLE_TICKET_ARTICLES:
            return action.data;
        default:
            return state;
    }
}

export function getEventsBySource(state = {}, action) {
    switch (action.type) {
        case GET_EVENTS_BY_SOURCE:
            return action.data;
        default:
            return state;
    }
}

export function getTicketsCountByStatus(state = {}, action) {
    switch (action.type) {
        case GET_TICKET_COUNT_BY_STATUS:
            return action.data;
        default:
            return state;
    }
}

export function ticketAvgResponceResolution(state = {}, action) {
    switch (action.type) {
        case GET_TICKET_AVERAGE_TIME:
            return action.data;
        default:
            return state;
    }
}