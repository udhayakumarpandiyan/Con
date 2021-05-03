import {
    ORCH_TEMPLATE_LIST, ORCH_TEMPLATE_LIST_BY_ID, ORCH_SERVICE_LIST, ORCH_LIST_BY_ID, MODIFY_ORCH_SERVICE,
    CREATE_ORCH_SERVICE, CREATE_TEMPLATE, ORCH_DELETE_TEMPLATE, ORCH_DELETE_SERVICE, ORCH_VIEW_PROVIDER, MODIFY_ORCH_SERVICE_PLAN
} from "../../constants/index";

import { orchestrationUrls } from "../../util/apiManager";

function handleResponse(response) {
    if (response.statusText === "OK") {
        return response.json();
    } else {
        let err = new Error(response.statusText);
        err.response = response;
        throw err;
    }
}

//************* Listing *************//
export function getTemplateList(orchTemplatesList) {
    return {
        type: ORCH_TEMPLATE_LIST,
        orchTemplatesList
    }
}

export function fetchTemplateList(request) {
    return dispatch => {
        return fetch(orchestrationUrls.getTemplates, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(getTemplateList(data.data));
                return data;
            });
    }
}

//************* Create Template *************//
export function createTemplate(orchTemplateCreated) {
    return {
        type: CREATE_TEMPLATE,
        orchTemplateCreated
    }
}

export function createServiceTemplate(request) {
    return dispatch => {
        return fetch(orchestrationUrls.createOrchTemplate, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(createTemplate(data)));
    }
}


//************* Delete Template *************//
export function deleteTemplate(orchTemplateDeleted) {
    return {
        type: ORCH_DELETE_TEMPLATE,
        orchTemplateDeleted
    }
}

export function deleteOrchTemplate(request) {
    return dispatch => fetch(orchestrationUrls.deleteOrchTemplate, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
        .then(data => dispatch(deleteTemplate(data)));

}


//************* View Provider *************//
export function getOrchProviders(orchProviderList) {
    return {
        type: ORCH_VIEW_PROVIDER,
        orchProviderList
    }
}

export function viewOrchProviders(request) {
    return dispatch => fetch(orchestrationUrls.viewOrchProvider, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
        .then(data => dispatch(getOrchProviders(data)))

}


//************* View Template By Id *************//
export function getOrchTemplateById(orchTemplatesListById) {
    return {
        type: ORCH_TEMPLATE_LIST_BY_ID,
        orchTemplatesListById
    }
}

export function viewOrchTemplateById(request) {
    return dispatch => fetch(orchestrationUrls.getTemplatesById, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
        .then(data => dispatch(getOrchTemplateById(data)))

}





//************* Listing  Service *************//
export function getOrchServiceList(orchServiceList) {
    return {
        type: ORCH_SERVICE_LIST,
        orchServiceList
    }
}

export function fetchServiceList(request) {
    return dispatch => {
        return fetch(orchestrationUrls.getOrchServiceList, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                dispatch(getOrchServiceList(data.data));
                return data;
            });
    }
}




//************* Create Orchestration *************//
export function createOrchServiceListData(createOrchService) {
    return {
        type: CREATE_ORCH_SERVICE,
        createOrchService
    }
}

export function createOrchServiceList(request) {
    return dispatch => {
        return fetch(orchestrationUrls.createOrchService, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(createOrchServiceListData(data)));
    }
}



//************* View Orch By Id *************//
export function getOrchByOrchId(orchListById) {
    return {
        type: ORCH_LIST_BY_ID,
        orchListById
    }
}

export function getOrchDetailsByOrchId(request) {
    return dispatch => fetch(orchestrationUrls.getOrchById, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
        .then(data => dispatch(getOrchByOrchId(data)))

}


//************* modify exsisting Orchestration *************//
export function modifyOrchServiceListData(modifyOrchService) {
    return {
        type: MODIFY_ORCH_SERVICE,
        modifyOrchService
    }
}

export function modifyOrchServiceList(request) {
    return dispatch => {
        return fetch(orchestrationUrls.modifyOrchService, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(modifyOrchServiceListData(data)));
    }
}



//************* modify exsisting Orchestration plan details *************//
export function getModifiedOrchPlanDetails(modifyOrchServicePlan) {
    return {
        type: MODIFY_ORCH_SERVICE_PLAN,
        modifyOrchServicePlan
    }
}

export function modifiedOrchPlanDetails(request) {
    return dispatch => {
        return fetch(orchestrationUrls.modifyOrchService, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(getModifiedOrchPlanDetails(data)));
    }
}

//************* Delete Service Launch *************//
export function deleteServiceLaunched(orchLaunchedDeleted) {
    return {
        type: ORCH_DELETE_SERVICE,
        orchLaunchedDeleted
    }
}

export function deleteOrchLunched(request) {
    if (!request) {
        return dispatch => Promise.resolve(dispatch(deleteServiceLaunched({})));

    }
    return dispatch => fetch(orchestrationUrls.deleteOrchLunched, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
        .then(data => dispatch(deleteServiceLaunched(data)));
}

export function createPowerShellTemplate(request) {
    return dispatch => {
        return fetch(orchestrationUrls.createPowerShellTemplate, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(createTemplate(data)));
    }
}

export function runPowerShellScript(request) {
    return dispatch => {
        return fetch(orchestrationUrls.runPowerShellScript, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => dispatch(createOrchServiceListData(data)));
    }
}
