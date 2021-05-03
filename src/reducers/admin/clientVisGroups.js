import { ADD_CLIENT_VIS_GORUPS, SET_CLIENT_VIS_GROUPS, SET_ALL_CLIENT_VIS_GROUPS, GROUPS_MAPPED_TO_CLIENT, GET_USERS_MAPPED_TO_CLIENT } from "../../constants/index";

export function clientVisGroups(state = [], action = {}) {

    switch (action.type) {

        case ADD_CLIENT_VIS_GORUPS:
            return action.clientVisGroups

        case SET_CLIENT_VIS_GROUPS:
            return action.clientVisGroups

        default:
            return state;
    }

}

export function allClientVisGroups(state = [], action = {}) {
    switch (action.type) {
        case SET_ALL_CLIENT_VIS_GROUPS:
            return action.allClientVisGroups
        default:
            return state;
    }

}

export function groupsMappedToClient(state = [], action) {
    switch (action.type) {
        case GROUPS_MAPPED_TO_CLIENT:
            return action.payload;
        default:
            return state;
    }
}
export function getSelectedClientUsers(state = [], action) {
    switch (action.type) {
        case GET_USERS_MAPPED_TO_CLIENT:
            return action.payload;
        default:
            return state;
    }
}

