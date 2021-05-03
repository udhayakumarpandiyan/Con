import {
    DOCUMENT_TYPE, RELATED_MODULE, USER_LIST_DOC
} from "../constants/index"

export function docType(state = [], action = {}) {
    switch (action.type) {
        case DOCUMENT_TYPE:
            return action.docType
        default: return state;
    }
}

export function relatedModule(state = [], action = {}) {
    switch (action.type) {
        case RELATED_MODULE:
            return action.relatedModule
        default: return state;
    }
}

export function userListDoc(state = [], action = {}) {
    switch (action.type) {
        case USER_LIST_DOC:
            return action.userListDoc
        default: return state;
    }
}