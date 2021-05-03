
import { ARTICLE_STATUS, ACTIVE_PAGE } from "./../../constants/index";

export function setArticleStatus(state = {}, action) {
    const { type, articleStatus } = action;
    switch (type) {
        case ARTICLE_STATUS:
            return { ...state, articleStatus }
        default:
            return state;
    }
}

export function setActivePage(state = {}, action) {
    const { type, activePage } = action;
    switch (type) {
        case ACTIVE_PAGE:
            return { ...state, activePage }
        default:
            return state;
    }
}