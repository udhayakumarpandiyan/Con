
import { SET_USER_GROUP_CLIENT_TICKETS, GET_AVEREAGE_TICKETS, GET_SLA_INFO, CEM_EVENT_BAR_GRAPH_DATA, TICKET_STATUS_DATA, GET_AVAILABLE_TICKET_ARTICLES, GET_EVENTS_BY_SOURCE, GET_TICKET_COUNT_BY_STATUS, GET_TICKET_AVERAGE_TIME } from "../../constants/index";
import { ticketApiUrls, cemDashboardEventsURLs, graphsUrls } from "../../util/apiManager";
import axios from "axios";

function handleResponse(response) {
    if (response.statusText === "OK") {
        return response.json();
    } else {
        let err = new Error(response.statusText);
        err.response = response;
        throw err;
    }
}

function handleQuery(self) {
    let params = { "userId": localStorage.getItem("userId"), "apiToken": self.token }
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString
}

export function setUserGroupClientTickets(userTopClientTickets) {
    return {
        type: SET_USER_GROUP_CLIENT_TICKETS,
        userTopClientTickets
    }
}

export function fetchUserGroupClientTickets(client, current_user, featureId, token) {
    let postData = {
        "userId": localStorage.getItem('userId'),
        "clientId": client,
        "internalCall": 1,
        "apiToken": token
    };
    return dispatch => {
        let url = `${ticketApiUrls.getTopSixGroups}`
        return fetch(url, {
            method: 'post',
            body: JSON.stringify(postData),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(setUserGroupClientTickets(data.data)));
    }
}

function averageAgeTickets(data) {
    return {
        type: GET_AVEREAGE_TICKETS,
        data
    }
}

export function getAverageAgeTickets(clientId, internalCall, apiToken, userId) {
    let internalCallStr = "";
    if (internalCall) {
        internalCallStr = `&internalCall=${internalCall}`;
    }
    let uri = "";
    uri = clientId === "all" ? ticketApiUrls.averageAging + "?apiToken=" + apiToken + "&userId=" + userId : ticketApiUrls.averageAging + "?clientId=" + clientId + internalCallStr + "&apiToken=" + apiToken + "&userId=" + userId;
    return dispatch => axios.get(uri)
        .then(res => {
            dispatch(averageAgeTickets(res && res.data && res.data.data));
            return res;
        });
}

export function getSLAInfo(clientId, userId, apiToken) {
    const url = clientId === "all" ? `?clientId=${clientId}&userId=${userId}&apiToken=${apiToken}` : `?userId=${userId}&apiToken=${apiToken}`;
    let uri = `${ticketApiUrls.slaBreachInfo}${url}`;
    return dispatch =>
        axios.get(uri).then(res => {
            dispatch(slaInfo(res && res.data && res.data.data));
            return res;
        });
}

function slaInfo(data) {
    return {
        type: GET_SLA_INFO,
        data
    }
}


export function cemEventBarGraphData(payload) {
    let uri = `${cemDashboardEventsURLs.cemEventBarGraphData}`;
    return dispatch =>
        axios.post(uri, payload).then(res => {
            dispatch(getCemEventBarGraphData(res && res.data && res.data.data));
            return res;
        });
}

function getCemEventBarGraphData(data) {
    return {
        type: CEM_EVENT_BAR_GRAPH_DATA,
        data
    }
}


export function getTicketStatsForDashBoard(payload) {
    let uri = `${ticketApiUrls.getTicketStats}`;
    return dispatch =>
        axios.post(uri, payload).then(res => {
            dispatch(getTicketStats(res && res.data && res.data.data));
            return res;
        });
}

function getTicketStats(data) {
    return {
        type: TICKET_STATUS_DATA,
        data
    }
}


function getAvailableTicketArticleStats(data) {
    return {
        type: GET_AVAILABLE_TICKET_ARTICLES,
        data
    }
}

function setEventsBySource(data) {
    return {
        type: GET_EVENTS_BY_SOURCE,
        data
    }
}

export function getAvailableTicketArticles(payload) {
    let uri = `${graphsUrls.availableTicketArticles}`;
    return dispatch =>
        axios.post(uri, payload).then(res => {
            dispatch(getAvailableTicketArticleStats(res && res.data && res.data.data));
            return res;
        });
}

export function getEventsBySource(payload) {
    let uri = `${graphsUrls.eventByTheToolsTime}`;
    return dispatch =>
        axios.post(uri, payload).then(res => {
            dispatch(setEventsBySource(res && res.data));
            return res;
        });
}


export function getTicketsCountByStatus(payload) {
    let uri = `${graphsUrls.ticketStatusCount}`;
    return dispatch =>
        axios.post(uri, payload).then(res => {
            dispatch({ type: GET_TICKET_COUNT_BY_STATUS, data: res && res.data });
            return res;
        });
}

export function ticketAvgResponceResolution(payload) {
    let uri = `${graphsUrls.ticketAvgResponceResolution}`;
    return dispatch =>
        axios.post(uri, payload).then(res => {
            dispatch({ type: GET_TICKET_AVERAGE_TIME, data: res && res.data });
            return res;
        });
}




