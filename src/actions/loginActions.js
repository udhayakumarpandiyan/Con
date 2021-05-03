import axios from "axios";
import { loginApi } from "../util/apiManager";

export const login = function (req) {
  return axios
    .post(loginApi.login, req, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return { data: res.data, status: res.status };
    })
    .catch((err) => err);
};

export const signup = function (req) {
  return axios
    .post(loginApi.signup, req, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return { data: res.data, status: res.status };
    })
    .catch((err) => err);
};

export const confirmCode = function (req) {
  return axios
    .post(loginApi.confirmRegistration, req, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return { data: res.data, status: res.status };
    })
    .catch((err) => err);
};
