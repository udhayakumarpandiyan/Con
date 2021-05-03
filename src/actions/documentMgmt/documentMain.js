import { DOCUMENT_TYPE, RELATED_MODULE, USER_LIST_DOC } from "../../constants/index";
import { masterApiUrls, documentMgmtUrls } from "./../../util/apiManager";
import axios from "axios";

export function setMasterDataKb(masterData, masterCode) {
    switch (masterCode) {
        case "TD":
            let docType = masterData;
            return {
                type: DOCUMENT_TYPE,
                docType
            }
        case "RM":
            let relatedModule = masterData;
            return {
                type: RELATED_MODULE,
                relatedModule
            }
    }
}

export function masterDataKb(masterCode, userId, apiToken) {
    return dispatch => {
        fetch(`${masterApiUrls.getMasterData}${masterCode}&userId=${userId}&apiToken=${apiToken}`)
            .then(res => res.json())
            .then(data => dispatch(setMasterDataKb(data.data, masterCode)));
    }
}

export function getUserForDoc(userListDoc) {
    userListDoc = userListDoc.data ? userListDoc.data : userListDoc;
    return {
        type: USER_LIST_DOC,
        userListDoc
    }
}

export function fetchUserForDoc(request) {
    return dispatch =>
        axios.post(documentMgmtUrls.getUserListForDoc, request, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            dispatch(getUserForDoc(res.data));
            return res.data;
        }).catch(err => {
            dispatch(getUserForDoc({}));
            return err;
        });
}