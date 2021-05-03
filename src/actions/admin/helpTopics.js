import {
    SET_HELPTOPICS,
    ADD_HELPTOPIC,
    HELPTOPIC_UPDATED,
    HEPTOPIC_FETCHED,
    HELPTOPIC_DELETED,
    ADD_CLIENT_GORUP_HELP_TOPICIS,
    SET_GROUP_HELP_TOPICS
} from "../../constants/index";
import { adminApiUrls } from "../../util/apiManager";

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

function handleQuery(query) {
    let params = { "userId": localStorage.getItem("userId"), ...query };
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString;
}


export function setHelpTopics(helpTopics) {
    return {
        type: SET_HELPTOPICS,
        helpTopics

    }
}

export function addHelpTopic(helpTopic) {
    return {
        type: ADD_HELPTOPIC,
        helpTopic
    }
}

export function helpTopicUpdated(helpTopic) {
    return {
        type: HELPTOPIC_UPDATED,
        helpTopic
    }
}

export function helpTopicFetched(helpTopic) {
    return {
        type: HEPTOPIC_FETCHED,
        helpTopic
    }
}

export function addGroupHelpTopics(clientGroupHelpTopics) {
    return {
        type: ADD_CLIENT_GORUP_HELP_TOPICIS,
        clientGroupHelpTopics
    }
}


export function helpTopicDeleted(helpTopicId) {
    return {
        type: HELPTOPIC_DELETED,
        _id: helpTopicId
    }
}
export function setGroupHelpTopics(clientGroupHelpTopics) {
    return {
        type: SET_GROUP_HELP_TOPICS,
        clientGroupHelpTopics
    }
}

export function fetchHelpTopics(query, activeStatus) {
    let status = "";
    if (activeStatus) {
        status = `&status=${activeStatus}`;
    }
    const queryString = handleQuery(query);
    return dispatch => {
        return axios.get(`${adminApiUrls.getHelpTopics_v2}?${queryString}&${status}`)
            .then(res => {
                dispatch(setHelpTopics(res.data && res.data.data ? res.data.data : []));
                return res;
            });
    }
}

export function saveHelpTopic(data, query) {
    const queryString = handleQuery(query);
    return dispatch => {
        return fetch(`${adminApiUrls.getHelpTopics_v2}?${queryString}`, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(addHelpTopic(data));
                return data;
            });
    }
}

export function fetchHelpTopic(id, query) {
    const queryString = handleQuery(query);
    return dispatch => {
        return axios.get(`${adminApiUrls.getHelpTopics_v2}/${id}?${queryString}`)
            .then(res => {
                dispatch(helpTopicFetched(res.data && res.data.data ? res.data.data : []));
                return res;
            }).catch(err => err)
    }
}


export function updateHelpTopic(data, query) {
    const queryString = handleQuery(query);
    const id = data._id;
    delete data._id;
    return dispatch => {
        return fetch(`${adminApiUrls.getHelpTopics_v2}/${id}?${queryString}`, {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(helpTopicUpdated(data));
                return data;
            });
    }
}

export function deleteHelpTopic(id, query) {
    const queryString = handleQuery(query);
    return dispatch => {
        return axios.delete(`${adminApiUrls.getHelpTopics_v2}/${id}?${queryString}`, { status: "deleted" }, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            dispatch(helpTopicDeleted(id));
            return res;
        }).catch(err => err);
    }
}

export function saveGroupHelpTopics(data, query) {
    const queryString = handleQuery(query);
    return dispatch => {
        return fetch(`${adminApiUrls.getGroupList_v2}/${data.groupId}/createHelpTopic?${queryString}`, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(addGroupHelpTopics(data)));
    }
}

// it will give helptopics for the selected group;
export function fetchGroupHelpTopics(groupId, query) {
    let queryString = handleQuery(query);
    return dispatch => {
        return fetch(`${adminApiUrls.getGroupList_v2}/${groupId}/helpTopics?${queryString}`)
            .then(res => res.json())
            .then(data => dispatch(setGroupHelpTopics(data && Array.isArray(data.data) ? data.data : [])));
    }
}
