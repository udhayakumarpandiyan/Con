
import { RCA_LIST } from "./../../constants/index";
export default function rcas(state = [], action = {}) {
    switch (action.type) {
        case RCA_LIST:
            return action.rcas
        default: return state;
    }
}
