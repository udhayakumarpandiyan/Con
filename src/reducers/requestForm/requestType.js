import { GET_REQUEST_TYPE } from "./../../constants/index"

export default function groups(state = [], action = {}) {
    switch (action.type) {
        case GET_REQUEST_TYPE:
            return action.requestType
        default: return state;
    }
}