import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchHostRequestType } from "./../../actions/requestForm/requestMain";
import { generateToken } from '../../actions/commons/commonActions';

function HostRequest({ submitHostRequest, loading }) {

    const [notes, setNotes] = useState('');
    const [requestType, setRequestType] = useState('');
    const dispatch = useDispatch();

    const { userId, clientId, featureId, createdBy, emailId, masterClientId, hostRequestType } = useSelector(state => {
        return {
            userId: state.current_user.payload ? state.current_user.payload.userId : "",
            clientId: state.current_client.payload ? state.current_client?.payload?.client : "",
            featureId: state.clientUserFeatures?.featureIds?.RequestForm,
            createdBy: state.current_user.payload.userName,
            emailId: state.current_user.payload.email,
            masterClientId: state.masterClient?.clientId,
            hostRequestType: state.hostRequestType,
        }
    })

    useEffect(() => {
        dispatch(generateToken()).then(res => {
            dispatch(fetchHostRequestType(userId, res.generateToken));
        });
    }, [])

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
        // setLoading();
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(generateToken()).then(async (data) => {
            await submitHostRequest({ moduleName: 'Host', createdBy, requestType, notes, userId, clientId, featureId, emailId, apiToken: data.generateToken, setInitialState });
            setInitialState();
        });
    }

    return (
        <div class="modal" id="hostRequestModal">
            <div class="modal-dialog">
                <div class="modal-content custom-modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">User Request</h4>
                        <button type="button" class="close close-btn" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
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
                                    <input type="text" placeholder="Host" value="Host" style={{ width: '100%' }} />
                                </div>
                                <div class="col">
                                    <select name="requestType" onChange={(e) => setRequestType(e.target.value)}>
                                        <option value="">Select Request Type</option>
                                        {Array.isArray(hostRequestType) && hostRequestType.map(host =>
                                            <option name={host.name} title={host.name} key={host.name} value={host.name}>{host.name}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="text-label label-style" for="sel1">Enter Email Id And Notes</label>
                            <textarea class="form-control" rows="3" name="notes" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                        </div>
                    </div>
                    <div class="modal-footer" style={{ border: 'none' }}>
                        <button type="button" class="btn btn-outline-primary save-btn" onClick={handleSubmit}>Submit</button>
                        <button type="button" class="btn btn-cancel mr-auto cancel-btn" data-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HostRequest;