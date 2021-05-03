import { GET_SERVICENOW, UPDATE_SERVICENOW, CREATE_SERVICENOW } from '../../constants/index';

export function getServicenowObj(state = [], action = {}) {
    switch (action.type) {
        case GET_SERVICENOW:
            return action.data;
        default:
            return state;
    }
}
