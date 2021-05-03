import {
    SET_PROJECT, ADD_PROJECT, PROJECT_UPDATED, PROJECT_FETCHED, PROJECT_DELETED, PROJECT_TYPES,
    PROJECT_CLIENTS, UPLOAD_SUCCESS, UPLOAD_FAIL, EDIT_PROJECT_DATA, GET_TIMESHEET_DATA,
    VIEW_PROJECT_DETAILS, DELETE_PROJECT_DETAILS, VIEW_SANDBOX_LIST, DELETE_SANDBOX_ACCOUNT,
    ADD_ALREADY_HAVE_SANDBOX_ACCOUNT, EDIT_SANDBOX_ACCOUNT_DETAILS, EDIT_PROJECT_DETAILS,
    ADD_SANDBOX_ACCOUNT_WITH_APPROVAL, ADD_SANDBOX_APPROVER, REMOVE_SANDBOX_APPROVER, SEND_REMINDER_FOR_APPROVAL, REMOVE_SANDBOX_USER, ADD_SANDBOX_USER, ADD_AWS_INFO, ADD_AZURE_INFO, GET_PROJECT_LIST, GET_SANDBOX_LIST, SANDBOX_ON_DEMAND_TOKENS, ON_DEMAND_SB_SET_INTERVAL_IDS, AUTO_APPROVER_FOR_HOST
} from "../constants/index"
import { projectApiUrls, clientApiUrls, masterApiUrls } from "../util/apiManager"

import axios from "axios";
import { func } from "prop-types";

function handleResponse(response) {
    if (response.statusText === "OK") {
        return response.json();
    } else {
        let err = new Error(response.statusText);
        err.response = response;
        throw err;
    }
}

export function setProject(projects) {
    return {
        type: SET_PROJECT,
        projects
    }
}

export function addProject(project) {
    return {
        type: ADD_PROJECT,
        project
    }
}

export function projectUpdated(project) {
    return {
        type: PROJECT_UPDATED,
        project
    }
}

export function projectFetched(projectDetails) {
    return {
        type: PROJECT_FETCHED,
        projectDetails
    }
}

export function projectTypes(projectTypes) {
    return {
        type: PROJECT_TYPES,
        projectTypes
    }
}

export function getClientsOnUser(projectClients) {
    return {
        type: PROJECT_CLIENTS,
        projectClients
    }
}

export function uploadSuccess({ upload }) {
    return {
        type: UPLOAD_SUCCESS,
        upload
    };
}

export function uploadFail(error) {
    return {
        type: UPLOAD_FAIL,
        error
    };
}

export function fetchProjects(userId, clientId, featureId, clientIdFilter, apiToken) {
    let data = {
        actionBy: userId,
        clientId: clientId,
        featureId: featureId,
        clientIdFilter: clientIdFilter,
        apiToken: apiToken
    }
    return dispatch =>
        fetch(projectApiUrls.getProjects, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(setProject(data.data));
                return data;
            });
}


export function saveProject(data) {
    return dispatch => {
        return fetch(projectApiUrls.createProject, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(addProject(data)));
    }
}

export function fetchProject(id, userId, clientId, featureId, apiToken) {
    if (!id) {
        return dispatch => Promise.resolve(dispatch(projectFetched({})));
    }
    let uri = projectApiUrls.getProjectDetails + id + "&actionBy=" + userId + "&clientId=" + clientId + "&featureId=" + featureId + "&apiToken=" + apiToken;
    return dispatch => {
        fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(projectFetched((data.data && data.data.length > 0) ? data.data[0] : {})));
    }
}

export function fetchProjectTypes(userId, apiToken) {
    return dispatch => {
        let uri = `${masterApiUrls.getMasterData}PT&userId=${userId}&apiToken=${apiToken}`;
        return fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(projectTypes((data.data && data.data.length > 0) ? data.data : [])));
    }
}

export function fetchClients(userId, clientId, featureId, apiToken) {
    let uri = clientApiUrls.getClientListLinkedToUser + userId + "&userId=" + userId + "&clientId=" + clientId + "&featureId=" + featureId + "&apiToken=" + apiToken;
    return dispatch => {
        return fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(getClientsOnUser(data.data)))
            .catch(error => dispatch(handleResponse(error)));
    }
}

