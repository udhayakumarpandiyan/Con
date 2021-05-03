import { COPY_PLAN_ACTIVITY, OBSOLETE_PLAN_ACTIVITY, SUBMIT_PLAN_ACTIVITY, SET_AUTOMATION_TEMPLATES, APPROVAL_PLAN_ACTIVITY } from "../../constants/index";

export function copyPlanActivity(state = [], action = {}) {
    switch (action.type) {
        case COPY_PLAN_ACTIVITY:
            return action.copyPlanActivity

        default: return state;
    }
}

export function obsoletePlanActivity(state = [], action = {}) {
    switch (action.type) {
        case OBSOLETE_PLAN_ACTIVITY:
            return action.obsoletePlanActivity

        default: return state;
    }
}

export function approvePlanActivity(state = [], action = {}) {
    switch (action.type) {
        case APPROVAL_PLAN_ACTIVITY:
            return action.approvePlanActivity

        default: return state;
    }
}

export function submitPlanActivity(state = [], action = {}) {
    switch (action.type) {
        case SUBMIT_PLAN_ACTIVITY:
            return action.submitPlanActivity

        default: return state;
    }
}

export function automationTemplates(state = [], action = {}) {
    switch (action.type) {
        case SET_AUTOMATION_TEMPLATES:
            return action.automationTemplates

        default: return state;
    }
}