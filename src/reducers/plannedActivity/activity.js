import { SET_PLAN_ACTIVITY, SET_PLAN_ACTIVITY_STATE, SET_PLAN_ACTIVITY_STATUS } from "../../constants/index";

export function activity(state = [], action = {}) {
    switch (action.type) {
        case SET_PLAN_ACTIVITY:
            return action.activity;
        default: return state;
    }
}

export function activityState(state = [], action = {}) {
    switch (action.type) {
        case SET_PLAN_ACTIVITY_STATE:
            return action.activityState
        default: return state;
    }
}

export function activityStatus(state = [], action = {}) {
    switch (action.type) {
        case SET_PLAN_ACTIVITY_STATUS:
            return action.activityStatus
        default: return state;
    }
}