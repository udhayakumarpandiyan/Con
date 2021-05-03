import { GET_CLIENT_NAME } from "./../../constants/index";

export default function groups(state = [], action = {}) {
    switch (action.type) {
        case GET_CLIENT_NAME:
            return action.requestClientName
        default:
            return state;
    }
}