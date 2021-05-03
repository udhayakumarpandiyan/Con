import {
    GET_POLICY_REPORT, TICKET_SUMMARY, SERVICE_SUMMARY, USER_REQUEST_REPORT,
    CLIENT_REQUEST_REPORT, USERS_LIST_FOR_CLIENT, USERS_OPEN_TICKETS
} from "../../constants/index";

import { reportApiUrls } from "./../../util/apiManager";

export function fetchPolicyReport(userId, apiToken) {
    return dispatch =>
        fetch(`${reportApiUrls.getPolicyReport}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(getPolicyReport(data)));
}

export function getPolicyReport(policyReport) {
    return {
        type: GET_POLICY_REPORT,
        policyReport
    }
}


export function fetchTicketSummary(req, apiToken) {
    if (!req) {
        return dispatch => dispatch(getTicketSummary({}));
    }
    let request = req;
    var param = {
        "clientId": request.clientId,
        "deptId": request.groupId,
        "priorityId": request.priorityId,
        "ticketTypeId": request.typeId,
        "state": request.statusId,
        "skipValue": 0,
        "limitValue": 50000,
        "fromDate": request.startDate,
        "toDate": request.endDate,
        "userId": request.userId,
        "apiToken": apiToken,
        "featureId": request.featureId,
        "isSlaBreached": request.isSlaBreached
    }

    return dispatch => fetch(reportApiUrls.ticketSummaryReport, {
        method: 'POST',
        body: JSON.stringify(param),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
        .then(data => dispatch(getTicketSummary(data)));
}


export function getTicketSummary(ticketSummary) {
    return {
        type: TICKET_SUMMARY,
        ticketSummary: ticketSummary
    }
}

export function fetchServiceSummary(req, apiToken) {
    if (!req) {
        return dispatch => dispatch(getServiceSummary({}));
    }
    let request = req;
    var param = {
        "clientId": request.clientId,
        "fromDate": request.startDate,
        "toDate": request.endDate,
        "userId": request.userId,
        "apiToken": apiToken,
        "featureId": request.featureId
    }

    return dispatch => {
        return fetch(reportApiUrls.serviceSummaryReport, {
            method: 'POST',
            body: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(getServiceSummary(data)));
    }
}

export function getServiceSummary(serviceSummary) {
    return {
        type: SERVICE_SUMMARY,
        serviceSummary
    }
}

export function fetchUserReport(request) {
    if (!request) {
        return dispatch => dispatch(getUserReport({}));
    }

    return dispatch => {
        return fetch(reportApiUrls.userRequestReport, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(getUserReport(data)));
    }
}

export function getUserReport(userReport) {
    return {
        type: USER_REQUEST_REPORT,
        userReport
    }
}

export function fetchClientReport(request) {
    if (!request) {
        return dispatch => dispatch(getClientReport({}));
    }

    return dispatch => {
        return fetch(reportApiUrls.clientRequestReport, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(getClientReport(data)));
    }
}

export function getClientReport(clientReport) {
    return {
        type: CLIENT_REQUEST_REPORT,
        clientReport
    }
}

export function fetchUsersForClients(request) {
    if (!request) {
        return dispatch => dispatch(getUsersForClients({}));
    }

    return dispatch => {
        return fetch(reportApiUrls.listOfUsersForClientIds, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(getUsersForClients(data)));
    }
}

export function getUsersForClients(usersForClients) {
    return {
        type: USERS_LIST_FOR_CLIENT,
        usersForClients
    }
}

export function fetchUsersTickets(request) {
    if (!request) {
        return dispatch => dispatch(getUserTickets({}));
    }

    return dispatch => {
        return fetch(reportApiUrls.userTicketsCount, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(getUserTickets(data)));
    }
}

export function getUserTickets(userOpenTickets) {
    return {
        type: USERS_OPEN_TICKETS,
        userOpenTickets
    }
}