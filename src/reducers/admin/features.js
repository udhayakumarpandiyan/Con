
import {SET_FEATURE, ADD_FEATURE, FEATURE_UPDATED, FEATURE_FETCHED, FEATURE_DELETED} from "../../constants/index"

export default function features(state = [], action = {} )  {

    switch(action.type) {

        case ADD_FEATURE: 
            return [
                ...state,
                action.feature  
            ];  
            
        case FEATURE_UPDATED:
			return state.map(feature => {
				if (feature._id === action.feature._id) return action.feature;
				return feature;
			})    

        case FEATURE_FETCHED:
            const index = state.findIndex(feature => feature._id === action.feature._id);
            if (index > -1) {
                return state.map(feature => {
                if (feature._id === action.feature._id) return action.feature;
                return feature;
                });
            } else {
                return [
                ...state,
                action.feature
                ];
            }

        case FEATURE_DELETED:
          return state.map(feature => {
            if (feature._id === action.featureId) {
              return action.feature;
            }
            return feature;
          });

        case SET_FEATURE: 
          return action.features

        default: return state;
    }

}