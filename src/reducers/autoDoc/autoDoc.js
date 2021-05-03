import { AUTODOCHOST_LIST, AUTODOCCURRENT_DELTA, AUTODELTA_LIST, MANUAL_SCRIPT_RUN } from "./../../constants/index"

export function autoDocHostList(state = [], action = {}) {
  switch (action.type) {
    case AUTODOCHOST_LIST:
      return action.autoDocHostList
    default: return state;
  }
}



export function autoDocCurrentDelta(state = [], action = {}) {
  switch (action.type) {
    case AUTODOCCURRENT_DELTA:
      return action.autoDocCurrentDelta
    default: return state;
  }
}

export function autoDeltaList(state = [], action = {}) {
  switch (action.type) {
    case AUTODELTA_LIST:
      return action.autoDeltaList
    default: return state;
  }
}

export function manualScriptRun(state = {}, action = {}) {
  switch (action.type) {
    case MANUAL_SCRIPT_RUN:
      return action;
    default:
      return state;
  }
}