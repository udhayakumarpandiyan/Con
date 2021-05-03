import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import _ from 'lodash';
import axios from "axios";
import { productConfigUrls } from "../../../util/apiManager";
import { failureToast, successToast } from "../../../actions/commons/toaster";
import { generateToken } from "../../../actions/commons/commonActions";
import './addMute.css';
import $ from 'jquery';

function AddMute({ toolsDetails, onCloseModal, hasShowBody, getMuteList }) {
    const dispatch = useDispatch();
    const hours = _.range(0, 24);
    const minutes = _.range(0, 60);
    const [startHour, setStartHour] = useState('');
    const [endHour, setEndHour] = useState('');
    const [startMin, setStartMin] = useState('');
    const [endMin, setEndMin] = useState('');
    const [mutedByAlarm, setMutedByAlarm] = useState([]);
    const [mutedByLog, setMutedByLog] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [monitoringToolId, setMonitoringToolId] = useState('');
    const [applicationDetails, setApplicationDetails] = useState([]);
    const [applicationId, setApplicationId] = useState('');
    const [hostDetails, setHostDetails] = useState([]);
    const [hosts, setHosts] = useState([]);
    const [CRId, setCRId] = useState('');
    const [alarmData, setAlarmData] = useState([]);
    const [logData, setLogData] = useState([]);


    const { userId, clientId } = useSelector(state => {
        return {
            userId: state.current_user.payload ? state.current_user.payload.userId : "",
            clientId: state.current_client.payload ? state.current_client?.payload?.client : "",
            featureId: state.clientUserFeatures?.featureIds?.admin
        }
    })

    useEffect(() => { getApplicationDetails() }, [clientId])


    const awsLogsData = async () => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        axios.get(`${productConfigUrls.eventConfigByOnlyToolId}?monitoringToolId=8&eventType=Alarm&clientId=${clientId}&apiToken=${apiToken}&userId=${userId}`)
            .then(res => {
                const { data, status } = res && res.data;
                if (status === 200) {
                    let alarmsFormatData = Array.isArray(data) && data.map(x => ({
                        'value': x.eventString,
                        'label': x.eventString
                    }));
                    setAlarmData(alarmsFormatData);
                }
            });
        return await axios.get(`${productConfigUrls.eventConfigByOnlyToolId}?monitoringToolId=8&eventType=Log&clientId=${clientId}&apiToken=${apiToken}&userId=${userId}`)
            .then(res => {
                const { data, status } = res && res.data;
                if (status === 200) {
                    // setLogData(data);
                    let logsFormatData = Array.isArray(data) && data.map(x => ({
                        'value': x.eventString,
                        'label': x.eventString
                    }));
                    setLogData(logsFormatData);
                }
            });
    }

    const getApplicationDetails = async () => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        let uri = `${productConfigUrls.getApplicationDetails}?clientId=${clientId}&userId=${userId}&apiToken=${apiToken}`;
        axios.get(uri).then(res => {

            return setApplicationDetails(res.data.data);
        });
    }

    const getHostDetails = async (value) => {
        if (value) {
            // const { failureToast, showLoaderIcon, generateToken, userId, clientId } = this.props;
            const { generateToken: apiToken } = await dispatch(generateToken());
            let uri = `${productConfigUrls.getHostDetails}?clientId=${clientId}&applicationId=${parseInt(value)}&userId=${userId}&apiToken=${apiToken}`;
            axios.get(uri).then(res => {
                if (res.data.status === 200) {
                    if (Array.isArray(res.data.data)) {
                        let hosts = res.data.data.map(x => ({ value: x["hostName"], label: x["hostName"] }));
                        setHostDetails(hosts);
                    }
                }
            }).catch(ex => {
                failureToast('Something went wrong. While getting host details!');
            })
        }
    }

    const submitMuteDetails = async () => {
        let start, end;
        const host = hosts.map(item => item.value);
        if (!CRId) {
            return failureToast("CR is required!");
        }
        if (!startDate) {
            return failureToast("Start Date is required!");
        }
        if (!endDate) {
            return failureToast("End Datetime is required!");
        }
        if (!monitoringToolId) {
            return failureToast("Monitoring Tool is required!");
        }
        start = `${startDate}T${startHour || "00"}:${startMin || "00"}:00+05:30`;
        if (new Date(start) < new Date()) {
            return failureToast("Can not submit a past datetime for Start Datetime!");
        }
        end = `${endDate}T${endHour || "00"}:${endMin || "00"}:00+05:30`;
        if (new Date(end) <= new Date(start)) {
            return failureToast("End datetime can not be less than Start datetime!");
        }
        if (Number(monitoringToolId) !== 8 && !applicationId) {
            return failureToast("application is required!");
        }
        const { generateToken: apiToken } = await dispatch(generateToken());
        let postData = {
            "clientId": clientId,
            "monitoringToolId": monitoringToolId,
            "startDateTime": new Date(start).toISOString(),
            "endDateTime": new Date(end).toISOString(),
            "applicationId": applicationId ? parseInt(applicationId) : undefined,
            "host": host,
            "CRId": CRId,
            "createdBy": userId,
            "createdDate": new Date().toISOString(),
            apiToken,
            userId
        }
        if (Number(monitoringToolId) === 8) {
            postData['mutedByLog'] = Array.isArray(mutedByLog) && mutedByLog.map(logs => logs.value);
            postData['mutedByAlarm'] = Array.isArray(mutedByAlarm) && mutedByAlarm.map(alarm => alarm.value);
        }
        axios.post(`${productConfigUrls.muteTab}`, { ...postData })
            .then(async (res) => {
                const isString = (res.data && typeof res.data.message === "string");
                if (res.data && res.data.status === 200) {
                    getMuteList();
                    return isString ? successToast(res.data.message) : successToast("Record added successfully");
                }
                return isString ? failureToast(res.data.message) : failureToast("Something went wrong. Please try again!");
            }).catch(async () => {
                failureToast("Error happened while processing your record!");
            });
    }

    const setAlarmDefaultData = () => {
        const { alarmData, logData } = {};
        let alarmsFormatData = Array.isArray(alarmData) && alarmData.map(x => ({
            'value': x.eventString,
            'label': x.eventString
        }));
        let logsFormatData = Array.isArray(logData) && logData.map(x => ({
            'value': x.eventString,
            'label': x.eventString
        }));
        // this.setState({ alarmData: alarmsFormatData, logData: logsFormatData });
    }

    const setDefaultAlarmLogData = (mutedByAlarm, mutedByLog) => {
        let alarmsFormatData = Array.isArray(mutedByAlarm) && mutedByAlarm.map(eventString => ({
            'value': eventString,
            'label': eventString
        }));
        let logsFormatData = Array.isArray(mutedByLog) && mutedByLog.map(eventString => ({
            'value': eventString,
            'label': eventString
        }));
        // this.setState({ mutedByAlarm: alarmsFormatData, mutedByLog: logsFormatData });
    }


    return (
        <>
            <div class="modal" id="addMuteWindow" tabIndex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog d-flex justify-content-center" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add New Mute</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={onCloseModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        {
                            hasShowBody &&
                            <div class="modal-body">
                                <div class="row container" >
                                    <div class="col-12 col-sm-6 col-md-6 col-xl-6">
                                        <div class="row text-content">Start Date </div>
                                        <div class="row container mt-12">
                                            <input type="date" name="startDate" onChange={({ target: { value } }) => setStartDate(value)} />
                                        </div>

                                    </div>

                                    <div class="col-12 col-sm-6 col-md-6 col-xl-6">
                                        <div class="row text-content">Start Time </div>
                                        <div class="row container mt-12" >
                                            <div >
                                                <select class="form-select border-btm" className='startHour' onChange={({ target: { value } }) => setStartHour(value)} >
                                                    <option selected>Hr</option>
                                                    {
                                                        hours.map((x, index) => {
                                                            if (x < 10) {
                                                                return <option key={index} value={"0" + x}>{"0" + x}</option>
                                                            }
                                                            return <option key={index} value={x}>{x}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>

                                            <div class="col-sm-2 col-md-2 col-xl-2"> </div>
                                            <div >
                                                <select class="form-select border-btm" name='startMin' onChange={({ target: { value } }) => setStartMin(value)} >
                                                    <option selected>Min</option>
                                                    {
                                                        minutes.map((x, index) => {
                                                            if (x < 10) {
                                                                return <option key={index} value={"0" + x}>{"0" + x}</option>
                                                            } else {
                                                                return <option key={index} value={x}>{x}</option>
                                                            }
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row container">
                                    <div class="col-12 col-sm-6 col-md-6 col-xl-6">
                                        <div class="row text-content">End Date </div>
                                        <div class="row container mt-12"  >
                                            <input type="date" name="endDate" onChange={({ target: { value } }) => setEndDate(value)} />
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-6 col-md-6 col-xl-6">
                                        <div class="row text-content">End Time </div>
                                        <div class="row container mt-12" >
                                            <div >
                                                <select class="form-select border-btm" name='endHour' onChange={({ target: { value } }) => setEndHour(value)} >
                                                    <option selected>Hr</option>
                                                    {
                                                        hours.map((x, index) => {
                                                            if (x < 10) {
                                                                return <option key={index} value={"0" + x}>{"0" + x}</option>
                                                            }
                                                            return <option key={index} value={x}>{x}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div class="col-sm-2 col-md-2 col-xl-2"> </div>
                                            <div >
                                                <select class="form-select border-btm" onChange={({ target: { value } }) => setEndMin(value)} >
                                                    <option selected>Min</option>
                                                    {
                                                        minutes.map((x, index) => {
                                                            if (x < 10) {
                                                                return <option key={index} value={"0" + x}>{"0" + x}</option>
                                                            } else {
                                                                return <option key={index} value={x}>{x}</option>
                                                            }
                                                        })
                                                    }
                                                </select>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div class="row container"  >
                                    <div class="col-12 col-sm-6 col-md-6 col-xl-6">
                                        <div class="row text-content">Tools</div>
                                        <div class="row container"  >
                                            <select class="form-select border-btm-width" aria-label="Default select example" onChange={({ target: { value } }) => {
                                                setMonitoringToolId(value);
                                                if (Number(value) === 8) {
                                                    awsLogsData();
                                                }
                                            }}>
                                                <option selected>Please Select</option>
                                                {
                                                    Array.isArray(toolsDetails) && toolsDetails.map((tool) => {
                                                        return <option key={tool.toolId} value={tool.toolId}>{tool.display}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    {
                                        Number(monitoringToolId) !== 8 &&
                                        <>
                                            <div class="col-12 col-sm-6 col-md-6 col-xl-6">
                                                <div class="row text-content">App</div>
                                                <div class="row container"  >
                                                    <select class="form-select border-btm-width" aria-label="Default select example" onChange={({ target: { value } }) => {
                                                        getHostDetails(value)
                                                        setApplicationId(value);
                                                    }} >
                                                        <option selected>Please Select</option>
                                                        {
                                                            applicationDetails && applicationDetails.map((app) => {
                                                                return <option key={app.applicationId} value={app.applicationId}>{app.applicationName}</option>
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    }
                                    {
                                        Number(monitoringToolId) === 8 &&
                                        <div class="col-12 col-sm-6 col-md-6 col-xl-6">
                                            <div class="row text-content">Alarms To Mute</div>
                                            {/* <button className="btn btn-info btn-sm" data-toggle="modal" data-target="#updateAlarms" style={{ float: "right", marginRight: "5px" }}
                                                onClick={(e) => e.preventDefault()}>Alarms</button> */}
                                            <Select
                                                isMulti
                                                onChange={setMutedByAlarm}
                                                value={mutedByAlarm}
                                                options={alarmData}
                                                placeholder="Select Alarms To Mute"
                                            />
                                        </div>

                                    }
                                </div>
                                <div class="row container"  >
                                    {
                                        Number(monitoringToolId) !== 8 &&
                                        <div class="col-12 col-sm-6 col-md-6 col-xl-6">
                                            <div class="row text-content">Host</div>
                                            <div class="row container">
                                                <Select
                                                    isMulti
                                                    onChange={setHosts}
                                                    value={hosts}
                                                    options={hostDetails}
                                                    placeholder="Select Host"
                                                />
                                            </div>
                                        </div>
                                    }
                                    {
                                        Number(monitoringToolId) === 8 &&
                                        <div class="col-12 col-sm-6 col-md-6 col-xl-6">
                                            <div class="row text-content">Log Group To Mute</div>
                                            {/* <button className="btn btn-info btn-sm" data-toggle="modal" data-target="#updateLogs" style={{ float: "right", marginRight: "5px" }}
                                                onClick={(e) => e.preventDefault()}>Log Group</button> */}
                                            <Select
                                                isMulti
                                                onChange={setMutedByLog}
                                                value={mutedByLog}
                                                options={logData}
                                                placeholder="Select Log Group To Mute"
                                            />
                                        </div>
                                    }
                                    <div class="col-12 col-sm-6 col-md-6 col-xl-6">
                                        <div class="row text-content">CR#</div>
                                        <div class="row container">
                                            <input type="text" style={{ marginTop: Number(monitoringToolId) === 8 ? '12px' : '' }} name="setCRId" onChange={({ target: { value } }) => setCRId(value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div class="modal-footer pull-left">
                            <button className='save-btn-all' onClick={submitMuteDetails}> Submit </button>
                            <button className='cancel-btn' onClick={onCloseModal}> Cancel </button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="modal" id="updateAlarms" role="dialog" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Update Alarms To Mute</h4>
                        </div>
                        <div className="modal-body">
                            <Select
                                isMulti
                                onChange={setMutedByAlarm}
                                value={mutedByAlarm}
                                options={alarmData}
                                placeholder="Select Alarms To Mute"
                            />
                        </div>
                        <div class="modal-footer">
                            <button type="button" className="btn btn-info btn-sm" onClick={() => $('#updateAlarms').modal('hide')}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal" id="updateLogs" role="dialog" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Update Log Group To Mute</h4>
                        </div>
                        <div className="modal-body">
                            <Select
                                isMulti
                                onChange={setMutedByLog}
                                value={mutedByLog}
                                options={logData}
                                placeholder="Select Log Group To Mute"
                            />
                        </div>
                        <div class="modal-footer">
                            <button type="button" className="btn btn-info btn-sm" onClick={() => $('#updateLogs').modal('hide')}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddMute;