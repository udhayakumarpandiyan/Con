import { ALARM_NAME, LOG_GROUP_TYPE, LOG_GROUP_NAME } from "../../constants/index";



export function getAlarmNames(state = [], action = {}) {
    switch (action.type) {
        case ALARM_NAME:
            return action.alarmNames;
        default:
            return state;
    }

}

export function getLogGroupTypes(state = [], action = {}) {
    switch (action.type) {
        case LOG_GROUP_TYPE:
            return action.logGroupsTypes;
        default:
            return state;
    }

}

export function getLogGroupsNames(state = [], action = {}) {
    switch (action.type) {
        case LOG_GROUP_NAME:
            return action.logGroupsNames;
        default:
            return state;
    }

}