import { SET_ACTIONBAR_CLIENT, FETCH_ACTIONBAR_CLIENT }  from "../constants/index";

export function setActionBarClient(actionClientId){
    return {
        type: SET_ACTIONBAR_CLIENT,
        actionClientId
    }
}

export const setClientId = (actionClientId) => {

    return (dispatch) => {

        let cId = actionClientId;

        dispatch(setActionBarClient(cId));
    }
}

