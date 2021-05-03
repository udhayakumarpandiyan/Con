import axios from "axios";
import { newDashBoard } from "../util/apiManager";
import {
    MY_TICKETS_SLA_STATS, ACKNOWLEDGE_EVENTS_TRENDS, EVENT_STATISTICS,
    TICKET_STATISTICS, MY_PERFORMANCE, MY_RESPONSE_RESOLUTION, ESCALATION_TICKET_LIST,
    EVENTS_BY_SOURCE,
    EVENTS_BY_TRENDS
} from "../constants/index";

export function EscalateTickets(reqbody) {
    return dispatch =>
        axios.post(newDashBoard.escalationTicketsList, reqbody)
            .then(res => {
                if (res?.status === 200) {
                    return dispatch({
                        type: ESCALATION_TICKET_LIST,
                        data: res?.data?.data
                    });
                }
            })
            .catch(err => err)

}

export function MyTicketSLAStas(reqbody) {
    return dispatch =>
        axios.post(newDashBoard.ticketSlaStatistics, reqbody)
            .then(res => {
                if (res?.status === 200) {
                    return dispatch({
                        type: MY_TICKETS_SLA_STATS,
                        data: res?.data?.data
                    });
                }
            })
            .catch(err => err)
}

export function AcknowledgeEvents(reqbody) {
    return dispatch =>
        axios.post(newDashBoard.acknowledgeEventsTrends, reqbody)
            .then(res => {
                if (res?.status === 200) {
                    return dispatch({
                        type: ACKNOWLEDGE_EVENTS_TRENDS,
                        data: res?.data?.data
                    });
                }
            })
            .catch(err => err)
}

export function EventStats(reqbody) {
    return dispatch =>
        axios.post(newDashBoard.eventStatistics, reqbody)
            .then(res => {
                if (res?.status === 200) {
                    return dispatch({
                        type: EVENT_STATISTICS,
                        data: res?.data?.data
                    });
                }
            })
            .catch(err => err)
}

export function TicketStats(reqbody) {
    return dispatch =>
        axios.post(newDashBoard.ticketStatics, reqbody)
            .then(res => {
                if (res?.status === 200) {
                    return dispatch({
                        type: TICKET_STATISTICS,
                        data: res?.data?.data
                    });
                }
            })
            .catch(err => err)
}

export function MyPerformanceStats(reqbody) {
    return dispatch =>
        axios.post(newDashBoard.ticketsGroupByDatePriority, reqbody)
            .then(res => {
                if (res?.status === 200) {
                    return dispatch({
                        type: MY_PERFORMANCE,
                        data: res?.data?.data
                    });
                }
            })
            .catch(err => err)
}

export function MyResponseResolution(reqbody) {
    return dispatch =>
        axios.post(newDashBoard.ticketsGroupByDateResponseResolution, reqbody)
            .then(res => {
                if (res?.status === 200) {
                    return dispatch({
                        type: MY_RESPONSE_RESOLUTION,
                        data: res?.data?.data
                    });
                }
            })
            .catch(err => err)
}

export function eventsBySource(reqbody) {
    return dispatch =>
        axios.post(newDashBoard.eventsBySource, reqbody)
            .then(res => {
                if (res?.status === 200) {
                    return dispatch({
                        type: EVENTS_BY_SOURCE,
                        data: res?.data?.data
                    });
                }
            })
            .catch(err => err)
}

export function eventsToolsTrendsData(reqbody) {
    return dispatch =>
        axios.post(newDashBoard.eventsToolsTrendsData, reqbody)
            .then(res => {
                if (res?.status === 200) {
                    return dispatch({
                        type: EVENTS_BY_TRENDS,
                        data: res?.data?.data
                    });
                }
            })
            .catch(err => err)
}