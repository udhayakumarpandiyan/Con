import axios from "axios";
import { GET_CEM_ACTIVE_EVENTS, CEM_FILTER_DATA, GET_CEM_BUTTONS, GET_CEM_ALL_EVENTS_LISTS, GET_CEM_GRAPHANA_WIDGETS, EVENT_BY_RECURRENCE, EVENT_BY_THE_TIME, CEM_DASHBOARD_SEND_MAIL, TICKETS_BY_EVENTS, EVENT_ACKNOWLEDGE, GET_INCIDENT_DETAILS } from "../../constants/index";
import { cemDashboardEventsURLs, graphsUrls, productConfigUrls } from "../../util/apiManager";

export function getAllActiveEvents(payload) {
    return dispatch =>
        axios.post(cemDashboardEventsURLs.activeEvents, payload)
            .then(res => dispatch(allActiveEvents(res.data)))
            .catch(err => dispatch(allActiveEvents({ status: 201, message: err.message || "Something went wrong!" })));
}

export function addCreatedEvent(newEvent) {
    return (dispatch, getState) => {
        // let { data } = getState().getAllActiveEvents;
        let { data } = getState().getAllActiveEvents;
        if (Array.isArray(data)) {
            data.unshift(newEvent);
            return dispatch(allActiveEvents({ data: data }));
        }
    }
}

function allActiveEvents(data) {
    return {
        type: GET_CEM_ACTIVE_EVENTS,
        data
    }
}

export function getAllEventList(payload) {
    return dispatch =>
        axios.post(cemDashboardEventsURLs.allEventList, payload)
            .then(res => {
                const { data } = res.data || {};
                dispatch(allActiveEvents({ data: Array.isArray(data.eventList) ? data.eventList : [] }));
                return res.data;
            })
            .catch(err => dispatch(allActiveEvents({ status: 201, message: err.message || "Something went wrong!" })));
}

function allEventList(data) {
    return {
        type: GET_CEM_ALL_EVENTS_LISTS,
        data
    }
}

export function getFilteredNSortedActiveEvents(hasFiltered, filteringId = "", sortingField = "", sortingOrder = false) {
    return (dispatch, getState) => {
        var eventsData = [];
        if (hasFiltered) {
            eventsData = getState().getActiveFilteredEvents;
        } else {
            let { data } = getState().getAllActiveEvents;
            eventsData = data;
            // eventsData = data && data.eventList ? data.eventList : [];
        }
        let filteredEvents = JSON.parse(JSON.stringify(eventsData));
        if (filteringId) {
            let toolId = parseInt(filteringId);
            filteredEvents = Array.isArray(filteredEvents) && filteredEvents.filter(event => event.monitoringToolId === toolId);
        }
        if (sortingField) {
            Array.isArray(filteredEvents) && filteredEvents.sort((a, b) => {
                var dateA = new Date(a[sortingField]);
                var dateB = new Date(b[sortingField]);
                return sortingOrder ? dateA - dateB : dateB - dateA;
            });
        }
        return dispatch(filteredActiveEvents(filteredEvents));
    }
}

function filteredActiveEvents(filteredEvents) {
    return {
        type: CEM_FILTER_DATA,
        filteredEvents
    }
}


export function updatedActiveEvents(index, updatedData) {
    return (dispatch, getState) => {
        let { data } = getState().getAllActiveEvents;
        // let data = eventList;
        if (index > -1) {
            let eventsData = getState().getActiveFilteredEvents;
            const updatedEventData = index === 0 ? [updatedData, ...eventsData.slice(index + 1)] : [...eventsData.slice(0, index), updatedData, ...eventsData.slice(index + 1)];
            dispatch(filteredActiveEvents(updatedEventData))
        }
        const mainEventIndex = Array.isArray(data) && data.findIndex(item => item._id === updatedData._id);
        if (mainEventIndex > -1) {
            const mainActiveEvents = mainEventIndex === 0 ? [updatedData, ...data.slice(mainEventIndex + 1)] : [...data.slice(0, mainEventIndex), updatedData, ...data.slice(mainEventIndex + 1)];
            dispatch(allActiveEvents({ data: mainActiveEvents }));
        }
    }
}

export function deletedActiveEvent(index, id) {
    return (dispatch, getState) => {
        if (index > -1) {
            let eventsData = getState().getActiveFilteredEvents;
            const updatedEventData = index === 0 ? [...eventsData.slice(index + 1)] : [...eventsData.slice(0, index), ...eventsData.slice(index + 1)];
            dispatch(filteredActiveEvents(updatedEventData));
        }
        let { data } = getState().getAllActiveEvents;
        // let { data: { eventList } } = getState().getAllActiveEvents;
        // let data = eventList;
        const mainEventIndex = Array.isArray(data) && data.findIndex(item => item._id === id);
        if (mainEventIndex > -1) {
            const mainActiveEvents = mainEventIndex === 0 ? [...data.slice(mainEventIndex + 1)] : [...data.slice(0, mainEventIndex), ...data.slice(mainEventIndex + 1)];
            dispatch(allActiveEvents({ data: mainActiveEvents }));
        }
    }
}

