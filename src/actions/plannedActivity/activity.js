import {
  SET_PLAN_ACTIVITY, SET_PLAN_ACTIVITY_STATE,
  SET_PLAN_ACTIVITY_STATUS, ADD_PLAN_ACTIVITY, ACTIVITY_DETAILS, COPY_PLAN_ACTIVITY,
  OBSOLETE_PLAN_ACTIVITY, SUBMIT_PLAN_ACTIVITY, APPROVAL_PLAN_ACTIVITY, SET_PLAN_ACTIVITY_DETAILS,
  SET_AUTOMATION_TEMPLATES
} from "../../constants/index";
import { paApiUrls, masterApiUrls } from "../../util/apiManager";
import { defaultHttp } from '../../api/Base';
import axios from "axios";

export function setActivity(activity) {
  return {
    type: SET_PLAN_ACTIVITY,
    activity
  }
}

export function filterActivity(filterData) {
  return dispatch =>
    fetch(paApiUrls.searchActivity, {
      method: 'post',
      body: JSON.stringify(filterData),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(data => dispatch(setActivity(data)));
}

export function setMasterData(masterData, masterCode) {
  switch (masterCode) {
    case "ST":
      return {
        type: SET_PLAN_ACTIVITY_STATE,
        activityState: masterData
      }
    case "SM":
      return {
        type: SET_PLAN_ACTIVITY_STATUS,
        activityStatus: masterData
      }
    default:
      return []
  }
}

export function masterData(masterCode, userId, apiToken) {
  return dispatch =>
    fetch(`${masterApiUrls.getMasterData}${masterCode}&userId=${userId}&apiToken=${apiToken}`)
      .then(res => res.json())
      .then(data => dispatch(setMasterData(data.data, masterCode)));
}

export function addActivity(newActivity) {
  return {
    type: ADD_PLAN_ACTIVITY,
    newActivity
  }
}

export function saveActivityMetaInformation(data) {
  return dispatch => {
    return fetch(paApiUrls.createPlannedActivity, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(data => dispatch(addActivity(data)));
  }
}

export function activityDetails(activityDetails) {
  return {
    type: ACTIVITY_DETAILS,
    activityDetails: activityDetails && Array.isArray(activityDetails.data) ? activityDetails.data[0] : {}
  }
}

export function getActivityDetails(data) {
  if (!data) {
    return activityDetails({});
  }
  let uri = paApiUrls.editPlannedActivity + data.activityId + "&clientId=" + data.clientId + "&featureId=" + data.featureId + "&actionBy=" + data.actionBy + "&apiToken=" + data.apiToken;
  return dispatch =>
    fetch(uri)
      .then(res => res.json())
      .then(data => dispatch(activityDetails(data)));
}

export function setCopyActivity(copyPlanActivity) {
  return {
    type: COPY_PLAN_ACTIVITY,
    copyPlanActivity
  }
}

export function copyActivity(data) {
  return dispatch => {
    return fetch(paApiUrls.copyActivity, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(data => dispatch(setCopyActivity(data)));
  }
}

export function setApprovalActivity(approvePlanActivity) {
  return {
    type: APPROVAL_PLAN_ACTIVITY,
    approvePlanActivity
  }
}

export function approvalActivity(data) {
  return dispatch => {
    return fetch(paApiUrls.approveActivity, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(data => dispatch(setApprovalActivity(data)));
  }
}

export function setObsoleteActivity(obsoletePlanActivity) {
  return {
    type: OBSOLETE_PLAN_ACTIVITY,
    obsoletePlanActivity
  }
}

export function obsoleteActivity(data) {
  return dispatch => {
    return fetch(paApiUrls.obsoleteActivity, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(data => dispatch(setObsoleteActivity(data)));
  }
}

export function setSubmitActivity(submitPlanActivity) {
  return {
    type: SUBMIT_PLAN_ACTIVITY,
    submitPlanActivity
  }
}

export function submitActivity(data) {
  return dispatch => {
    return fetch(paApiUrls.submitActivity, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(data => dispatch(setSubmitActivity(data)));
  }
}

export function setActivityDetails(saveActivityInfo) {
  return {
    type: SET_PLAN_ACTIVITY_DETAILS,
    saveActivityInfo
  }
}

export function saveActivityDetails(data) {
  return dispatch => {
    return fetch(`${paApiUrls.updatePlannedDetails}`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(data => dispatch(setActivityDetails(data)));
  }
}

export function deletePATask(data) {
  return dispatch => {
    return fetch(`${paApiUrls.deletePATask}`, {
      method: 'put',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(data => dispatch(setActivityDetails(data)));
  }
}

export function deletePARollback(data) {
  return dispatch => {
    return fetch(`${paApiUrls.deletePARollback}`, {
      method: 'put',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(data => dispatch(setActivityDetails(data)));
  }
}

export function initiateRollback(data) {
  return dispatch => {
    return fetch(`${paApiUrls.rollBackActivity}`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(data => dispatch(setActivityDetails(data)));
  }
}

export function unsuccessFullActivity(data) {
  return dispatch => {
    return fetch(`${paApiUrls.unsuccessFullActivity}`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(data => dispatch(setActivityDetails(data)));
  }
}
export function completeActivity(data) {
  return dispatch => {
    return fetch(`${paApiUrls.completeActivity}`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(data => dispatch(setActivityDetails(data)));
  }
}

export function updateTicket(data) {
  return dispatch => {
    return fetch(`${paApiUrls.updateTicket}`, {
      method: 'put',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(data => dispatch(setActivityDetails(data)));
  }
}

export function setAutomationTemplates(automationTemplates) {
  return {
    type: SET_AUTOMATION_TEMPLATES,
    automationTemplates
  }
}

export function getAutomationTemplates(data) {
  return dispatch => {
    return defaultHttp.get(`${paApiUrls.unified_job_templates}/?order_by=name&page=1&type=job_template,workflow_job_template`, {
      method: 'get',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(data => dispatch(setAutomationTemplates(data)));
  }
}

export function onLunchTemplate(url) {
  return defaultHttp.get(url);
}


export function updatePATask(data) {
  return axios.put(`${paApiUrls.updatePATask}`, data)
}

export function updatePARollBack(data) {
  return axios.put(`${paApiUrls.updatePARollBack}`, data)
}
