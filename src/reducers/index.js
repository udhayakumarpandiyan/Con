import { combineReducers } from "redux";
import { getClientLogos, tokenExpiredTime, clientUsers, generateToken, groupHelpTopics, getAllMasterData } from "./commonActions";
import { getPlannedActivity, activityState, activityStatus, saveActivityInfo } from "./PA";

const reducers = {
    getClientLogos,
    tokenExpiredTime,
    clientUsers,
    generateToken,
    groupHelpTopics,
    getAllMasterData,
    getPlannedActivity,
    activityState,
    activityStatus,
    saveActivityInfo
};

export default combineReducers(reducers);
