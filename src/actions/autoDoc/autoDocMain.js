import { AUTODOCHOST_LIST, AUTODOCCURRENT_DELTA, AUTODELTA_LIST, MANUAL_SCRIPT_RUN } from "../../constants/index"

import { autoDocUrls } from "./../../util/apiManager";
import axios from "axios";


export function fetchAutoDocHostList(clientId, isMaintained, userId, apiToken) {
    var param = { clientId, isMaintained, userId, apiToken };
    return dispatch => {
        return axios.post(autoDocUrls.findAutoDocHostList, param, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(data => {
            dispatch(getAutoDocHostList(data.data.data && data.data.data.hostList && data.data.data.hostList || []));
            return data.data;
        });
    }
}

export function getAutoDocHostList(autoDocHostList) {

    return {
        type: AUTODOCHOST_LIST,
        autoDocHostList
    }
}


export function fetchDownloadCurrentDelta(clientId, hostId, userId, apiToken) {
    return dispatch =>
        axios.get(autoDocUrls.downloadCurrentDelta + `?clientId=` + clientId + `&hostId=` + hostId + `&userId=` + userId + `&apiToken=` + apiToken)
            .then(data => dispatch(getDownloadCurrentDelta(data && data.data || [])));
}



export function getDownloadCurrentDelta(autoDocCurrentDelta) {
    return {
        type: AUTODOCCURRENT_DELTA,
        autoDocCurrentDelta
    }
}


export function fetchHistoricalDetails(id, clientId, fromDate, toDate, skip, limit, userId, apiToken) {
    if (!id) {
        return dispatch => dispatch(getHistoricalDetails([]));
    }
    var param = {
        "clientId": clientId,
        "hostId": id,
        "fromDate": fromDate,
        "toDate": toDate,
        "skip": skip || 0,
        "limit": limit || 20,
        userId,
        apiToken
    }
    return dispatch => {
        return axios.post(autoDocUrls.findDeltaHistory, JSON.stringify(param), {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(data => {
            dispatch(getHistoricalDetails(data && data.data || []));
            return data && data.data;
        });
    }
}

export function getHistoricalDetails(autoDeltaList) {
    return {
        type: AUTODELTA_LIST,
        autoDeltaList
    }
}

export function manualScriptRun(req) {
    return dispatch => axios.post(autoDocUrls.runScriptManual, JSON.stringify(req), {
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(data => dispatch(scriptRunner(data)))
        .catch(err => dispatch(scriptRunner({ status: 200, message: err.message })))
}

export function scriptRunner(action) {
    return {
        type: MANUAL_SCRIPT_RUN,
        action
    }
}
