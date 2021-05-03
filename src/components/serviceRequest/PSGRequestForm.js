import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { generateToken } from '../../actions/commons/commonActions';
import { getProjectList } from "../../actions/projects";
import Loader from '../resources/Loader';
const ModalContent = styled.div`
width: 643px;
border: 1px solid var(--grey-4);
background: #FFFFFF 0% 0% no-repeat padding-box;
box-shadow: 0px 3px 10px #A3A3A333;
border: 1px solid #F2F2F2;
opacity: 1;
`;
export default function PSGRequestForm({ onSubmitPsgRequest, loading }) {


    const { userId, clientId, featureId, userClients, createdBy, emailId, requestProjectList } = useSelector(state => {
        return {
            userId: state.current_user.payload ? state.current_user.payload.userId : "",
            clientId: state.current_client.payload ? state.current_client?.payload?.client : "",
            featureId: state.clientUserFeatures?.featureIds?.RequestForm,
            userClients: state?.userClients,
            createdBy: state.current_user.payload.userName,
            emailId: state.current_user.payload.email,
            requestProjectList: state.getProjectList && Array.isArray(state.getProjectList.data) ? state.getProjectList.data : []
        }
    })

    const dispatch = useDispatch();
    const [clientName, setClientName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [projectType, setProjectType] = useState('');
    const [cloudPlatform, setCloudPlatform] = useState('');
    const [noOfArchitect, setNoOfArchitect] = useState('');
    const [noOfEngineers, setNoOfEngineers] = useState('');
    const [skillName1, setSkillName1] = useState('');
    const [skillName2, setSkillName2] = useState('');
    const [skillName3, setSkillName3] = useState('');
    const [duration, setDuration] = useState('');
    const [startDate, setStartDate] = useState('');
    const [comments, setComments] = useState('');

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
        setClientName();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(generateToken()).then(async (res) => {
            const psgworkres = await onSubmitPsgRequest({ clientName, projectName, projectType, cloudPlatform, noOfArchitect, noOfEngineers, skillName1, skillName2, skillName3, duration, startDate, createdBy, userId, clientId, featureId, emailId, apiToken: res.generateToken }, setInitialState)
            setInitialState();
        });
    }

    useEffect(() => {
        dispatch(generateToken()).then(res => {
            dispatch(getProjectList(clientId, userId, res.generateToken));
        });
    }, [])


    return (
        <>
            <div class="modal" id="psgRequestFormModal">
                <div class="modal-dialog">
                    <ModalContent className="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Request for PSG Resource</h4>
                            <button type="button" class="close close-btn" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <Loader loading={loading} />
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <text class="text-label label-style">Client</text>
                                    </div>
                                    <div class="col">
                                        <text class="text-label label-style">Project</text>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <select name='clientName' value={clientName} onChange={(e) => setClientName(e.target.value)}>
                                            <option value='' >Select Client</option>
                                            {
                                                Array.isArray(userClients) && userClients.map(clientList =>
                                                    <option name={clientList.name} title={clientList.name} key={clientList.name} value={clientList.name}>{clientList.name}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div class="col">
                                        <select name='projectName' value={projectName} onChange={(e) => setProjectName(e.target.value)}>
                                            <option value='' >Select Project</option>
                                            {
                                                Array.isArray(requestProjectList) && requestProjectList.map(projects =>
                                                    <option title={projects.projectName} key={projects.projectId} value={projects.projectName}>{projects.projectName}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <text class="text-label label-style" >Project Type</text>
                                    </div>
                                    <div class="col">
                                        <text class="text-label label-style">Cloud PlatForm</text>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <input type="text" name='projectType' value={projectType} onChange={(e) => setProjectType(e.target.value)} style={{ width: '100%' }} />
                                    </div>
                                    <div class="col">
                                        <input type="text" name='cloudPlatform' value={cloudPlatform} onChange={(e) => setCloudPlatform(e.target.value)} style={{ width: '100%' }} />
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <text class="text-label label-style"># of Solution Architects</text>
                                    </div>
                                    <div class="col">
                                        <text class="text-label label-style"># of Implementation Engineers</text>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <input type="text" name="noOfArchitect" value={noOfArchitect} onChange={(e) => setNoOfArchitect(e.target.value)} style={{ width: '100%' }} />
                                    </div>
                                    <div class="col">
                                        <input type="text" name="noOfEngineers" value={noOfEngineers} onChange={(e) => setNoOfEngineers(e.target.value)} style={{ width: '100%' }} />
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <text class="text-label label-style">Technical Detail/Skill 1</text>
                                    </div>
                                    <div class="col">
                                        <text class="text-label label-style">Technical Detail/Skill 2</text>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <input type="text" name="skillName1" value={skillName1} onChange={(e) => setSkillName1(e.target.value)} style={{ width: '100%' }} />
                                    </div>
                                    <div class="col">
                                        <input type="text" name="skillName2" value={skillName2} onChange={(e) => setSkillName2(e.target.value)} style={{ width: '100%' }} />
                                    </div>
                                </div>
                            </div>
                            {/*  */}
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <text class="text-label label-style">Technical Detail/Skill 3</text>
                                    </div>
                                    <div class="col">
                                        <text class="text-label label-style">Duration</text>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <input type="text" name="skillName1" value={skillName3} onChange={(e) => setSkillName3(e.target.value)} style={{ width: '100%' }} />
                                    </div>
                                    <div class="col">
                                        <input type="text" name="duration" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%' }} />
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <text class="text-label label-style">Start Date </text>
                                    </div>
                                    <div class="col">
                                        <text class="text-label label-style">Comments</text>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <input type="date" name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '100%' }} />
                                    </div>
                                    <div class="col">
                                        <input type="text" name="comments" value={comments} onChange={(e) => setComments(e.target.value)} style={{ width: '100%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer" style={{ border: 'none' }}>
                            <button type="button" class="btn btn-outline-primary save-btn" onClick={(e) => handleSubmit(e)}>Submit</button>
                            <button type="button" class="btn btn-cancel mr-auto cancel-btn" data-dismiss="modal">Cancel</button>
                        </div>
                    </ModalContent>
                </div>
            </div>

        </>
    )
}