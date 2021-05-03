

export default function rcaEdit(state = [], action = {} )  {
    
    switch(action.type) {
        case '@@redux-form/SET_SUBMIT_SUCCEEDED': 
        	return action
        default: return state;
    }
}
