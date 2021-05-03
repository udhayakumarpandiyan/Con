

import { SET_USER_SELECTED_CLIENT } from "../../constants/index";

const DEFAULT_STATE = {
    current_client: {}
};

function current_client(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case SET_USER_SELECTED_CLIENT:
            return {
                payload: action.payload
            };
        default:
            return state;
    }
}

export default current_client;