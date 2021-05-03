
import { TICKET_SETTINGS, GET_LOGS, EMAIL_TEMPLATES, SYSTEM_LOG_LEVEL, MAX_LOGINS, TIME_ZONES, 
    EDIT_TICKET_SETTINGS, GET_BAN_LIST, GET_TEMPLATES, GET_EMAIL_LIST, GET_EMAIL_DETAILS, DELETE_EMAIL,
    UPDATE_EMAIL, ADD_NEW_EMAIL, DELETE_EMAIL_BANLIST, DELETE_TEMPLATE, GET_PROTOCOL } from "./../../constants/index";

export function ticketSettings(state = [], action = {} )  {

    switch(action.type) {
        case TICKET_SETTINGS: 
        	return action.ticketSettings
        default: return state;
    }
}

export function getLogs(state = [], action = {} ){
    switch(action.type) {
        case GET_LOGS: 
        	return action.getLogs
        default: return state;
    }
}

export function systemLogs(state = [], action = {} ){
    switch(action.type) {
        case SYSTEM_LOG_LEVEL: 
        	return action.systemLogs
        default: return state;
    }
}

export function emailTemplates(state = [], action = {} ){
    switch(action.type) {
        case EMAIL_TEMPLATES: 
        	return action.emailTemplates
        default: return state;
    }
}

export function maxLogins(state = [], action = {} ){
    switch(action.type) {
        case MAX_LOGINS: 
        	return action.maxLogins
        default: return state;
    }
}

export function timeZones(state = [], action = {} ){
    switch(action.type) {
        case TIME_ZONES:
        	return action.timeZones
        default: return state;
    }
}

export function editTicketSettings(state = [], action = {} ){
    switch(action.type) {
        case EDIT_TICKET_SETTINGS: 
        	return action.editTicketSettings
        default: return state;
    }
}

export function banList(state = [], action = {} ){
    switch(action.type) {
        case GET_BAN_LIST: 
        	return action.banList
        default: return state;
    }
}

export function templateList(state = [], action = {} ){
    switch(action.type) {
        case GET_TEMPLATES: 
        	return action.templateList
        default: return state;
    }
}

export function emailList(state = [], action = {} ){
    switch(action.type) {
        case GET_EMAIL_LIST: 
        	return action.emailList
        default: return state;
    }
}

export function emailDetails(state = [], action = {} ){
    switch(action.type) {
        case GET_EMAIL_DETAILS: 
        	return action.emailDetails
        default: return state;
    }
}

export function deletedEmail(state = [], action = {} ){
    switch(action.type) {
        case DELETE_EMAIL: 
        	return action.deletedEmail
        default: return state;
    }
}

export function updatedEmail(state = [], action = {} ){
    switch(action.type) {
        case UPDATE_EMAIL: 
        	return action.updatedEmail
        default: return state;
    }
}

export function newEmail(state = [], action = {} ){
    switch(action.type) {
        case ADD_NEW_EMAIL: 
        	return action.newEmail
        default: return state;
    }
}

export function deletedBanEmail(state = [], action = {} ){
    switch(action.type) {
        case DELETE_EMAIL_BANLIST: 
        	return action.deletedBanEmail
        default: return state;
    }
}

export function deletedTemplate(state = [], action = {} ){
    switch(action.type) {
        case DELETE_TEMPLATE: 
        	return action.deletedTemplate
        default: return state;
    }
}

export function protoList(state = [], action = {} ){
    switch(action.type) {
        case GET_PROTOCOL: 
        	return action.protoList
        default: return state;
    }
}