export function uploadDoc({ file, name, userId, apiToken }) {
    let data = new FormData();
    data.append('file', document);
    data.append('name', name);
    data.append('userId', userId);
    data.append('apiToken', apiToken);
    return (dispatch) => {
        fetch(masterApiUrls.uploadFile, {
            method: 'post',
            body: data
        })
            .then(response => dispatch(uploadSuccess(response)))
            .catch(error => dispatch(uploadFail(error)));
    };
}

export function updateProject(data) {
    return dispatch => {
        return fetch(projectApiUrls.updateProject, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(projectUpdated(data)));
    }
}

export function editProject(editProjectDetails) {
    return {
        type: EDIT_PROJECT_DATA,
        editProjectDetails
    }
}

export function editProjectData(userId, clientId, projectId, featureId, apiToken) {
    return dispatch => {
        let uri = projectApiUrls.editProjectData + projectId + "&actionBy=" + userId + "&clientId=" + clientId + "&featureId=" + featureId + "&apiToken=" + apiToken;
        return fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(editProject(data)));
    }
}

export function timeSheetData(timeSheetData) {
    return {
        type: GET_TIMESHEET_DATA,
        timeSheetData
    }
}

export function getTimeSheet(userId, clientId, projectId, featureId, apiToken) {
    return dispatch => {
        let uri = projectApiUrls.getTimeSheetData + projectId + "&actionBy=" + userId + "&clientId=" + clientId + "&featureId=" + featureId + "&apiToken=" + apiToken;
        return fetch(uri)
            .then(res => res.json())
            .then(data => dispatch(timeSheetData(data)));
    }
}

// NEW PROJECT TO MAP DEVICES/CREATING SANDBOXES

// viewProjectDetails apis;


export function viewProjectDetails(projectId, userId, apiToken) {
    if (!projectId) {
        return dispatch => Promise.resolve(dispatch(setViewProjectDetails({})));
    }
    return dispatch => {
        return axios.get(`${projectApiUrls.viewProjectById}${projectId}?userId=${userId}&apiToken=${apiToken}`)
            .then(res => {
                return dispatch(setViewProjectDetails(res.data));
            }).catch(err => err);
    }
}

function setViewProjectDetails(viewProjectDetails) {
    return {
        type: VIEW_PROJECT_DETAILS,
        viewProjectDetails
    }
}

export function deleteProjectDetails(postData) {
    return dispatch => {
        return axios.post(`${projectApiUrls.deleteProject}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => dispatch({ type: DELETE_PROJECT_DETAILS, data: res.data }))
            .catch(err => err);
    }
}

export function viewSandBoxAccountList(project) {
    if (!project) {
        return (dispatch) => Promise.resolve(dispatch(setViewSandBoxDetails({})));
    }
    const uri = `${projectApiUrls.viewSandBoxAccountList}projectId=${project.projectId}&clientId=${project.clientId}&featureId=${project.featureId}&apiToken=${project.apiToken}&userId=${project.userId}`;
    return dispatch => {
        return axios.get(`${uri}`)
            .then(res => dispatch(setViewSandBoxDetails(res.data)))
            .catch(err => err);
    }
}

function setViewSandBoxDetails(viewSandBoxList) {
    return {
        type: VIEW_SANDBOX_LIST,
        viewSandBoxList
    }
}

export function deleteSandboxAccount(sandbox) {
    return dispatch => {
        return axios.post(projectApiUrls.deleteSandboxAccount, sandbox)
            .then(res => dispatch({ type: DELETE_SANDBOX_ACCOUNT, data: res.data }))
            .catch(err => err);
    }
}

/* adding sandbox account */
export function addAlreadyHaveAccount(postData) {
    return dispatch => {
        return axios.post(`${projectApiUrls.addSandboxWithoutApproval}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: ADD_ALREADY_HAVE_SANDBOX_ACCOUNT, data: res.data }))
            .catch(err => err);
    }
}
/* adding sandbox account with approval flow */
export function addSandboxWithApprovalFlow(postData) {
    return dispatch => {
        return axios.post(`${projectApiUrls.addSandboxWithApproval}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: ADD_SANDBOX_ACCOUNT_WITH_APPROVAL, data: res.data }))
            .catch(err => err);
    }
}



// edit the sandbox details;

export function editSandboxAccount(postData) {
    return dispatch => {
        return axios.post(`${projectApiUrls.editSandboxAccount}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: EDIT_SANDBOX_ACCOUNT_DETAILS, data: res.data }))
            .catch(err => err);
    }
}

