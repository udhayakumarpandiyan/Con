
import { MASTER_DATA, GROUP_HELP_TOPICS, GET_TOKEN, CLIENT_USERS, SET_TOKEN_EXPIRED_TIME, SET_CLIENT_LOGO } from "../constants/index";

export function getAllMasterData(state = [], action = {}) {
    switch (action.type) {
        case MASTER_DATA:
            return action.masterData
        default: return state;
    }
}

export function groupHelpTopics(state = [], action = {}) {
    switch (action.type) {
        case GROUP_HELP_TOPICS:
            return action.groupHelpTopics
        default: return state;
    }
}

export function generateToken(state = [], action = {}) {
    switch (action.type) {
        case GET_TOKEN:
            return action.generateToken
        default: return state;
    }
}

export function clientUsers(state = [], action = {}) {
    switch (action.type) {
        case CLIENT_USERS:
            return action.clientUsers
        default: return state;
    }
}

export function tokenExpiredTime(state = "", action) {
    switch (action.type) {
        case SET_TOKEN_EXPIRED_TIME:
            return action.endTime
        default: return state;
    }
}


export function getClientLogos(state = {}, action) {
    switch (action.type) {
        case SET_CLIENT_LOGO:
            return action.payload
        default: return state;
    }
}