export function loginDetailsByClientId(reqObj) {
    if (!reqObj) {
        return (dispatch) => dispatch(cemDetails({}));
    }
    return dispatch =>
        axios.post(productConfigUrls.loginDetailsByClientId, reqObj)
            .then(res => dispatch(cemDetails(res.data && res.data.data)))
            .catch(err => dispatch(cemDetails({ status: 201, message: err.message || "Something went wrong!" })));
}

function cemDetails(data) {
    return {
        type: GET_CEM_BUTTONS,
        data
    }
}

export function graphanaWidgetList(payload) {
    return dispatch =>
        axios.post(cemDashboardEventsURLs.graphanaWidgetURL, payload)
            .then(res => dispatch(graphanaWidgetListAction(res.data)))
            .catch(err => dispatch(graphanaWidgetListAction({ status: 201, message: err.message || "Something went wrong!" })));
}

function graphanaWidgetListAction(data) {
    return {
        type: GET_CEM_GRAPHANA_WIDGETS,
        data
    }
}

function eventByRecurrenceData(data) {
    return {
        type: EVENT_BY_RECURRENCE,
        data
    }
}

function eventByTheTimeData(data) {
    return {
        type: EVENT_BY_THE_TIME,
        data
    }
}

export function eventByRecurrence(payload) {
    return dispatch =>
        axios.post(cemDashboardEventsURLs.eventByRecurrence, payload)
            .then(res => dispatch(eventByRecurrenceData(res.data)))
            .catch(err => dispatch(eventByRecurrenceData({ status: 201, message: err.message || "Something went wrong!" })));
}

export function eventByTheTime(payload) {
    return dispatch =>
        axios.post(cemDashboardEventsURLs.eventByTheTime, payload)
            .then(res => dispatch(eventByTheTimeData(res.data)))
            .catch(err => dispatch(eventByTheTimeData({ status: 201, message: err.message || "Something went wrong!" })));
}

export function sendMailCemDashboard(payload) {
    return dispatch =>
        axios.post(cemDashboardEventsURLs.sendMailUrl, payload)
            .then(res => dispatch(sendMailCem(res.data)))
            .catch(err => dispatch(sendMailCem({ status: 201, message: err.message || "Something went wrong!" })));
}

function sendMailCem(data) {
    return {
        type: CEM_DASHBOARD_SEND_MAIL,
        data
    }
}

export function ticketByEvents(payload) {
    return dispatch =>
        axios.post(cemDashboardEventsURLs.ticketByEvents, payload)
            .then(res => dispatch(ticketsByEventsData(res.data)))
            .catch(err => dispatch(ticketsByEventsData({ status: 201, message: err.message || "Something went wrong!" })));
}

function ticketsByEventsData(ticketsEventData) {
    return {
        type: TICKETS_BY_EVENTS,
        ticketsEventData
    }
}

export function acknowledgeEvents(payload) {
    return dispatch =>
        axios.post(cemDashboardEventsURLs.acknowledgeEvents, payload)
            .then(res => dispatch(getAcknowledgeEvents(res.data)))
            .catch(err => dispatch(getAcknowledgeEvents({ status: 201, message: err.message || "Something went wrong!" })));
}


function getAcknowledgeEvents(data) {
    return {
        type: EVENT_ACKNOWLEDGE,
        data
    }
}

export function getIncidentDetails(payload) {
    if (!payload) {
        return dispatch => Promise.resolve(dispatch(incidentDetails({})));
    }
    return dispatch =>
        axios.post(cemDashboardEventsURLs.getTicketData, payload)
            .then(res => dispatch(incidentDetails(res.data)))
            .catch(err => dispatch(incidentDetails({ status: 201, message: err.message || "Something went wrong!" })));
}

function incidentDetails(data) {
    return {
        type: GET_INCIDENT_DETAILS,
        data
    }
}

export function updateEvent(payload) {
    return dispatch =>
        axios.post(cemDashboardEventsURLs.updateEvent, payload)
            .then(res => dispatch({ type: "UPDATE_EVENT", data: res.data }))
            .catch(err => dispatch({ status: 201, type: "UPDATE_EVENT", message: err.message || "Something went wrong!" }));
}

export function availableOrchTemplate(payload) {
    return dispatch =>
        axios.post(graphsUrls.availableOrchTemplate, payload)
            .then(res => dispatch({ type: "AVAILABLE_ORCHTEMPLATE", data: res.data }))
            .catch(err => dispatch({ status: 201, type: "AVAILABLE_ORCHTEMPLATE", message: err.message || "Something went wrong!" }));
}

export function getEventsBySearch(payload) {
    return dispatch =>
        axios.post(cemDashboardEventsURLs.getEventByEventId, payload)
            .then(res => {
                const { data } = res.data || {};
                dispatch(allActiveEvents({ data: Array.isArray(data.eventList) ? data.eventList : [] }));
                return res.data;
            })
            .catch(err => dispatch(allActiveEvents({ status: 201, message: err.message || "Something went wrong!" })));
}
