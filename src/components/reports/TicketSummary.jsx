import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import ComponentHeader from '../resources/DashboardHeader';
import { fetchTicketSummary } from "./../../actions/reports/reportsMain";
import { failureToast } from '../../actions/commons/toaster';
import { generateToken } from '../../actions/commons/commonActions';
import { adminApiUrls, reportApiUrls } from "../../util/apiManager";
import './page.css';

function TicketSummary() {

    const dispatch = useDispatch();
    const { featureId, userId, getAllMasterData, requestClientName } = useSelector(state => ({
        // clientId: state.current_client.payload ? state.current_client.payload.client : "",
        featureId: state.clientUserFeatures?.featureIds?.["reports"],
        userId: state.current_user.payload ? state.current_user.payload.userId : "",
        requestClientName: Array.isArray(state.userClients) ? state.userClients : [],
        getAllMasterData: state?.getAllMasterData && Array.isArray(state.getAllMasterData) && state.getAllMasterData.length ? state.getAllMasterData[0] : {},
    }));
    const [client, setClient] = useState('');
    const [groups, setGroups] = useState([]);
    const [groupId, setGroupId] = useState('');
    const [type, setType] = useState('');
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');
    const [isSlaBreached, setSlaBreached] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [ticketSummary, setTicketSummary] = useState([])
    const { stateList, priorityList, ticketType } = getAllMasterData || {};

    const onReset = (e) => {
        e.preventDefault();
        setClient('');
        setGroups('');
        setGroupId('');
        setType('');
        setPriority('');
        setStatus('');
        setSlaBreached('');
        setStartDate('');
        setEndDate('');
        setTicketSummary('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let request = { isSlaBreached, typeId: type, statusId: status, priorityId: priority, groupId, userId, featureId };
        if (!startDate) {
            return failureToast("Please Enter 'From Date'");
        }
        if (!endDate) {
            return failureToast("Please Enter 'To Date'");
        }

        let toDate = endDate + "T23:59:59.999Z"
        let fromDate = new Date(startDate).toISOString();
        if (toDate < fromDate) {
            return failureToast("'From Date' should be Prior to 'To Date'");
        }
        request['endDate'] = toDate;
        request['startDate'] = fromDate;
        request['clientId'] = client;
        dispatch(generateToken())
            .then((data) => {
                const { generateToken: apiToken } = data;
                dispatch(fetchTicketSummary(request, apiToken))
                    .then((res) => {
                        if (res && res.ticketSummary.status !== 200) {
                            const message = typeof res.ticketSummary.message === "string" ? res.ticketSummary.message : "Something went wrong. Please try again!";
                            return failureToast(message);
                        }
                        const data = res.ticketSummary?.data?.ticketDetails || [];
                        setTicketSummary(data);
                    }).catch(() => {
                        failureToast("Something went wrong. Please try again!");
                    });
            }).catch(() => failureToast("Something went wrong. Please try again!"));
    }

    const getGroups = async (value) => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        axios.get(`${adminApiUrls.getGroups_v2}?clientId=${value}&userId=${userId}&apiToken=${apiToken}&featureId=${featureId}`)
            .then((res) => {
                if (res && res.data?.status !== 200) {
                    const { message } = res.data;
                    const text = typeof message === "string" ? message : "Something went while retrieving teams!";
                    return failureToast(text);
                }
                setGroups(res.data["data"]);
            }).catch((err) => {
                failureToast("Something went while retrieving teams!");
            });
    }

    const exportToExcel = async (e) => {
        e.preventDefault();
        let excelRequest = { clientId: client, isSlaBreached, typeId: type, statusId: status, priorityId: priority, groupId, userId, featureId };
        if (!startDate) {
            return failureToast("Please Enter 'From Date'");
        }

        if (!endDate) {
            return failureToast("Please Enter 'To Date'");
        }

        let toDate = new Date(endDate);
        let fromDate = new Date(startDate);
        if (toDate < fromDate) {
            return failureToast("'From Date' should be Prior to 'To Date'");
        }
        excelRequest.endDate = endDate + "T23:59:59.999Z";
        excelRequest.startDate = new Date(startDate).toISOString();
        dispatch(generateToken())
            .then(function (data) {
                var url = reportApiUrls.summaryExcelReport + "?fromDate=" + excelRequest.startDate + "&toDate=" + excelRequest.endDate +
                    "&clientId=" + excelRequest.clientId + "&userId=" + excelRequest.userId + "&apiToken=" + data.generateToken + "&featureId=" + excelRequest.featureId;
                if (!excelRequest.priorityId) {
                    url = url + "&priorityId=" + excelRequest.priorityId
                }
                if (!excelRequest.groupId) {
                    url = url + "&deptId=" + excelRequest.groupId
                }
                if (!excelRequest.typeId) {
                    url = url + "&typeId=" + excelRequest.typeId
                }
                if (!excelRequest.statusId) {
                    url = url + "&state=" + excelRequest.statusId
                }
                if (!excelRequest.isSlaBreached) {
                    url = url + "&isSlaBreached=" + excelRequest.isSlaBreached
                }
                window.open(url);
            }).catch(function (err) {
                failureToast(err)
            });
    }

    const getTableColumn = ['ID', 'Type', 'Prority', 'Created', 'Description', 'Status', 'Assigned To', 'Customer', 'AGE HRS', 'Is SLA Breached']
    return (
        <>
            <ComponentHeader
                dashboardText={[{ name: 'Reports', className: "component-head-text " }]}
                headerClass=""
                hasShowBreadcrumb
                breadCrumb={[{ name: 'Reports', path: '/reports' }, { name: 'Ticket Summary', path: '' }]}
            />
            <div className="page">
                <div className="bg-wh" >
                    <form>
                        <div class="form-group">
                            <div class="flex-wrap">
                                <div class="flex-div">
                                    <label>Client</label>
                                    <select name="status" onChange={({ target: { value } }) => {
                                        getGroups(value);
                                        setClient(value);
                                        setGroupId('');
                                    }} value={client} >
                                        <option value=''>Select Client</option>
                                        {
                                            Array.isArray(requestClientName) && requestClientName.map(clientList =>
                                                <option name={clientList.name} title={clientList.name} value={clientList.clientId}>{clientList.name}</option>)
                                        }
                                    </select>
                                </div>
                                <div class="flex-div">
                                    <label>Team</label>
                                    <select name="groupId" onChange={({ target: { value } }) => setGroupId(value)} value={groupId} >
                                        <option value="">Select Team</option>
                                        {
                                            Array.isArray(groups) && groups.map((team) =>
                                                <option key={team.groupId} value={team.groupId}>{team.name}</option>)}
                                    </select>
                                </div>
                                <div class="flex-div">
                                    <label>Type</label>
                                    <select name="type" onChange={({ target: { value } }) => setType(value)} value={type} >
                                        <option value="">Select Type</option>
                                        {
                                            ticketType.map((type) =>
                                                <option key={type.id} value={type.id}>{type.name}</option>)
                                        }
                                    </select>
                                </div>
                                {/*  */}
                                <div class="flex-div">
                                    <label>Priority</label>
                                    <select name="priority" onChange={({ target: { value } }) => setPriority(value)} value={priority} >
                                        <option value="">Select Priority</option>
                                        {
                                            priorityList.map((priority) =>
                                                <option key={priority.id} value={priority.id}>{priority.name}</option>)
                                        }
                                    </select>
                                </div>
                                <div class="flex-div">
                                    <label>Status</label>
                                    <select name="status" onChange={({ target: { value } }) => setStatus(value)} value={status} >
                                        <option value="">Select Status</option>
                                        {
                                            stateList.map((state) =>
                                                <option key={state.id} value={state.id}>{state.name}</option>)
                                        }
                                    </select>
                                </div>
                                <div class="flex-div">
                                    <label>Is SLA Breached ?</label>
                                    <select name="isSlaBreached" onChange={({ target: { value } }) => setSlaBreached(value)} value={isSlaBreached} >
                                        <option value="">Please Select</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                                {/*  */}
                                <div class="flex-div">
                                    <label>From Date</label>
                                    <input id="datepicker" onChange={({ target: { value } }) => setStartDate(value)} name="startDate" title="From Date" type="date" placeholder='Start Date' value={startDate} />
                                </div>
                                <div class="flex-div">
                                    <label>To Date</label>
                                    <input id="datepicker" onChange={({ target: { value } }) => setEndDate(value)} name="endDate" title="End Date" type="date" placeholder='End Date' value={endDate} max={new Date().toISOString().split("T")[0]} />
                                </div>
                            </div>
                        </div>
                        <div class="button-align-div">
                            <button class="button_cls_light" onClick={handleSubmit}>Query</button>
                            <button class="button_cls_light" onClick={onReset}>Reset</button>
                            <button class="button_cls_dark" onClick={exportToExcel}>Export Excel</button>
                        </div>
                        <div className='form-group'>
                            <div className='margin-set'>
                                Total Count of Tickets: {!ticketSummary || !Array.isArray(ticketSummary) ? 0 : ticketSummary.length}
                            </div>
                        </div>
                        <div className='form-group' id='reports'>
                            <table className="table table-hover my-table">
                                <thead>
                                    <tr>
                                        {
                                            getTableColumn.map(column =>
                                                <th key={column}><span className="th-text">{column}</span></th>)
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(ticketSummary) && ticketSummary.map((data) => {
                                        return (
                                            <tr key={data.ticketId}>
                                                <td title={data.ticketId}>{data.ticketId}</td>
                                                <td title={data.ticketTypeName}>{data.ticketTypeName}</td>
                                                <td title={data.priorityName}>{data.priorityName}</td>
                                                <td title={data.createdDate}>{window.DateTimeParser(data.createdDate)}</td>
                                                <td className='table-data-elipse' title={data.subject}>{data.subject}</td>
                                                <td title={data.status}>{data.status}</td>
                                                <td title={data.userName}>{data.userName}</td>
                                                <td title={data.customerName}>{data.customerName}</td>
                                                {/* <td >{data.status === "Open" ? 'No' : 'Yes'}</td> */}
                                                <td title={data.ageHrs}>{data.ageHrs}</td>
                                                <td>{data.isSlaBreached === 1 ? "Yes" : "No"}</td>
                                            </tr>
                                        )
                                    })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}


export default TicketSummary;