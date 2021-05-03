import { ARTICLE_STATUS, ACTIVE_PAGE } from "../../constants/index";

export function setArticleStatus(articleStatus) {
    return  (dispatch) => {
        dispatch({
            type: ARTICLE_STATUS,
            articleStatus
        });
    };
}

export function setActivePage(activePage) {
    return  (dispatch) => {
        dispatch({
            type: ACTIVE_PAGE,
            activePage
        });
    };
}