import { ACTIVE_USER_SESSIONS, SESSIONS_SELECTED_TAB } from "../../../constants/index";
import axios from "axios";
import { adminApiUrls } from "../../../util/apiManager";

export function setSelectedSessionTab(payload) {
    return (dispatch) => dispatch({
        type: SESSIONS_SELECTED_TAB,
        selectedTab: payload
    });
}

function activeSessions(activeSessions) {
    return {
        type: ACTIVE_USER_SESSIONS,
        activeSessions
    }
}

// "http://18.188.117.36:3000/api/admin/v2/getSessions"
export function getActiveSessions(payload) {
    return (dispatch) => {
        return axios.post(adminApiUrls.getSessions, payload)
            .then(res => {
                dispatch(activeSessions(res && res.data && res.data.data ? res.data.data : {}));
                return res.data;
            }).catch(err => {
                dispatch(activeSessions({}));
                return err;
            });
    };
}


export function approveSessionStep1(payload) {
    return () => {
        return axios.post(adminApiUrls.approveSessionStep1, payload)
            .then(res => {
                return res;
            }).catch(err => {
                return err;
            });
    }
}

export function approveSessionStep2(payload) {
    return () => {
        return axios.post(adminApiUrls.approveSessionStep2, payload)
            .then(res => {
                return res;
            }).catch(err => {
                return err;
            });
    }
}

export function declineSessionStep1(payload) {
    return () => {
        return axios.post(adminApiUrls.declineSessionStep1, payload)
            .then(res => res)
            .catch(err => err);
    }
}

export function declineSessionStep2(payload) {
    return () => {
        return axios.post(adminApiUrls.declineSessionStep2, payload)
            .then(res => {
                return res;
            }).catch(err => {
                return err;
            });
    }
}