
import axios from "axios";
import { dispatch } from "d3-dispatch";
import {
    TICKET_LIST, TICKET_DETAILS, TICKET_STORY,
    TICKET_STATUS, TICKET_PRIORITY, TICKET_TICKETTYPE, USERS_LIST, MERGED_TICKETS,
    MERGED_PARENT_TICKETS, MERGED_CHILD_TICKETS, UN_MERGED_TICKETS,
    MERGED_PARENT_TICKETS_DASHBOARD,
    AWS_SERVICE_CODE,
    AWS_CATEGORY_CODE
} from "../../constants/index";
import { ticketApiUrls, masterApiUrls, userApiUrls, orchestrationUrls, teamsConfiguration } from "../../util/apiManager";


function handleResponse(response) {
    if (response.status === 200) {
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

// code for ticket list actions
export function setTicket(tickets) {
    return {
        type: TICKET_LIST,
        tickets
    }
}

export function setMergeParentTickets(tickets) {
    return {
        type: MERGED_PARENT_TICKETS,
        tickets
    }
}

export function setMergeChildTickets(tickets) {
    return {
        type: MERGED_CHILD_TICKETS,
        tickets
    }
}


export function setParentTicketsDashboard(tickets) {
    return {
        type: MERGED_PARENT_TICKETS_DASHBOARD,
        tickets
    }
}



export function setMergeTickets(tickets) {
    return {
        type: MERGED_TICKETS,
        tickets
    }
}

export function setUnMergeTickets(tickets) {
    return {
        type: UN_MERGED_TICKETS,
        tickets
    }
}

/* not using */
export function fetchTickets(clientId) {
    let postData = {
        "clientId": clientId
    };
    return dispatch => {
        return fetch(ticketApiUrls.ticketDashboard, {
            method: 'post',
            body: JSON.stringify(postData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => dispatch(setTicket(data.data)));
    }
}

/* not using */
export function fetchAllTickets() {
    let postData = {}
    return dispatch =>
        fetch(ticketApiUrls.ticketDashboard, {
            method: 'post',
            body: JSON.stringify(postData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json()).then(handleResponse)
            .then(data => dispatch(setTicket(data.data)));
}

// code for fetching details action
export function getTicketDetails(ticketDetails) {
    return {
        type: TICKET_DETAILS,
        ticketDetails
    }
}

export function fetchTicketDetails(ticketId) {
    let url = ticketApiUrls.getTicketDetails + parseInt(ticketId, 10);
    return dispatch =>
        fetch(url)
            .then(res => res.json())
            .then(data => dispatch(getTicketDetails(data.data.ticketDetails)));
}

//code for fetching ticket story action
export function getTicketStory(ticketStory) {
    return {
        type: TICKET_STORY,
        ticketStory
    }
}

export function fetchTicketStory(ticketId) {
    let url = ticketApiUrls.getTicketDetails + parseInt(ticketId, 10);
    return dispatch =>
        fetch(url)
            .then(res => res.json())
            .then(data => dispatch(getTicketStory(data.data.ticketStory)));
}

export function setMasterData(masterData, masterCode) {
    switch (masterCode) {
        case "TA":
            let ticketState = masterData;
            return {
                type: TICKET_STATUS,
                ticketState
            }
        case "TT":
            let ticketType = masterData;
            return {
                type: TICKET_TICKETTYPE,
                ticketType
            }
        case "SA":
            let ticketPriority = masterData;
            return {
                type: TICKET_PRIORITY,
                ticketPriority
            }
    }
}

export function masterData(masterCode, userId, apiToken) {
    return dispatch =>
        fetch(`${masterApiUrls.getMasterData}${masterCode}&userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(setMasterData(data.data, masterCode)));
}
/* not using */
export function filterTickets(filterData) {
    return dispatch => {
        return fetch(ticketApiUrls.ticketDashboard, {
            method: 'post',
            body: JSON.stringify(filterData),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(setTicket(data.data)));

    }
}
export function setUsers(usersLists) {
    return {
        type: USERS_LIST,
        usersLists
    }
}
export function fetchUsersList() {
    let postData = {
        "skip": 0,
        "limit": 100
    }
    return dispatch =>
        fetch(userApiUrls.getUserDashboard, {
            method: 'post',
            body: JSON.stringify(postData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => dispatch(setUsers(data.data)));
}

export function saveMergeTickets(data) {
    return dispatch => {
        return fetch(`${ticketApiUrls.mergeTickets}`, {
            method: 'POST',
            mode: "cors",
            redirect: 'follow',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleResponse)
            .then(data => dispatch(setMergeTickets(data)));
    }
}


export function fetchMergeParentTickets() {
    return dispatch => {
        fetch(`${ticketApiUrls.getMergeParentTickets}`)
            .then(res => res.json())
            .then(data => dispatch(setMergeParentTickets(data)))

    }
}

export function fetchMergeChildTickets(data) {
    let url = `${ticketApiUrls.getMergeChildTickets}?${data}`;
    return dispatch => {
        return fetch(url)
            .then(res => res.json())
            .then(data => dispatch(setMergeChildTickets(data)))

    }
}

export function fetchMergeChildTicketsCall(data) {
    var queryString = Object.keys(data).map(key => key + '=' + data[key]).join('&');
    let url = `${ticketApiUrls.getMergeChildTickets}?${queryString}`;
    return dispatch => {
        return fetch(url)
            .then(res => res.json())
            .then(data => dispatch(setMergeChildTickets(data)))

    }
}

export function fetchParentTicketsDashboard(data) {
    let url = `${ticketApiUrls.parentTicketsDashboard}`;
    return dispatch => {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            }
        })
            .then(res => res.json())
            .then(data => dispatch(setParentTicketsDashboard(data.data)))

    }
}



export function saveUnMergeTickets(data) {
    return dispatch => {
        return fetch(`${ticketApiUrls.unMergeTickets}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            }
        }).then(handleResponse)
            .then(data => dispatch(setUnMergeTickets(data)));
    }
}



export function escalateTicket(ticketId, clientId, userId) {
    // let postData = {
    //     "ticketId": ticketId,
    //     "clientId": clientId,
    //     "escalatedTo": userId,
    //     "createdBy": current_user.payload.userId
    // }

    // return dispatch => {
    //     fetch(ticketApiUrls.escalateTicket, {
    //         method: 'post',
    //         body: JSON.stringify(postData),
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     })
    //         .then(res => res.json())
    //         .then(data => dispatch(setUsers(data.data)));
    // }
}


export function getServiceCodesAws(userId, apiToken) {
    return dispatch => {
        return fetch(`${ticketApiUrls.getServiceCodesAws}?userId=${userId}&apiToken=${apiToken}`)
            .then(handleResponse)
            .then(data => {
                dispatch(serviceCodes(data && data.data));
                return data;
            });
    }
}

export function getCategoryCodesAws(serviceCode, userId, apiToken) {
    if (!serviceCode) {
        return dispatch => Promise.resolve(dispatch(categoryCodes([])));
    }
    return dispatch => {
        return fetch(`${ticketApiUrls.getCategoryCodesAws}?serviceCode=${serviceCode}&userId=${userId}&apiToken=${apiToken}`)
            .then(handleResponse)
            .then(data => {
                dispatch(categoryCodes(data && data.data));
                return data;
            });
    }
}

export function createAwsSupportTicket(payload) {
    return dispatch => {
        return fetch(`${ticketApiUrls.createAwsSupportTicket}`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            }
        })
            .then(handleResponse)
            .then(data => {
                return data;
            });
    }
}

export function serviceCodes(serviceCodes) {
    return {
        type: AWS_SERVICE_CODE,
        serviceCodes
    }
}

export function categoryCodes(categoryCodes) {
    return {
        type: AWS_CATEGORY_CODE,
        categoryCodes
    }
}

export function fetchMatchOrchTemplates(body) {
    return axios.post(orchestrationUrls.matchOrchTemplates, body).then(res => res);
}

export function timeZonesBehalfOfUser(payload) {
    return dispatch => {
        return fetch(`${teamsConfiguration.getTimeZonesBehalfOfUser}`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            }
        })
            .then(handleResponse)
            .then(res => {
                return dispatch({ type: 'GET_TIMEZONES', data: res.data });
            });
    }
}