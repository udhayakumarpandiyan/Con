import { CLIENT_DIR_COUNTRY } from "./../../constants/index"

export default function clientDirCountry(state = [], action = {}) {
    switch (action.type) {
        case CLIENT_DIR_COUNTRY:
            return action.clientDirCountry
        default: return state;
    }
}