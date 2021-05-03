import axios from 'axios';
import { GET_SERVICENOW, UPDATE_SERVICENOW, CREATE_SERVICENOW } from '../../constants/index';
import { productConfigUrls } from '../../util/apiManager';

export function createServicenow(payload) {
    return dispatch =>
        axios.post(productConfigUrls.addServiceNowConfiguration, payload)
            .then(res => {
                dispatch({ type: CREATE_SERVICENOW, data: res.data });
                return res;
            });
}

export function updateServicenow(payload) {
    return dispatch =>
        axios.put(productConfigUrls.updateServiceNowConfiguration, payload)
            .then(res => {
                dispatch({ type: UPDATE_SERVICENOW, data: res.data });
                return res;
            })
}

export function getServicenow(query) {
    return dispatch =>
        axios.get(productConfigUrls.getServiceNowConfiguration + query)
            .then(res => {
                dispatch({ type: GET_SERVICENOW, data: res.data });
                return res;
            }).catch(err => {
                console.log(err);
            });
}