import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { generateToken } from '../../actions/commons/commonActions';
// import { failureToast, successToast, infoToast } from "../../actions/commons/toaster";
import { useSelector, useDispatch } from 'react-redux';
import { fetchTaskType } from '../../actions/requestForm/requestMain';

const ModalContent = styled.div`
width: 643px;
border: 1px solid var(--grey-4);
background: #FFFFFF 0% 0% no-repeat padding-box;
box-shadow: 0px 3px 10px #A3A3A333;
border: 1px solid #F2F2F2;
opacity: 1;
`;

function NetworkConfiguration({ onSubmitNetworkReq }) {

    const { userId, clientId, featureId, userClients, requestTaskType, createdBy, emailId } = useSelector(state => {
        return {
            userId: state.current_user.payload ? state.current_user.payload.userId : "",
            clientId: state.current_client.payload ? state.current_client?.payload?.client : "",
            featureId: state.clientUserFeatures?.featureIds?.RequestForm,
            userClients: state?.userClients,
            requestTaskType: state.requestTaskType,
            createdBy: state.current_user.payload.userName,
            emailId: state.current_user.payload.email
        }
    })

    const [clientName, setClientName] = useState('');
    const [protocolType, setProtocolType] = useState('');
    const [hostIp, setHostIp] = useState('');
    const [port, setPort] = useState('');
    const [response, setResponse] = useState('');
    const [additionalTags, setAdditionalTags] = useState('');

    const dispatch = useDispatch();

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
        setProtocolType();
        setHostIp();
        setPort();
        setResponse();
        setAdditionalTags();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(generateToken()).then(async (res) => {
            const networkres = await onSubmitNetworkReq({ clientName, protocolType, hostIp, port, response, additionalTags, createdBy, emailId, userId, clientId, featureId, apiToken: res.generateToken, setInitialState })
            setInitialState();
        });
    }

    useEffect(() => {
        dispatch(generateToken()).then(res => {
            dispatch(fetchTaskType(userId, res.generateToken));
        });
    }, [])

    return (
        <div class="modal" id="networkConfiguration" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog">
                <ModalContent className="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Configure Network / URL / Port Monitor Request</h4>
                        <button type="button" class="close close-btn" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <text class="text-label label-style">Client</text>
                                </div>
                                <div class="col">
                                    <text class="text-label label-style">Type Check</text>
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
                                    <select name='protocolType' value={protocolType} onChange={(e) => setProtocolType(e.target.value)}>
                                        <option value='' >Select Type Check</option>
                                        {
                                            Array.isArray(requestTaskType) && requestTaskType.map(taskTypeList =>
                                                <option name={taskTypeList.name} title={taskTypeList.name} key={taskTypeList.name} value={taskTypeList.name}>{taskTypeList.name}</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <text class="text-label label-style" >Host IP/URL</text>
                                </div>
                                <div class="col">
                                    <text class="text-label label-style">Port(For TCP Checks)</text>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <input type="text" name='hostIp' value={hostIp} onChange={(e) => setHostIp(e.target.value)} style={{ width: '100%' }} />
                                </div>
                                <div class="col">
                                    <input type="text" name='port' value={port} onChange={(e) => setPort(e.target.value)} style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <text class="text-label label-style">Response Pattern Checks</text>
                                </div>
                                <div class="col">
                                    <text class="text-label label-style">Additional Tags/Requested For</text>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col">
                                    <input type="text" id="response" name="response" value={response} onChange={(e) => setResponse(e.target.value)} style={{ width: '100%' }} />
                                </div>
                                <div class="col">
                                    <input type="text" id="additionalTags" name="additionalTags" value={additionalTags} onChange={(e) => setAdditionalTags(e.target.value)} style={{ width: '100%' }} />
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
    )
}

export default NetworkConfiguration;