export function editSandboxProject(postData) {
    return dispatch => {
        return axios.post(`${projectApiUrls.editSandboxProject}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: EDIT_PROJECT_DETAILS, data: res.data }))
            .catch(err => err);
    }
}

// add approvers

export function addApprover(postData) {
    return dispatch => {
        return axios.post(`${projectApiUrls.addApprover}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: ADD_SANDBOX_APPROVER, data: res.data }))
            .catch(err => err);
    }
}
//add user for auto approver for host
export function addUserForAutoApproverHost(postData) {
    return dispatch => {
        return axios.post(`${projectApiUrls.autoApproverForHost}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: AUTO_APPROVER_FOR_HOST, data: res.data }))
            .catch(err => err);
    }
}

//remove approver
export function removeApprover(postData) {
    return dispatch => {
        return axios.post(`${projectApiUrls.removeApprover}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: REMOVE_SANDBOX_APPROVER, data: res.data }))
            .catch(err => err);
    }
}

//ADD user
export function addUser(postData) {
    return dispatch => {
        return axios.post(`${projectApiUrls.addUser}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: ADD_SANDBOX_USER, data: res.data }))
            .catch(err => err);
    }
}

//remove user
export function removeUser(postData) {
    return dispatch => {
        return axios.post(`${projectApiUrls.removeUser}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: REMOVE_SANDBOX_USER, data: res.data }))
            .catch(err => err);
    }
}

export function sendReminder(postData) {
    return dispatch => {
        return axios.post(`${projectApiUrls.sendReminder}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: SEND_REMINDER_FOR_APPROVAL, data: res.data }))
            .catch(err => err);
    }
}

export function addAWSInfo(postData) {
    return dispatch => {
        return axios.put(`${projectApiUrls.addAwsInfo}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: ADD_AWS_INFO, data: res.data }))
            .catch(err => err);
    }
}

export function addAZUREInfo(postData) {
    return dispatch => {
        return axios.put(`${projectApiUrls.addAzureInfo}`, postData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => dispatch({ type: ADD_AZURE_INFO, data: res.data }))
            .catch(err => err);
    }
}

export function getProjectList(clientId, userId, apiToken) {
    if (!clientId) {
        return dispatch => Promise.resolve(dispatch({ type: GET_PROJECT_LIST, data: {} }));
    }
    return dispatch => {
        return axios.get(`${projectApiUrls.getProjectList}${clientId}&userId=${userId}&apiToken=${apiToken}`)
            .then(res => dispatch({ type: GET_PROJECT_LIST, data: res.data }))
            .catch(err => err);
    }
}

export function sandboxAccountsByProject(projectId, clientId, accessPlatform) {
    if (!projectId) {
        return dispatch => Promise.resolve(dispatch({ type: GET_SANDBOX_LIST, data: {} }));
    }
    return dispatch => axios.get(`${projectApiUrls.sandboxAccountsByProject}${projectId}&clientId=${clientId}&accessPlatform=${accessPlatform}`)
        .then(res => dispatch({ type: GET_SANDBOX_LIST, data: res.data }))
        .catch(err => err);
}

/* on demand auto discovery */
export function onDemandAutoDiscoveryForSBAccount(onDemandSBTokenIds) {
    return dispatch => dispatch({ type: SANDBOX_ON_DEMAND_TOKENS, onDemandSBTokenIds });
}

/* on demand auto discovery setIntervalIds */
export function setOnDemandSBSetIntervalIds(onDemandSetIntervalIds) {
    return dispatch => dispatch({ type: ON_DEMAND_SB_SET_INTERVAL_IDS, onDemandSetIntervalIds });
}