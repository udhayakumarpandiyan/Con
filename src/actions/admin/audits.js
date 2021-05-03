
import { SET_AUDIT, ADD_AUDIT, AUDIT_UPDATED, AUDIT_FETCHED, AUDIT_DELETED }  from "../../constants/index"
import { adminApiUrls }  from "../../util/apiManager"

function handleResponse(response) {
    if(response.statusText === "OK") {
        return response.json();
    } else {
        let err = new Error(response.statusText);
        err.response = response;
        throw err;
    }
}

export function setAudits(audits){
    return {
        type: SET_AUDIT,
        audits
    }
}

export function addAudit(audit){
    return {
        type: ADD_AUDIT,
        audit
    }
}

export function auditUpdated(audit){
    return {
        type: AUDIT_UPDATED,
        audit
    }
}

export function auditFetched(audit) {
    return {
        type: AUDIT_FETCHED,
        audit
    }
}

export function auditDeleted(auditId) {
    return {
        type: AUDIT_DELETED,
        _id: auditId
    }
}

export function fetchAudits() {  
    return dispatch => {
        fetch(`${adminApiUrls.getAudits}?type=${this.match.params.type}`)
            .then(res => res.json())
            .then(data => dispatch(setAudits(data)));
    }
}


export function saveAudit(data) { 
	return dispatch => {
		return fetch(`${adminApiUrls.getAudits}`, {
			method: 'post',
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json"
			}
        }).then(handleResponse)
  		  .then(data => dispatch(addAudit(data)));
	}
}

export function fetchAudit(id) {
	return dispatch => {
		fetch(`${adminApiUrls.getAudits}/${id}`)
			.then(res => res.json())
			.then(data => dispatch(auditFetched(data.data)));
	}
}


export function updateAudit(data) { 
	return dispatch => {
		return fetch(`${adminApiUrls.getAudits}/${data._id}`, {
			method: 'put',
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(handleResponse)
		.then(data => dispatch(auditUpdated(data)));
	}
}


export function deleteAudit(id) { 
	return dispatch => {
		return fetch(`${adminApiUrls.getAudits}/${id}`, {
            method: 'put',
            body: JSON.stringify({status: "deleted"}),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(handleResponse)
		.then(data => dispatch(auditDeleted(id)));
	}
}


