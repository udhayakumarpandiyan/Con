import { createStore, applyMiddleware, compose } from "redux";
import cookie from 'js-cookie';
import thunkMiddleware from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import logger from "redux-logger";
import { setCurrentUser, getUserInfo } from "../../src/actions/auth";
import axios from "axios";
import { userApiUrls } from "../util/apiManager";

import combineReducers from "../rootReducer";
// redux state persist
const PURGE_STATE = "PURGE_STATE";

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
};

const rootReducer = (state, action) => {
  if (action.type === PURGE_STATE) {
    Object.keys(state).forEach((key) => {
      storage.removeItem(`persist:root`);
    });
    state = undefined;
  }
  return combineReducers(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancers(applyMiddleware(thunkMiddleware, logger));

var store = createStore(persistedReducer, undefined, enhancer);
var persistor = persistStore(store);

var cookie_obj = Object.assign({ headers: { 'Cookie': [cookie.get('UserName'), cookie.get('UserGmail')] } });


if (cookie_obj["headers"]["Cookie"][0] !== undefined && !localStorage.getItem("isSAML") && !localStorage.getItem("isSAMLAccess")) {
  checkSamlAuth();
}
function checkSamlAuth() {
  // getSamlDetails();
}

function getSamlDetails() {
  let postData = {
    officialEmail: [cookie_obj["headers"]["Cookie"][1]]
  };
  axios.post(`${userApiUrls.samlDetails}`, postData).then(async res => {
    if (cookie_obj["headers"]["Cookie"][0] !== undefined && res.data && res.data.data && res.data.data[0]) {
      const { userName, officialEmail, userId, userType, userRole } = res.data.data[0];
      localStorage.setItem("userName", userName);
      localStorage.setItem("email", officialEmail);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userType", userType);
      localStorage.setItem("isApplicationLogin", true);
      localStorage.setItem("isSAML", true);
      let pass = await getUserInfo(userId);
      localStorage.setItem("password", pass);
      const payload = { userId: userId, email: officialEmail, role: userRole, userType: userType, userName: userName };
      await store.dispatch(setCurrentUser(payload));
    }
  }).catch((err) => {
    return err;
  });
}

export default store;
export { persistor };
