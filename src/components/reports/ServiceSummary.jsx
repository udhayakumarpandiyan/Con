import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from "lodash";
import ComponentHeader from '../resources/DashboardHeader';
import { fetchServiceSummary } from "./../../actions/reports/reportsMain";
import { failureToast } from '../../actions/commons/toaster';
import { generateToken } from '../../actions/commons/commonActions';
import { reportApiUrls } from "../../util/apiManager";
import './page.css';

function ServiceSummary() {

    const dispatch = useDispatch();
    const { featureId, userId, clientId, userName } = useSelector(state => ({
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        userName: state.current_user && state.current_user.payload.userName,
        featureId: state.clientUserFeatures?.featureIds?.["reports"],
        userId: state.current_user.payload ? state.current_user.payload.userId : ""
    }));
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [serviceSummary, setServiceSummary] = useState([])

    const onReset = (e) => {
        e.preventDefault();
        setStartDate('');
        setEndDate('');
        setServiceSummary('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let request = { userId, featureId, clientId, createdBy: userName };
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
        dispatch(generateToken())
            .then((data) => {
                const { generateToken: apiToken } = data;
                dispatch(fetchServiceSummary(request, apiToken))
                    .then((res) => {
                        if (res && res.serviceSummary.status !== 200) {
                            const { message } = res.serviceSummary;
                            const text = typeof message === "string" ? message : "Something went wrong. Please try again!";
                            failureToast(text);
                        }
                        const data = res.serviceSummary?.data || [];
                        setServiceSummary(data);
                    }).catch(() => {
                        failureToast("Something went wrong. Please try again!");
                    });
            }).catch(() => failureToast("Something went wrong. Please try again!"));
    }

    const exportToExcel = async (e) => {
        e.preventDefault();
        let excelRequest = { clientId, userId, featureId };
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
                var url = reportApiUrls.exportExcelReport + "?fromDate=" + excelRequest.startDate + "&toDate=" + excelRequest.endDate +
                    "&clientId=" + excelRequest.clientId + "&userId=" + excelRequest.userId + "&apiToken=" + data.generateToken + "&featureId=" + excelRequest.featureId;
                window.open(url);
            }).catch(function (err) {
                failureToast(err)
            });
    }


    const getServiceSummaryPriority = () => {
        const { ticketSummaryByPriority } = serviceSummary;
        if (Array.isArray(ticketSummaryByPriority) && ticketSummaryByPriority.length) {
            var lastObj = _.last(ticketSummaryByPriority, 1);
            return ticketSummaryByPriority.map((data, index) =>
                data.hasOwnProperty("totalOpenTicketsCount") ?
                    (<tr key={index}>
                        <td>{"Total"}</td>
                        <td>{lastObj.totalOpenTicketsCount > 0 ? lastObj.totalOpenTicketsCount : 0}</td>
                        <td>{lastObj.totalClosedTicketsCount > 0 ? lastObj.totalClosedTicketsCount : 0}</td>
                        <td>{""}</td>
                        <td>{""}</td>
                        <td>{lastObj.totalSlaBreachedCount > 0 ? lastObj.totalSlaBreachedCount : 0}</td>
                    </tr>) :
                    (<tr key={index}>
                        <td>{data.priority}</td>
                        <td>{data.openTicketsCount > 0 ? data.openTicketsCount : 0}</td>
                        <td>{data.closedTicketsCount > 0 ? data.closedTicketsCount : 0}</td>
                        <td>{data.avgResponseTime > 0 ? data.avgResponseTime : 0}</td>
                        <td>{data.avgClosureTime > 0 ? data.avgClosureTime : 0}</td>
                        <td>{data.slaBreachedCount > 0 ? data.slaBreachedCount : 0}</td>
                    </tr>)
            );
        }
        return (<tr>
            <td>{""}</td>
            <td>{0}</td>
            <td>{0}</td>
            <td>{0}</td>
            <td>{0}</td>
            <td>{0}</td>
        </tr>)
    }

    const getServiceSummaryCategory = () => {
        const { ticketSummaryByCategory } = serviceSummary;
        if (Array.isArray(ticketSummaryByCategory) && ticketSummaryByCategory.length) {
            var lastObj = _.last(ticketSummaryByCategory, 1);
            return ticketSummaryByCategory.map((data, index) =>
                data.hasOwnProperty("totalOpenTicketsCount") ?
                    (<tr key={index}>
                        <td>{"Total"}</td>
                        <td>{lastObj.totalOpenTicketsCount > 0 ? lastObj.totalOpenTicketsCount : 0}</td>
                        <td>{lastObj.totalClosedTicketsCount > 0 ? lastObj.totalClosedTicketsCount : 0}</td>
                        <td>{""}</td>
                        <td>{""}</td>
                        <td>{lastObj.totalSlaBreachedCount > 0 ? lastObj.totalSlaBreachedCount : 0}</td>
                    </tr>) :
                    (<tr key={index}>
                        <td>{data.ticketType}</td>
                        <td>{data.openTicketsCount > 0 ? data.openTicketsCount : 0}</td>
                        <td>{data.closedTicketsCount > 0 ? data.closedTicketsCount : 0}</td>
                        <td>{data.avgResponseTime > 0 ? data.avgResponseTime : 0}</td>
                        <td>{data.avgClosureTime > 0 ? data.avgClosureTime : 0}</td>
                        <td>{data.slaBreachedCount > 0 ? data.slaBreachedCount : 0}</td>
                    </tr>)
            );
        }
        return (<tr>
            <td>{""}</td>
            <td>{0}</td>
            <td>{0}</td>
            <td>{0}</td>
            <td>{0}</td>
            <td>{0}</td>
        </tr>)
    }

    const getServiceSummaryStaff = () => {
        const { tickeAssignedToStaff } = serviceSummary;
        if (Array.isArray(tickeAssignedToStaff) && tickeAssignedToStaff.length) {
            var lastObj = _.last(tickeAssignedToStaff, 1);
            return tickeAssignedToStaff.map((data, index) =>
                data.hasOwnProperty("totalOpenTicketsCount") ?
                    (<tr key={index}>
                        <td>{"Total"}</td>
                        <td>{lastObj.totalOpenTicketsCount > 0 ? lastObj.totalOpenTicketsCount : 0}</td>
                        <td>{lastObj.totalClosedTicketsCount > 0 ? lastObj.totalClosedTicketsCount : 0}</td>
                        <td>{""}</td>
                        <td>{""}</td>
                        <td>{lastObj.totalSlaBreachedCount > 0 ? lastObj.totalSlaBreachedCount : 0}</td>
                    </tr>) :
                    (<tr key={index}>
                        <td>{data.userName}</td>
                        <td>{data.openTicketsCount > 0 ? data.openTicketsCount : 0}</td>
                        <td>{data.closedTicketsCount > 0 ? data.closedTicketsCount : 0}</td>
                        <td>{data.avgResponseTime > 0 ? data.avgResponseTime : 0}</td>
                        <td>{data.avgClosureTime > 0 ? data.avgClosureTime : 0}</td>
                        <td>{data.slaBreachedCount > 0 ? data.slaBreachedCount : 0}</td>
                    </tr>)
            );
        }
        return (<tr>
            <td>{""}</td>
            <td>{0}</td>
            <td>{0}</td>
            <td>{0}</td>
            <td>{0}</td>
            <td>{0}</td>
        </tr>)
    }
    return (
        <>
            <ComponentHeader
                dashboardText={[{ name: 'Reports', className: "component-head-text " }]}
                headerClass=""
                hasShowBreadcrumb
                breadCrumb={[{ name: 'Reports', path: '/reports' }, { name: 'Service Summary', path: '' }]}
            />
            <div className="page">
                <div className="bg-wh" >
                    <form>
                        <div class="form-group">
                            <div class="flex-wrap">
                                <div class="flex-div">
                                    <label>From Date</label>
                                    <input onChange={({ target: { value } }) => setStartDate(value)} name="startDate" title="From Date" type="date" placeholder='Start Date' value={startDate} />
                                </div>
                                <div class="flex-div">
                                    <label>To Date</label>
                                    <input onChange={({ target: { value } }) => setEndDate(value)} name="endDate" title="End Date" type="date" placeholder='End Date' value={endDate} max={new Date().toISOString().split("T")[0]} />
                                </div>
                            </div>
                        </div>
                        <div class="button-align-div">
                            <button class="button_cls_light" onClick={handleSubmit}>Query</button>
                            <button class="button_cls_light" onClick={onReset}>Reset</button>
                            <button class="button_cls_dark" onClick={exportToExcel}>Export Excel</button>
                        </div>
                        <h6 style={{
                            color: "rgb(0, 114, 255)",
                            fontSize: "17px"
                        }}>Based on Priority</h6>
                        <div className='form-group' id='reports'>
                            <table className="table table-hover my-table">
                                <thead>
                                    <tr>
                                        <th>Priority</th>
                                        <th>Open Tickets</th>
                                        <th>Closed Tickets</th>
                                        <th>Avg. Response time</th>
                                        <th>Avg.Closure Time</th>
                                        <th>SLA Breached Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getServiceSummaryPriority()}
                                </tbody>
                            </table>
                        </div>
                        <h6 style={{
                            color: "rgb(0, 114, 255)",
                            fontSize: "17px"
                        }}>Based on Category</h6>
                        <div className='form-group' id='reports'>
                            <table className="table table-hover my-table">
                                <thead>
                                    <tr className="table-head">
                                        <th>Category</th>
                                        <th>Open Tickets</th>
                                        <th>Closed Tickets</th>
                                        <th>Avg. Response time</th>
                                        <th>Avg.Closure Time</th>
                                        <th>SLA Breached Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getServiceSummaryCategory()}
                                </tbody>
                            </table>
                        </div>
                        <h6 style={{
                            color: "rgb(0, 114, 255)",
                            fontSize: "17px"
                        }}>Based on Staff</h6>
                        <div className='form-group' id='reports'>
                            <table className="table table-hover my-table">
                                <thead>
                                    <tr className="table-head">
                                        <th>Staff Name</th>
                                        <th>Open Tickets</th>
                                        <th>Closed Tickets</th>
                                        <th>Avg. Response time</th>
                                        <th>Avg.Closure Time</th>
                                        <th>SLA Breached Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getServiceSummaryStaff()}
                                </tbody>
                            </table>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}


export default ServiceSummary;