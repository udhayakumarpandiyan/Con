import { MONITORING_LIST, MONITORING_DETAILS, MASTER_CLIENT } from "../../constants/index";
import { monitoringApiUrls } from "../../util/apiManager";
import { clientApiUrls } from "../../util/apiManager";
export function getMonitoring(monitoring) {
    return {
        type: MONITORING_LIST,
        monitoring
    }
}

export function fetchMonitoring(userId, masterClientId, featureId, apiToken) {
    return dispatch => {
        return fetch(monitoringApiUrls.fetchMonitoring + `userId=` + userId + `&clientId=` + masterClientId + `&featureId=` + featureId + '&apiToken=' + apiToken)
            .then(res => res.json())
            .then(data => {
                dispatch(getMonitoring(data.data));
                return data;
            });
    }
}

export function getDetails(monitoringDetails) {
    return {
        type: MONITORING_DETAILS,
        monitoringDetails
    }
}

export function getMasterClient(masterClient) {
    return {
        type: MASTER_CLIENT,
        masterClient
    }
}

export function getClientMasterClient() {
    return dispatch => {
        return fetch(clientApiUrls.getMasterClient)
            .then(res => res.json())
            .then(data => dispatch(getMasterClient(data.data)));
    }
}

export function fetchMonitoringDetails(partnerName, userId, clientId, featureId, apiToken) {
    if (!partnerName) {
        return dispatch => dispatch(getDetails({}));
    }
    let uri = monitoringApiUrls.getMonitoringDetails + `userId=` + userId + `&partnerName=` + partnerName + `&clientId=` + clientId + `&featureId=` + featureId + '&apiToken=' + apiToken;
    return dispatch => {
        return fetch(uri)
            .then(res => res.json())
            .then(data => {
                dispatch(getDetails(data.data));
                return data;
            });
    }
}
