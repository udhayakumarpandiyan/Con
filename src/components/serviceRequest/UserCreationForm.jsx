import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { masterApiUrls } from '../../util/apiManager';
import { generateToken } from '../../actions/commons/commonActions';
import { failureToast, successToast, infoToast } from "../../actions/commons/toaster";
import { fetchRequestType } from "./../../actions/requestForm/requestMain";
import Loader from '../resources/Loader';

function UserCreation({ submitUserRequest, loading }) {

    const [requestType, setRequestType] = useState('');
    const [notes, setNotes] = useState('');
    const [addAttachments, setAddAttachments] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const { userId, clientId, featureId, createdBy, emailId, masterClientId, requestTypes } = useSelector(state => {
        return {
            userId: state.current_user.payload ? state.current_user.payload.userId : "",
            clientId: state.current_client.payload ? state.current_client?.payload?.client : "",
            featureId: state.clientUserFeatures?.featureIds?.RequestForm,
            createdBy: state.current_user.payload.userName,
            emailId: state.current_user.payload.email,
            masterClientId: state.masterClient?.clientId,
            requestTypes: state.requestType,
        }
    })

    const onFileChange = async (e) => {
        e.preventDefault();
        const { files } = e.target;
        files && Object.values(files).forEach((file) => fileUpload(file));
    }

    const fileUpload = async (file) => {
        var formData = new FormData();
        formData.append('clientId', clientId === "all" ? masterClientId : clientId);
        formData.append('userId', userId);
        formData.append('files', file);
        let headers = {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
        };
        dispatch(generateToken()).then(res => {
            formData.append('apiToken', res.generateToken);
            setLoading(true);
            axios.post(masterApiUrls.uploadFile, formData, headers)
                .then((res) => {
                    setLoading(false);
                    const { status, message, data } = res.data
                    if (status !== 200) {
                        const text = typeof message === "string" ? message : "Something went wrong while uploading document!";
                        return failureToast(text);
                    }
                    const { link, key } = data;
                    setAddAttachments([...addAttachments, {
                        "fileUrl": link,
                        "fileName": file.name,
                        key
                    }]);
                }).catch((err) => {
                    setLoading(false);
                    typeof err.message === "string" ?
                        failureToast(err.message) : failureToast("Something went wrong. Please try again!");
                });
        });
    }

    useEffect(() => {
        dispatch(generateToken()).then(res => {
            dispatch(fetchRequestType(userId, res.generateToken));
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        let payload = { moduleName: 'User', createdBy, requestType, notes, userId, clientId, featureId, emailId };
        dispatch(generateToken()).then(async (data) => {
            payload['apiToken'] = data.generateToken;
            payload['attachments'] = Array.isArray(addAttachments) && addAttachments.length ? addAttachments : undefined;
            await submitUserRequest(payload, setInitialState);
            setInitialState();
        });
    }

    const removeAttachment = (index) => {
        if (Array.isArray(addAttachments)) {
            const newAttachements = index === 0 ? [...addAttachments.slice(index + 1)] : [...addAttachments.slice(0, index), ...addAttachments.slice(index + 1)];
            setAddAttachments(newAttachements);
        }
    }

    const setInitialState = () => {
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );
        Array.from(document.querySelectorAll("select")).forEach(
            select => (select.value = "")
        );
        Array.from(document.querySelectorAll("textarea")).forEach(
            textarea => (textarea.value = "")
        );
        setRequestType();
        setNotes();
        setAddAttachments();
        setLoading()
    }

    return (
        <div class="modal" id="userCreateModal">
            <div class="modal-dialog">
                <div class="modal-content custom-modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">User Request</h4>
                        <button type="button" class="close close-btn" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <Loader loading={loading || isLoading} />
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <text class="text-label label-style">Module Name</text>
                                </div>
                                <div class="col">
                                    <text class="text-label label-style">Request Type</text>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <input type="text" placeholder="User" name="User" value="User" style={{ width: '100%' }} disabled />
                                </div>
                                <div class="col">
                                    <select name='requestType' onChange={(e) => setRequestType(e.target.value)}>
                                        <option value=''>Select Request Type</option>
                                        {Array.isArray(requestTypes) && requestTypes.map(task =>
                                            <option name={task.name} title={task.name} key={task.name} value={task.name}>{task.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="text-label label-style" for="sel1">Enter Email Id And Notes</label>
                            <textarea class="form-control" rows="3" name='notes' value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                        </div>
                        <div class="form-group flex-content">
                            <label class="label-style" htmlFor="uploadFiles" style={{ width: "40%" }}>Upload Documents </label>
                            <input type="file" onChange={onFileChange} name="addAttachments" multiple style={{ direction: "ltr" }} />
                        </div>
                        {
                            Array.isArray(addAttachments) && addAttachments.map((attachment, index) => {
                                return <div key={index} style={{ width: "max-content", border: "1px solid #e8e5e5" }} >
                                    <div style={{ margin: '.5rem' }}>
                                        <span>{attachment.fileName}</span>
                                        <span style={{ marginLeft: "20px", color: "#ff0000", cursor: 'pointer' }} onClick={(e) => {
                                            e.preventDefault();
                                            removeAttachment(index);
                                        }}>X</span>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <div class="modal-footer" style={{ border: 'none' }}>
                        <button type="button" class="btn btn-outline-primary save-btn" onClick={handleSubmit}>Submit</button>
                        <button type="button" class="btn btn-cancel mr-auto cancel-btn" data-dismiss="modal" onClick={setInitialState}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCreation;