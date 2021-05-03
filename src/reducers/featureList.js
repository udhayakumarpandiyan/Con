//https://www.rithmschool.com/courses/intermediate-react/react-redux-authentication

import { SET_CLINET_GROUP_FEATURES } from "../constants/index";

export default function featureList(state = [], action = {} ) {

    switch(action.type) {

        case SET_CLINET_GROUP_FEATURES: 
         return action.featureList
             
        default:
            return state;    
    }

}