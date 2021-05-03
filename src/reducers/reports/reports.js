import {GET_POLICY_REPORT,TICKET_SUMMARY,SERVICE_SUMMARY, USER_REQUEST_REPORT,
        CLIENT_REQUEST_REPORT, USERS_LIST_FOR_CLIENT, USERS_OPEN_TICKETS } from "./../../constants/index"

export  function policyReport(state = [], action = {} )  {
    switch(action.type) {
        case GET_POLICY_REPORT: 
          return action.policyReport
        default: return state;
    }
}

export  function ticketSummary(state = [], action = {} )  {
    switch(action.type) {
        case TICKET_SUMMARY: 
          return action.ticketSummary
        default: return state;
    }
}

export  function serviceSummary(state = [], action = {} )  {
    switch(action.type) {
        case SERVICE_SUMMARY: 
          return action.serviceSummary
        default: return state;
    }
}

export  function userReport(state = [], action = {} )  {
    switch(action.type) {
        case USER_REQUEST_REPORT: 
          return action.userReport
        default: return state;
    }
}

export  function clientReport(state = [], action = {} )  {
    switch(action.type) {
        case CLIENT_REQUEST_REPORT: 
          return action.clientReport
        default: return state;
    }
}

export  function usersForClients(state = [], action = {} )  {
    switch(action.type) {
        case USERS_LIST_FOR_CLIENT: 
          return action.usersForClients
        default: return state;
    }
}

export  function userOpenTickets(state = [], action = {} )  {
    switch(action.type) {
        case USERS_OPEN_TICKETS: 
          return action.userOpenTickets
        default: return state;
    }
}