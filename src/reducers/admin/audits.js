
import {SET_AUDIT, ADD_AUDIT, AUDIT_UPDATED, AUDIT_FETCHED, AUDIT_DELETED} from "../../constants/index"

export default function audits(state = [], action = {} )  {

    switch(action.type) {

        case ADD_AUDIT: 
            return [
                ...state,
                action.audit  
            ];  
            
        case AUDIT_UPDATED:
			return state.map(audit => {
				if (audit._id === action.audit._id) return action.audit;
				return audit;
			})    

        case AUDIT_FETCHED:
            const index = state.findIndex(audit => audit._id === action.audit._id);
            if (index > -1) {
                return state.map(audit => {
                if (audit._id === action.audit._id) return action.audit;
                return audit;
                });
            } else {
                return [
                ...state,
                action.audit
                ];
            }

        case AUDIT_DELETED:
          return state.map(audit => {
            if (audit._id === action.auditId) {
              return action.audit;
            }
            return audit;
          });

        case SET_AUDIT: 
          return action.audits

        default: return state;
    }

}