
import { SET_FEATURE, ADD_FEATURE, FEATURE_UPDATED, FEATURE_FETCHED, FEATURE_DELETED } from "../../constants/index"

import { adminApiUrls } from "../../util/apiManager"
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
    const params = { "userId": localStorage.getItem("userId"), ...query };
    return Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

export function setFeatures(features) {
    return {
        type: SET_FEATURE,
        features
    }
}

export function addFeature(feature) {
    return {
        type: ADD_FEATURE,
        feature
    }
}

export function featureUpdated(feature) {
    return {
        type: FEATURE_UPDATED,
        feature
    }
}

export function featureFetched(feature) {
    return {
        type: FEATURE_FETCHED,
        feature
    }
}

export function featureDeleted(featureId) {
    return {
        type: FEATURE_DELETED,
        _id: featureId
    }
}

export function fetchFeatures(query) {
    var queryString = handleQuery(query);
    return dispatch => {
        return axios.get(`${adminApiUrls.getFeatures_v2}?${queryString}`)
            .then(res => {
                dispatch(setFeatures(res.data && res.data.data ? res.data.data : []));
                return res;
            }).catch(err => err);
    }
}


export function saveFeature(data, query) {
    var queryString = handleQuery(query);
    return dispatch =>
        fetch(`${adminApiUrls.getFeatures_v2}?${queryString}`, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(addFeature(data));
                return data;
            });
}

export function fetchFeature(id, query) {
    var queryString = handleQuery(query);
    return dispatch =>
        fetch(`${adminApiUrls.getFeatures_v2}/${id}?${queryString}`)
            .then(res => res.json())
            .then(data => {
                dispatch(featureFetched(data.data));
                return data;
            });
}


export function updateFeature(data, query) {
    var queryString = handleQuery(query);
    const id = data._id;
    delete data._id;
    return dispatch => {
        return fetch(`${adminApiUrls.getFeatures_v2}/${id}?${queryString}`, {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(featureUpdated(data));
                return data;
            });
    }
}


export function deleteFeature(id, query) {
    var queryString = handleQuery(query);
    return dispatch => {
        return axios.delete(`${adminApiUrls.getFeatures_v2}/${id}?${queryString}`, { status: "deleted" }, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(data => {
            dispatch(featureDeleted(id));
            return data;
        });
    }
}


