
import axios from "axios";
import { userApiUrls } from "../util/apiManager";
import { SET_CURRENT_USER, SET_SAML_CURRENT_USER, PURGE_STATE } from "../constants/index";


export function login(data) {
    localStorage.removeItem("persist:root");
    return (dispatch) => {
        return axios.post(userApiUrls.userLogin, data)
            .then(async res => {
                if (res.data && res.data.status && res.data.status === 200) {
                    await dispatch(purgeState());
                    localStorage.setItem("userName", res.data.data.username);
                    localStorage.setItem("email", res.data.data.email);
                    localStorage.setItem("userId", res.data.data.userId);
                    localStorage.setItem("dedicatedResource", res.data.data.dedicatedResource);
                    localStorage.setItem("password", crypto.createHmac('sha256', data.password).digest('hex'));
                    localStorage.setItem("isLoginFirst", true);
                    localStorage.setItem("isApplicationLogin", true);
                    const payload = { userId: res.data.data.userId, email: res.data.data.email, role: res.data.data.userRole, userType: res.data.data.userType, userName: res.data.data.username };
                    dispatch(setCurrentUser(payload));
                }
                return res;
            });
    }
}

export function logout() {
    return (dispatch) => {
        localStorage.removeItem("persist:root");
        dispatch(purgeState());
        localStorage.clear();
        delete_cookie('UserName');
        delete_cookie('UserGmail');
        delete_cookie('UserId');
        dispatch(setSelectedClientInState({}));
    }
}

function delete_cookie(key) {
    document.cookie = key + '=; path=/; domain=.concierto.in; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function getUserInfo(id) {
    // TODO: For SAML get user password
    let userId = localStorage.getItem('userId') || id;
    return axios.get(`${userApiUrls.userInfo}?userId=${userId}`)
        .then(res => {
            return (res.data && res.data.data && res.data.data.length && res.data.data[0].password) ? res.data.data[0].password : "";
        }).catch((error) => {
            const message = typeof error.message === "string" ? error.message : "Something went wrong!";
            return message;
        });
}

export function setCurrentUser(current_user) {
    return {
        type: SET_CURRENT_USER,
        payload: current_user
    };
}
export function setSamlCurrentUser(current_user) {
    return {
        type: SET_SAML_CURRENT_USER,
        payload: current_user
    }
}

export function purgeState() {
    return {
        type: PURGE_STATE
    }
}

export function setSelectedClientInState(client) {
    return {
        type: SET_USER_SELECTED_CLIENT,
        payload: { "client": client }
    }
}