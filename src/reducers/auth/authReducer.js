//https://www.rithmschool.com/courses/intermediate-react/react-redux-authentication

import { SET_CURRENT_USER } from "../../constants/index";

const DEFAULT_STATE = {
    isAuthenticated: false,
    current_user: {}
};

export default (state = DEFAULT_STATE, action ) => {
    switch(action.type) {
        case SET_CURRENT_USER: 
            return {
                isAuthenticated: !!(Object.keys(action.payload).length),
                payload: action.payload
            };
        default:
            return state;    
    }

}