
import { SET_USER_CLIENT_TICKETS } from "../../constants/index"
import { healthBoardUrls } from "../../util/apiManager"

function handleResponse(response) {
    if (response.statusText === "OK") {
        return response.json();
    } else {
        let err = new Error(response.statusText);
        err.response = response;
        throw err;
    }
}

function handleQuery(token) {
    let params = { "userId": localStorage.getItem("userId"), "apiToken": token };
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString
}

export function setUserClientTickets(userClientTickets) {
    return {
        type: SET_USER_CLIENT_TICKETS,
        userClientTickets
    }
}

export function fetchUserClientTickets(allClients, userId, token = "", internalCall) {
    let dedicatedResource = localStorage.getItem("dedicatedResource");
    (dedicatedResource == "false") ? dedicatedResource = false : dedicatedResource = true;
    let postData = {
        "clientIds": allClients,
        "userId": localStorage.getItem("userId"),
        "assignedTo": localStorage.getItem("userId") || userId,
        "apiToken": token
    };
    let internalCallStr = "";
    if (internalCall) {
        internalCallStr = `&internalCall=${internalCall}`;
    }
    return dispatch => {
        return fetch(`${healthBoardUrls.getHealthBoard}`, {
            method: 'post',
            body: JSON.stringify(postData),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json()
            .then(data => dispatch(setUserClientTickets(data))))
    }
}
