import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { OPERATORS, EVENT_TYPE, ALARM_TYPES } from "../../../constants/index";
import { getLogGroupType, logGroupsNames, getAlarmNames } from "../../../actions/admin/cemSettingsActions";

import { generateToken } from "../../../actions/commons/commonActions";
import { failureToast, successToast } from "../../../actions/commons/toaster";

function AddConfig({ toolsDetails }) {
    const [tableRows, setTableRows] = useState([
        {
            "value": "",
            "operator": "",
            "value2": "",
            "notify": false,
            "ticket": false,
            "ticketType": "",
            "ticketPriority": "",
            "group": ""
        }
    ]);
    const [region, setRegion] = useState('');
    const [eventType, setEventType] = useState('');
    const [logGroup, setLogGroup] = useState('');
    const [logGroupType, setLogGroupType] = useState('');
    const [alarmType, setAlarmType] = useState('');
    const [alarmName, setAlarmName] = useState('');
    const [eventConfigRuleName, setEventConfigRuleName] = useState('');
    const [eventString, setEventString] = useState(undefined);
    const [monitoringToolId, setMonitoringToolId] = useState('');

    const dispatch = useDispatch();
    const { userId, clientId, getRegionAWS, logGroupsNamesObj, getLogGroupTypesData, getAlarmNamesData } = useSelector(state => {
        return {
            userId: state.current_user.payload ? state.current_user.payload.userId : "",
            clientId: state.current_client.payload ? state.current_client?.payload?.client : "",
            featureId: state.clientUserFeatures?.featureIds?.admin,
            getRegionAWS: state.getRegionAWS,
            logGroupsNamesObj: state.getLogGroupsNames && state.getLogGroupsNames.data && state.getLogGroupsNames.data.logGroups ? state.getLogGroupsNames.data.logGroups : {},
            getLogGroupTypesData: state.getLogGroupTypes && state.getLogGroupTypes.data ? state.getLogGroupTypes.data : {},
            getAlarmNamesData: state.getAlarmNames && state.getAlarmNames.data ? state.getAlarmNames.data : {}
        }
    });

    useEffect(async () => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        dispatch(getLogGroupType(userId, apiToken));
    }, [userId])

    const addRow = () => setTableRows([...tableRows].concat(tableRows));

    const deleteRow = (index) => {
        let _tableRows = tableRows;
        _tableRows.splice(index, 1);
        setTableRows(_tableRows);
    }

    const handleChange = (e, index) => {
        e.preventDefault();
        if (e.target.name === "operator" && e.target.value !== "4") {
            var tableRow = tableRows.map(item => {
                if (item["operator"] !== "4") {
                    (item["value2"] = "")
                }
                return item;
            });
            setTableRows(tableRow);
        }
        var _tableRows = tableRows;
        var updateObj = _tableRows[index];
        updateObj[e.target.name] = e.target.value ? e.target.value.trim() : null;
        _tableRows[index] = updateObj;
        setTableRows(_tableRows);
    }

    const handleCheckboxChange = (e, index) => {
        let _tableRows = tableRows;
        let updateObj = _tableRows[index];
        updateObj[e.target.name] = e.target.checked;
        _tableRows[index] = updateObj;
        setTableRows(_tableRows);
    }

    const handleStateChange = async (e) => {
        const { name, value } = e.target;
        if ("monitoringToolId" === name) {
            setEventString(undefined);
            setEventType('');
        }
        if (name === "region") {
            setLogGroup('');
            setAlarmName('');
            getLogGroupsNames(value);
            fetchAlarmNames(value, false, true);
        }
        if (name === "alarmType") {
            setAlarmName('');
            fetchAlarmNames(value, true, false);
        }
    }

    const fetchAlarmNames = async (value, isAlertType, isRegion) => {
        const payload = { clientId, userId, region: isRegion ? value : region, alarmTypes: isAlertType ? value : alarmType };
        await dispatch(getAlarmNames(payload));
    }

    const getLogGroupsNames = async (region) => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        const payload = { clientId, userId, region: region, apiToken };
        dispatch(logGroupsNames(payload));
    }

    let alarmNames;
    if (alarmType) {
        alarmNames = getAlarmNamesData[`${alarmType}s`];
    }

    return (
        <>
            <div class="modal" id="myModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Add Config</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label >Tools</label>
                                            <select name="monitoringToolId" onChange={(e) => {
                                                handleStateChange(e);
                                                setMonitoringToolId(e.target.value);
                                            }} value={monitoringToolId}>
                                                <option value="">Please Select</option>
                                                {
                                                    Array.isArray(toolsDetails) && toolsDetails.map((tool) => {
                                                        return <option key={tool.monitoringToolId} value={tool.monitoringToolId}>{tool.monitoringToolName}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                        {
                                            Number(monitoringToolId) !== 8 &&
                                            <div class="col-md-6">
                                                <label >Errors String</label>
                                                <input type="text" name="eventString" onChange={(e) => {
                                                    handleStateChange(e);
                                                    setEventString(e.target.value);
                                                }} />
                                            </div>
                                        }
                                        {
                                            Number(monitoringToolId) === 8 &&
                                            <div class="col-md-6">
                                                <label >Region</label>
                                                <select name="region" onChange={(e) => {
                                                    handleStateChange(e);
                                                    setRegion(e.target.value);
                                                }} value={region}>
                                                    <option value="">Please Select</option>
                                                    {
                                                        Array.isArray(getRegionAWS) && getRegionAWS.map((region, j) =>
                                                            <option name={region.region} title={region.region} key={j} value={region.id}>{region.region}</option>
                                                        )
                                                    }
                                                </select>
                                            </div>
                                        }
                                        {
                                            Number(monitoringToolId) === 8 &&
                                            <div class="col-md-6">
                                                <label >Event Type</label>
                                                <select name="eventType" onChange={(e) => {
                                                    handleStateChange(e);
                                                    setEventType(e.target.value);
                                                }} value={eventType}>
                                                    <option value="">Please Select</option>
                                                    {
                                                        Array.isArray(EVENT_TYPE) && EVENT_TYPE.map((eventType, j) =>
                                                            <option name={eventType} title={eventType} key={eventType} value={eventType}>{eventType}</option>
                                                        )
                                                    }
                                                </select>
                                            </div>
                                        }

                                        {
                                            eventType === "Log" && Number(monitoringToolId) === 8 &&
                                            /* log group */
                                            <div class="col-md-6">
                                                <label>Log Group</label>
                                                <select name="logGroup" onChange={(e) => {
                                                    handleStateChange(e);
                                                    setLogGroup(e.target.value);
                                                }} value={logGroup}>
                                                    <option value="">Please Select</option>
                                                    {
                                                        Array.isArray(logGroupsNamesObj) && logGroupsNamesObj.map((logGroup, j) =>
                                                            <option name={logGroup.logGroupName} title={logGroup.logGroupName} key={logGroup.logGroupName} value={logGroup.logGroupName}>{logGroup.logGroupName}</option>
                                                        )
                                                    }
                                                </select>
                                            </div>
                                        }
                                        {
                                            eventType === "Log" && Number(monitoringToolId) === 8 &&
                                            <div class="col-md-6">
                                                <label>Log Group Type</label>
                                                <select name="logGroupType" onChange={(e) => {
                                                    handleStateChange(e);
                                                    setLogGroupType(e.target.value)
                                                }} value={logGroupType}>
                                                    <option value="">Please Select</option>
                                                    {
                                                        Array.isArray(getLogGroupTypesData) && getLogGroupTypesData.map((groupType) =>
                                                            <option name={groupType.type} title={groupType.type} key={groupType.id} value={groupType.id}>{groupType.type}</option>
                                                        )
                                                    }
                                                </select>
                                            </div>
                                        }
                                        {
                                            eventType === "Alarm" && Number(monitoringToolId) === 8 &&
                                            /* log group */
                                            <div class="col-md-6">
                                                <label>Alarm Type</label>
                                                <select name="alarmType" onChange={(e) => {
                                                    handleStateChange(e);
                                                    setAlarmType(e.target.value);
                                                }} value={alarmType}>
                                                    <option value="">Please Select</option>
                                                    {
                                                        Array.isArray(ALARM_TYPES) && ALARM_TYPES.map((alarmType, j) =>
                                                            <option name={alarmType.name} title={alarmType.name} key={alarmType.value} value={alarmType.value}>{alarmType.name}</option>
                                                        )
                                                    }
                                                </select>
                                            </div>
                                        }
                                        {
                                            eventType === "Alarm" && Number(monitoringToolId) === 8 &&
                                            /* log group */
                                            <div class="col-md-6">
                                                <label>Alarm Name</label>
                                                <select name="alarmName" onChange={(e) => {
                                                    handleStateChange(e);
                                                    setAlarmName(e.target.value);
                                                }} value={alarmName}>
                                                    <option value="">Please Select</option>
                                                    {
                                                        Array.isArray(alarmNames) && alarmNames.map((alarmName, j) =>
                                                            <option name={alarmName.AlarmName} title={alarmName.AlarmName} key={j} value={alarmName.AlarmName}>{alarmName.AlarmName}</option>
                                                        )
                                                    }
                                                </select>
                                            </div>
                                        }
                                    </div>
                                    <div class="row">
                                        {/* <div class="col-md-6">
                                            <label>Template</label>
                                            <select name='templateId' onChange={(e) => { }}>
                                                <option>Active</option>
                                                <option></option>
                                            </select>
                                        </div> */}
                                        <div class="col-md-6">
                                            <label>Rule Name</label>
                                            <input type="text" name='eventConfigRuleName' onChange={({ target: { value } }) => setEventConfigRuleName(value)} value={eventConfigRuleName} />
                                        </div>
                                    </div>
                                    <br />
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="update">Update</button>
                            <button type="button" class="btn btn-cancel mr-auto" data-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default AddConfig;