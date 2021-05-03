
import { SET_HELPTOPICS } from "../../constants/index"

export default function helpTopics(state = [], action = {} )  {

    switch(action.type) {

        case SET_HELPTOPICS:
            return action.helpTopics

        default: return state;
    }

}