import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from "lodash";
import ComponentHeader from '../resources/DashboardHeader';
import { fetchClientReport } from "./../../actions/reports/reportsMain"
import { failureToast } from '../../actions/commons/toaster';
import { generateToken } from '../../actions/commons/commonActions';
import { reportApiUrls } from "../../util/apiManager";
import './page.css';

function ClientManagementTickets() {

    const dispatch = useDispatch();
    const { featureId, userId, clientId, userName, ticketsFeatureId } = useSelector(state => ({
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        userName: state.current_user && state.current_user.payload.userName,
        featureId: state.clientUserFeatures?.featureIds?.["reports"],
        ticketsFeatureId: state.clientUserFeatures?.featureIds?.["Tickets"],
        userId: state.current_user.payload ? state.current_user.payload.userId : ""
    }));
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [clientReport, setClientReport] = useState([])

    const onReset = (e) => {
        e.preventDefault();
        setStartDate('');
        setEndDate('');
        setClientReport('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let request = { userId };
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
        request['toDate'] = toDate;
        request['fromDate'] = fromDate;
        dispatch(generateToken())
            .then((data) => {
                const { generateToken: apiToken } = data;
                request['apiToken'] = apiToken;
                dispatch(fetchClientReport(request))
                    .then((res) => {
                        if (res && res.clientReport.status !== 200) {
                            const { message } = res.clientReport;
                            const text = typeof message === "string" ? message : "Something went wrong. Please try again!";
                            failureToast(text);
                        }
                        const data = res.clientReport?.data || [];
                        setClientReport(data);
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
                var url = reportApiUrls.clientExcelReport + "?fromDate=" + excelRequest.startDate + "&toDate=" + excelRequest.endDate +
                    "&clientId=" + excelRequest.clientId + "&userId=" + excelRequest.userId + "&apiToken=" + data.generateToken + "&featureId=" + excelRequest.featureId;
                window.open(url);
            }).catch(function (err) {
                failureToast(err)
            });
    }

    return (
        <>
            <ComponentHeader
                dashboardText={[{ name: 'Reports', className: "component-head-text " }]}
                headerClass=""
                hasShowBreadcrumb
                breadCrumb={[{ name: 'Reports', path: '/reports' }, { name: 'Client Management Report', path: '' }]}
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

                        <div className='form-group' id='reports'>
                            <table className="table table-hover my-table">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Ticket ID</th>
                                        <th>Requested Action</th>
                                        <th>Created Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientReport && Array.isArray(clientReport.ticketDetails) && clientReport.ticketDetails.map((data, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {
                                                        data.ticketId && <a style={{ textDecoration: "underline" }} target="_blank"
                                                            href={`/ticket-list/${data.ticketId}?featureId=${ticketsFeatureId}&clientId=${data.clientId}`}>
                                                            {data.ticketId}</a>
                                                    }
                                                </td>
                                                <td>{data.requestType}</td>
                                                <td>{window.DateTimeParser(data.createdDate)}</td>
                                                <td>{data.status}</td>
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

export default ClientManagementTickets;