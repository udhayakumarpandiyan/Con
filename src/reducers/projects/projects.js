
import {
    SET_PROJECT, ADD_PROJECT, PROJECT_UPDATED, PROJECT_FETCHED, PROJECT_DELETED, PROJECT_TYPES,
    PROJECT_CLIENTS, UPLOAD_SUCCESS, EDIT_PROJECT_DATA, GET_TIMESHEET_DATA, VIEW_PROJECT_DETAILS,
    DELETE_PROJECT_DETAILS, VIEW_SANDBOX_LIST, DELETE_SANDBOX_ACCOUNT, ADD_ALREADY_HAVE_SANDBOX_ACCOUNT,
    EDIT_SANDBOX_ACCOUNT_DETAILS,
    EDIT_PROJECT_DETAILS, ADD_SANDBOX_ACCOUNT_WITH_APPROVAL, ADD_SANDBOX_APPROVER, REMOVE_SANDBOX_APPROVER, SEND_REMINDER_FOR_APPROVAL,
    ADD_SANDBOX_USER, REMOVE_SANDBOX_USER, ADD_AWS_INFO, ADD_AZURE_INFO, GET_PROJECT_LIST, GET_SANDBOX_LIST, SANDBOX_ON_DEMAND_TOKENS, ON_DEMAND_SB_SET_INTERVAL_IDS, AUTO_APPROVER_FOR_HOST
} from "./../../constants/index";

export function projects(state = [], action = {}) {

    switch (action.type) {

        case ADD_PROJECT:
            return [
                ...state,
                action.project
            ];

        case PROJECT_UPDATED:
            // return state.map(project => {
            // 	if (project._id === action.project._id) return action.project;
            // 	return project;
            // })
            return action.project;

        case PROJECT_DELETED:
            return state.map(project => {
                if (project._id === action.projectId) {
                    return action.project;
                }
                return project;
            });

        case SET_PROJECT:
            return action.projects

        default: return state;
    }

}
export function projectDetails(state = [], action = {}) {

    switch (action.type) {
        case PROJECT_FETCHED:
            return action.projectDetails
        case UPLOAD_SUCCESS:
            return action.upload
        default: return state;
    }
}

export function projectTypes(state = [], action = {}) {

    switch (action.type) {
        case PROJECT_TYPES:
            return action.projectTypes
        default: return state;
    }
}

export function projectClients(state = [], action = {}) {

    switch (action.type) {
        case PROJECT_CLIENTS:
            return action.projectClients
        default: return state;
    }
}

export function editProjectDetails(state = [], action = {}) {

    switch (action.type) {
        case EDIT_PROJECT_DATA:
            return action.editProjectDetails
        default: return state;
    }
}

export function timeSheetData(state = [], action = {}) {
    switch (action.type) {
        case GET_TIMESHEET_DATA:
            return action.timeSheetData
        default: return state;
    }
}

export function viewProjectDetails(state = [], action) {
    switch (action.type) {
        case VIEW_PROJECT_DETAILS:
            return action.viewProjectDetails && action.viewProjectDetails.data ? action.viewProjectDetails.data : {};
        default: return state;
    }
}

export function viewSandBoxAccountList(state = [], action) {
    switch (action.type) {
        case VIEW_SANDBOX_LIST:
            return action.viewSandBoxList && action.viewSandBoxList.data ? action.viewSandBoxList.data : {};
        default: return state;
    }
}

export function deleteProjectDetails(state = {}, action) {
    switch (action.type) {
        case DELETE_PROJECT_DETAILS:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function deleteSandboxAccount(state = {}, action) {
    switch (action.type) {
        case DELETE_SANDBOX_ACCOUNT:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function addAlreadyHaveAccount(state = {}, action) {
    switch (action.type) {
        case ADD_ALREADY_HAVE_SANDBOX_ACCOUNT:
            return action.data ? action.data : {};
        default: return state;
    }
}
// 
export function addSandboxWithApprovalFlow(state = {}, action) {
    switch (action.type) {
        case ADD_SANDBOX_ACCOUNT_WITH_APPROVAL:
            return action.data ? action.data : {};
        default: return state;
    }
}
// edit sandbox accoount;
export function editSandboxAccount(state = {}, action) {
    switch (action.type) {
        case EDIT_SANDBOX_ACCOUNT_DETAILS:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function editSandboxProject(state = {}, action) {
    switch (action.type) {
        case EDIT_PROJECT_DETAILS:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function addApprover(state = {}, action) {
    switch (action.type) {
        case ADD_SANDBOX_APPROVER:
            return action.data ? action.data : {};
        default: return state;
    }
}
export function autoApproverForHost(state = {}, action) {
    switch (action.type) {
        case AUTO_APPROVER_FOR_HOST:
            return action.data ? action.data : {};
        default:
            return state;
    }
}

export function removeApprover(state = {}, action) {
    switch (action.type) {
        case REMOVE_SANDBOX_APPROVER:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function addUser(state = {}, action) {
    switch (action.type) {
        case ADD_SANDBOX_USER:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function removeUser(state = {}, action) {
    switch (action.type) {
        case REMOVE_SANDBOX_USER:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function sendReminder(state = {}, action) {
    switch (action.type) {
        case SEND_REMINDER_FOR_APPROVAL:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function addAWSInfo(state = {}, action) {
    switch (action.type) {
        case ADD_AWS_INFO:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function addAZUREInfo(state = {}, action) {
    switch (action.type) {
        case ADD_AZURE_INFO:
            return action.data ? action.data : {};
        default: return state;
    }
}


export function getProjectList(state = {}, action) {
    switch (action.type) {
        case GET_PROJECT_LIST:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function sandboxAccountsByProject(state = {}, action) {
    switch (action.type) {
        case GET_SANDBOX_LIST:
            return action.data ? action.data : {};
        default: return state;
    }
}

export function getOnDemandAutoDiscoverySBTokens(state = {}, action) {
    switch (action.type) {
        case SANDBOX_ON_DEMAND_TOKENS:
            const { isDeleted, sbId } = action.onDemandSBTokenIds;
            const newData = isDeleted ? setData(state, sbId) : Object.assign({}, action.onDemandSBTokenIds, state);
            return newData;
        default: return state;
    }
}

function setData(state, sbId) {
    const { [sbId]: deleteValue, ...rest } = state;
    return rest;
};

export function setOnDemandSBSetIntervalIds(state = {}, action) {
    switch (action.type) {
        case ON_DEMAND_SB_SET_INTERVAL_IDS:
            if (!action.onDemandSetIntervalIds) {
                return {};
            }
            const { isDeleted, sbId } = action.onDemandSetIntervalIds;
            const newData = isDeleted ? setData(state, sbId) : Object.assign({}, state, action.onDemandSetIntervalIds);
            return newData;
        default: return state;
    }
}
