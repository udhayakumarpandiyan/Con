import { ALARM_NAME, LOG_GROUP_NAME, LOG_GROUP_TYPE } from "../../constants/index"
import { productConfigUrls } from "../../util/apiManager"
import axios from "axios";



export function getAlarmNames(payload) {
    if (!payload.alarmTypes || !payload.region) {
        return dispatch => Promise.resolve(dispatch(setAlarmNames({})));
    }
    return dispatch => {
        return axios.post(`${productConfigUrls.listCloudWatchAlarmNames}`, payload)
            .then(data => dispatch(setAlarmNames(data.data))
            ).catch(err => err)
    }
}

export function getLogGroupType(userId, apiToken) {
    return dispatch => {
        return axios.get(`${productConfigUrls.listLogGroupType}?userId=${userId}&apiToken=${apiToken}`)
            .then(data => dispatch(setLogGroupTypes(data.data))
            ).catch(err => err)
    }
}

export function logGroupsNames(payload) {
    return dispatch => {
        return axios.post(`${productConfigUrls.listClodWatchLogGroupsNames}`, payload)
            .then(data => dispatch(setLogGroupNames(data.data))
            ).catch(err => err)
    }
}

function setAlarmNames(alarmNames) {
    return {
        type: ALARM_NAME,
        alarmNames
    }
}

function setLogGroupTypes(logGroupsTypes) {
    return {
        type: LOG_GROUP_TYPE,
        logGroupsTypes
    }
}

function setLogGroupNames(logGroupsNames) {
    return {
        type: LOG_GROUP_NAME,
        logGroupsNames
    }
}
