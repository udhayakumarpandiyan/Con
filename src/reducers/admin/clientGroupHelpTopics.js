import { ADD_CLIENT_GORUP_HELP_TOPICIS, SET_GROUP_HELP_TOPICS } from "../../constants/index";

export default function clientGroupHelpTopics(state = [], action = {} ) {

    switch(action.type) {
        case ADD_CLIENT_GORUP_HELP_TOPICIS: 
             return action.clientGroupHelpTopics
        case SET_GROUP_HELP_TOPICS:
            return action.clientGroupHelpTopics
        default:
            return state;    
    }
}
