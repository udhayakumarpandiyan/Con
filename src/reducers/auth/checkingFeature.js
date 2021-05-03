import { FEATURE_CHECKING } from "../../constants/index";

export function hasFeaturePermission(state = {}, action) {
    switch (action.type) {
        case FEATURE_CHECKING:
            return action.payload;
        default:
            return state;
    }
}