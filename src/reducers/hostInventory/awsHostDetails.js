import {AWS_HOST_DETAILS ,AWS_HOST_START_DETAILS, AWS_HOST_STOP_DETAILS,AWS_APPROVE_DETAILS,AWS_REJECT_DETAILS} from "./../../constants/index"

export default function awsHostDetails(state = [], action = {} )  {
    switch(action.type) {
        case AWS_HOST_DETAILS: 
        	return action.awsHostDetails
        default: return state;
    }
}

export  function awsApproveDetails(state = [], action = {} )  {

    switch(action.type) {
        case AWS_APPROVE_DETAILS: 
        	return action.awsApproveDetails
        default: return state;
    }
}
export  function awsRejectDetails(state = [], action = {} )  {

    switch(action.type) {
        case AWS_REJECT_DETAILS: 
        	return action.awsRejectDetails
        default: return state;
    }
}
export  function startEc2Data(state = [], action = {} )  {

    switch(action.type) {
        case AWS_HOST_START_DETAILS: 
        	return action.startEc2Data
        default: return state;
    }
}


export  function stopEc2Data(state = [], action = {} )  {

    switch(action.type) {
        case AWS_HOST_STOP_DETAILS: 
        	return action.stopEc2Data
        default: return state;
    }
}
