import { FEATURE_CHECKING } from "../../constants/index";

export function featureChecking() {
    return (dispatch, getState) => {
        const { featureIds } = getState().clientUserFeatures;
        const hasFeaturePermissions = {};
        Object.keys(featureIds || {}).forEach(key => {
            if (featureIds[key]) {
                hasFeaturePermissions[`has${key}Access`] = true;
            }
        });
        dispatch(setFeaturePermissions(hasFeaturePermissions));
        return Promise.resolve(hasFeaturePermissions);
    }
}


function setFeaturePermissions(payload) {
    return {
        type: FEATURE_CHECKING,
        payload
    }
}