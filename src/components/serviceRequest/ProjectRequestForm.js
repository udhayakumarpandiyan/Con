import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjectType } from "./../../actions/requestForm/requestMain";
import { generateToken } from '../../actions/commons/commonActions';
import { startState } from 'codemirror';

const ModalContent = styled.div`
width: 643px;
border: 1px solid var(--grey-4);
background: #FFFFFF 0% 0% no-repeat padding-box;
box-shadow: 0px 3px 10px #A3A3A333;
border: 1px solid #F2F2F2;
opacity: 1;
`;

function ProjectRequestForm({ onSubmitProjectRequest, loading }) {
    const [clientName, setClientName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [projectType, setProjectType] = useState('');
    const [duration, setDuration] = useState('');
    const [primContactName, setPrimContactName] = useState('');
    const [primPhoneNumber, setPrimPhoneNumber] = useState('');
    const [primEmail, setPrimEmail] = useState('');
    const [secContactName, setSecContactName] = useState('');
    const [secPhoneNumber, setSecPhoneNumber] = useState('');
    const [secEmail, setSecEmail] = useState('');
    const [plannedStartDate, setPlannedStartDate] = useState('');
    const [plannedEndDate, setPlannedEndDate] = useState('');
    const [internalContactName, setInternalContactName] = useState('');
    const [comments, setComments] = useState('');

    const dispatch = useDispatch();

    const { userId, clientId, featureId, userClients, requestTaskType, createdBy, emailId, requestProjectType } = useSelector(state => {
        return {
            userId: state.current_user.payload ? state.current_user.payload.userId : "",
            clientId: state.current_client.payload ? state.current_client?.payload?.client : "",
            featureId: state.clientUserFeatures?.featureIds?.RequestForm,
            userClients: state?.userClients,
            requestTaskType: state.requestTaskType,
            createdBy: state.current_user.payload.userName,
            emailId: state.current_user.payload.email,
            requestProjectType: state.requestProjectType,
        }
    })

    useEffect(() => {
        dispatch(generateToken()).then(res => {
            dispatch(fetchProjectType(userId, res.generateToken));
        })
    }, [])


    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(generateToken()).then((data) => {
            onSubmitProjectRequest({ clientName, projectName, projectType, duration, primContactName, primPhoneNumber, primEmail, secContactName, secPhoneNumber, secEmail, plannedStartDate, plannedEndDate, internalContactName, comments, createdBy, userId, clientId, featureId, emailId, apiToken: data.generateToken }, setInitialState)
        });
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
        setClientName('');
        setComments('');
        setDuration('');
        setInternalContactName('');
        setPlannedEndDate('');
        setPlannedStartDate('');
        setPrimContactName('');
        setPrimEmail('');
        setPrimPhoneNumber('');
        setSecContactName('');
        setSecEmail('');
        setSecPhoneNumber();
        setInternalContactName();
        setProjectName('');
        setProjectType('');
    }

    return (
        <div class="modal" id="projectCreationModal">
            <div class="modal-dialog">
                <ModalContent className="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Request for Project Creation</h4>
                        <button type="button" class="close close-btn" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <text class="text-label label-style">Client</text>
                                </div>
                                <div class="col">
                                    <text class="text-label label-style">Project Name</text>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <select name='clientName' value={clientName} onChange={(e) => setClientName(e.target.value)}>
                                        <option value="">Select Client</option>
                                        {
                                            Array.isArray(userClients) && userClients.map(clientList =>
                                                <option name={clientList.name} title={clientList.name} key={clientList.name} value={clientList.name}>{clientList.name}</option>
                                            )
                                        }
                                    </select>
                                </div>
                                <div class="col">
                                    <input type="text" name="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <text class="text-label label-style">Project Type</text>
                                </div>
                                <div class="col">
                                    <text class="text-label label-style">Duration</text>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <select name="projectType" value={projectType} onChange={(e) => setProjectType(e.target.value)}>
                                        <option value="" >Select type</option>
                                        {
                                            Array.isArray(requestProjectType) && requestProjectType.map((projectType) =>
                                                <option name={projectType.name} title={projectType.name} key={projectType.name} value={projectType.name}>{projectType.name}</option>)
                                        }
                                    </select>
                                </div>
                                <div class="col">
                                    <input type="text" name="duration" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <text class="text-label label-style">Primary Contact Name</text>
                                </div>
                                <div class="col">
                                    <text class="text-label label-style">Phone Number</text>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <input type="text" name="primContactName" value={primContactName} onChange={(e) => setPrimContactName(e.target.value)} style={{ width: '100%' }} />
                                </div>
                                <div class="col">
                                    <input type="text" name="primPhoneNumber" value={primPhoneNumber} onChange={(e) => setPrimPhoneNumber(e.target.value)} style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <text class="text-label label-style">Email</text>
                                </div>
                                <div class="col">
                                    <text class="text-label label-style">Secondary Contact Name</text>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <input type="text" name="primEmail" value={primEmail} onChange={(e) => {
                                        setPrimEmail(e.target.value)
                                    }} style={{ width: '100%' }} />
                                </div>
                                <div class="col">
                                    <input type="text" name="secContactName" value={secContactName} onChange={(e) => setSecContactName(e.target.value)} style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <text class="text-label label-style">Phone Number</text>
                                </div>
                                <div class="col">
                                    <text class="text-label label-style">Email</text>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <input type="text" name="secPhoneNumber" value={secPhoneNumber} onChange={(e) => setSecPhoneNumber(e.target.value)} style={{ width: '100%' }} />
                                </div>
                                <div class="col">
                                    <input type="text" name="secEmail" value={secEmail} onChange={(e) => {
                                        setSecEmail(e.target.value)
                                    }} style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <text class="text-label label-style">Planned Start Date</text>
                                </div>
                                <div class="col">
                                    <text class="text-label label-style">Planned End Date</text>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <input type="date" name="plannedStartDate" value={plannedStartDate} onChange={(e) => setPlannedStartDate(e.target.value)} style={{ width: '100%' }} />
                                </div>
                                <div class="col">
                                    <input type="date" name="plannedEndDate" value={plannedEndDate} onChange={(e) => setPlannedEndDate(e.target.value)} style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <text class="text-label label-style">Internal Contact Name</text>
                                </div>
                                <div class="col">
                                    <text class="text-label label-style">Comments</text>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <input type="text" name="internalContactName" value={internalContactName} onChange={(e) => setInternalContactName(e.target.value)} style={{ width: '100%' }} />
                                </div>
                                <div class="col">
                                    <input type="text" name="comments" value={comments} onChange={(e) => setComments(e.target.value)} style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                        {/*  */}
                        {/* <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <text class="text-label label-style">Requested For</text>
                                </div>
                                <div class="col">
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <input type="text" id="request" name="request" style={{ width: '100%' }} />
                                </div>
                                <div class="col">
                                </div>
                            </div>
                        </div> */}
                    </div>
                    <div class="modal-footer" style={{ border: 'none' }}>
                        <button type="button" class="btn btn-outline-primary save-btn" onClick={handleSubmit}>Submit</button>
                        <button type="button" class="btn btn-cancel mr-auto cancel-btn" data-dismiss="modal">Cancel</button>
                    </div>
                </ModalContent>
            </div>
        </div>
    )
}

export default ProjectRequestForm;