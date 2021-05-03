import { TICKET_STATUS, AWS_SERVICE_CODE, AWS_CATEGORY_CODE } from "../../constants/index"


export default function masterData(state = [], action = {}) {
    switch (action.type) {
        case TICKET_STATUS:
            return action.ticketState

        default: return state;
    }
}

export function awsServiceCodes(state = [], action = {}) {
    switch (action.type) {
        case AWS_SERVICE_CODE:
            return action.serviceCodes
        default: return state;
    }
}

export function awsCategoryCodes(state = [], action = {}) {
    switch (action.type) {
        case AWS_CATEGORY_CODE:
            return action.categoryCodes
        default: return state;
    }
}

export function timeZonesBehalfOfUser(state = [], action = {}) {
    switch (action.type) {
        case 'GET_TIMEZONES':
            return action.data
        default: return state;
    }
}
