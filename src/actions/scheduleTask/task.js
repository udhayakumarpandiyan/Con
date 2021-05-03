import {
    SET_SCHEDULE_TASK, ADD_SCHEDULE_TASK, UPDATE_SCHEDULE_TASK,
    SET_SCHEDULETASK_CLIENTS,
    BULK_UPLOAD_SCHEDULE_TASK
} from "../../constants/index"
import { scheduleTaskApiUrls, clientApiUrls } from "./../../util/apiManager"

export function setClients(scheduleTaskClients) {
    scheduleTaskClients = scheduleTaskClients.data;
    return {
        type: SET_SCHEDULETASK_CLIENTS,
        scheduleTaskClients
    }
}

export function clientList(userId, clientId, featureId, apiToken) {
    return dispatch => {
        fetch(clientApiUrls.getClientListLinkedToUser + userId + "&userId=" + userId + "&clientId=" + clientId + "&featureId=" + featureId + "&apiToken=" + apiToken)
            .then(res => res.json())
            .then(data => dispatch(setClients(data)));
    }
}

export function setTask(tasks) {
    return {
        type: SET_SCHEDULE_TASK,
        tasks
    }
}

export function filterTasks(filterData) {
    return dispatch => {
        return fetch(scheduleTaskApiUrls.scheduleTaskSearch, {
            method: 'post',
            body: JSON.stringify(filterData),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(setTask(data)));
    }
}

export function addTask(newScheduleTask) {
    return {
        type: ADD_SCHEDULE_TASK,
        newScheduleTask
    }
}

export function saveTaskMetaData(data) {
    return dispatch => {
        return fetch(scheduleTaskApiUrls.createST, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(addTask(data)));
    }
}

export function updatedTask(updateScheduledTask) {
    return {
        type: UPDATE_SCHEDULE_TASK,
        updateScheduledTask
    }
}

export function updateTask(data) {
    return dispatch => {
        return fetch(scheduleTaskApiUrls.updateST, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(updatedTask(data)));
    }
}

export function bulkUpload(reqBody, headers) {
    return dispatch => {
        return fetch(scheduleTaskApiUrls.bulkUpload, {
            method: 'post',
            body: reqBody,
            headers
        }).then(res => res.json())
            .then(data => dispatch(buikUploadTickets(data)));
    }
}

export function buikUploadTickets(buikUploadTickets) {
    return {
        type: BULK_UPLOAD_SCHEDULE_TASK,
        buikUploadTickets
    }
}
