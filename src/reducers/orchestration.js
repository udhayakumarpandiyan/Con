import {
    ORCH_TEMPLATE_LIST,ORCH_TEMPLATE_LIST_BY_ID,ORCH_SERVICE_LIST,ORCH_LIST_BY_ID,MODIFY_ORCH_SERVICE,ORCH_DELETE_SERVICE,
    CREATE_ORCH_SERVICE, ORCH_VIEW_PROVIDER, CREATE_TEMPLATE, ORCH_DELETE_TEMPLATE,MODIFY_ORCH_SERVICE_PLAN } from "../constants/index"

export function orchTemplateCreated(state = [], action = {}) {
    switch (action.type) {
        case CREATE_TEMPLATE:
            return action.orchTemplateCreated
        default: return state;
    }
}
    

export function orchTemplatesList(state = [], action = {}) {
    switch (action.type) {
        case ORCH_TEMPLATE_LIST:
            return action.orchTemplatesList
        default: return state;
    }
}

export function orchTemplateDeleted(state = [], action = {}) {
    switch (action.type) {
        case ORCH_DELETE_TEMPLATE:
            return action.orchTemplateDeleted
        default: return state;
    }
}

export function orchProviderList(state = [], action = {}) {
    switch (action.type) {
        case ORCH_VIEW_PROVIDER:
            return action.orchProviderList
        default: return state;
    }
}

export function orchTemplatesListById(state = [], action = {}) {
    switch (action.type) {
        case ORCH_TEMPLATE_LIST_BY_ID:
            return action.orchTemplatesListById
        default: return state;
    }
}

export function orchServiceList(state = [], action = {}) {
    switch (action.type) {
        case ORCH_SERVICE_LIST:
            return action.orchServiceList
        default: return state;
    }
}

export function createOrchService(state = [], action = {}) {
    switch (action.type) {
        case CREATE_ORCH_SERVICE:
            return action.createOrchService
        default: return state;
    }
}

export function orchListById(state = [], action = {}) {
    switch (action.type) {
        case ORCH_LIST_BY_ID:
            return action.orchListById
        default: return state;
    }
}

export function modifyOrchService(state = [], action = {}) {
    switch (action.type) {
        case MODIFY_ORCH_SERVICE:
            return action.modifyOrchService
        default: return state;
    }
}

export function modifyOrchServicePlan(state = [], action = {}) {
    switch (action.type) {
        case MODIFY_ORCH_SERVICE_PLAN:
            return action.modifyOrchServicePlan
        default: return state;
    }
}

export function orchLaunchedDeleted(state = [], action = {}) {
    switch (action.type) {
        case ORCH_DELETE_SERVICE:
            return action.orchLaunchedDeleted
        default: return state;
    }
}






