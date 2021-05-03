import axios from "axios";
import { ticketApiUrls } from "../util/apiManager.jsx";
import { ESCALATED_TICKETS } from "../constants/index";

export function EscalateTickets(params) {
    return (dispatch) =>
        axios.post(ticketApiUrls.escalationDashboard, params)
            .then((res) => {
                return dispatch({ type: ESCALATED_TICKETS, data: res.data });
            }).catch((err) => {
                return dispatch({ type: ESCALATED_TICKETS, data: err });
            });
}