import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from "lodash";
import Select from 'react-select';
import ComponentHeader from '../resources/DashboardHeader';
import { fetchUsersForClients, fetchUsersTickets } from "./../../actions/reports/reportsMain"
import { failureToast } from '../../actions/commons/toaster';
import { generateToken } from '../../actions/commons/commonActions';
import { reportApiUrls } from "../../util/apiManager";
import './page.css';

function OpenTickets() {

    const dispatch = useDispatch();
    const { featureId, userId, clientId, userClients } = useSelector(state => ({
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        featureId: state.clientUserFeatures?.featureIds?.["reports"],
        userId: state.current_user.payload ? state.current_user.payload.userId : "",
        userClients: state.userClients
    }));
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [clientOptions, setClientOptions] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [selectedClient, setSelectedClient] = useState([]);
    const [userOpenTickets, setOpenTickets] = useState([]);

    const getClients = () => {
        let userList = Array.isArray(userClients) && userClients.map(x => ({
            'value': x.clientId,
            'label': x.name
        }));
        setClientOptions(userList)
    }

    useEffect(() => { getClients() }, [])

    const getUsersForClients = async (client) => {
        let reqPayload = {
            userId: userId,
            clientId: clientId,
            clientIds: client.map(x => x.value)
        }
        try {
            const { generateToken: apiToken } = await dispatch(generateToken());
            reqPayload.apiToken = apiToken;
            dispatch(fetchUsersForClients(reqPayload))
                .then((res) => {
                    const { message, status, data } = res.usersForClients;
                    if (status && status === 200) {
                        return getUsers(data);
                    }
                }).catch(function (err) {
                })
        } catch (error) {
        }
    }
    const getUsers = (usersForClients) => {
        let userList = Array.isArray(usersForClients) && usersForClients.map(x => ({
            'value': x.userId,
            'label': x.name
        }))
        setUserOptions(userList);
    }

    const onReset = (e) => {
        e.preventDefault();
        setStartDate('');
        setEndDate('');
        setSelectedUser([]);
        setSelectedClient([]);
        setOpenTickets([]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
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
        let request = {
            toDate: toDate,
            fromDate: fromDate,
            userId: userId,
            clientIds: selectedClient.map(x => x.value),
            userIds: selectedUser.map(x => x.value)
        }
        dispatch(generateToken())
            .then((data) => {
                const { generateToken: apiToken } = data;
                request['apiToken'] = apiToken;
                dispatch(fetchUsersTickets(request))
                    .then((res) => {
                        if (res && res.userOpenTickets.status !== 200) {
                            const { message } = res.userOpenTickets;
                            const text = typeof message === "string" ? message : "Something went wrong. Please try again!";
                            failureToast(text);
                        }
                        const data = res.userOpenTickets?.data || [];
                        setOpenTickets(data);
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
                var url = reportApiUrls.userTicketsCountExcel + "?fromDate=" + excelRequest.startDate + "&toDate=" + excelRequest.endDate +
                    "&clientId=" + excelRequest.clientId + "&userId=" + excelRequest.userId + "&apiToken=" + data.generateToken + "&featureId=" + excelRequest.featureId;
                if (selectedClient.length) {
                    url = url + "&clientIds=" + selectedClient.map(x => x.value).toString()
                }
                if (selectedUser.length) {
                    url = url + "&userIds=" + selectedUser.map(x => x.value).toString()
                }
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
                breadCrumb={[{ name: 'Reports', path: '/reports' }, { name: 'Open Tickets', path: '' }]}
            />
            <div className="page">
                <div className="bg-wh" >
                    <form>
                        <div class="form-group">
                            <div class="flex-wrap">
                                <div class="flex-div-40">
                                    <label>From Date</label>
                                    <input onChange={({ target: { value } }) => setStartDate(value)} name="startDate" title="From Date" type="date" placeholder='Start Date' value={startDate} />
                                </div>
                                <div class="flex-div-40">
                                    <label>To Date</label>
                                    <input onChange={({ target: { value } }) => setEndDate(value)} name="endDate" title="End Date" type="date" placeholder='End Date' value={endDate} max={new Date().toISOString().split("T")[0]} />
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="flex-wrap">
                                <div class="flex-div-40">
                                    <label>Select Clients</label>
                                    <Select
                                        isMulti
                                        onChange={(data) => {
                                            setSelectedClient(data);
                                            if (!data.length) {
                                                setSelectedUser([]);
                                                return setUserOptions([]);
                                            }
                                            getUsersForClients(data);
                                        }}
                                        options={clientOptions}
                                        value={selectedClient}
                                        placeholder="Select Clients"
                                    />
                                </div>
                                <div class="flex-div-40">
                                    <label>Select Users</label>
                                    <Select
                                        isMulti
                                        onChange={setSelectedUser}
                                        options={userOptions}
                                        value={selectedUser}
                                        placeholder="Select Users"
                                    />
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
                                        <th className='text-center'>S.No</th>
                                        <th className='text-center'>User Name</th>
                                        <th className='text-center'>Open Tickets Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userOpenTickets && Array.isArray(userOpenTickets) && userOpenTickets.map((data, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className='text-center'>{index + 1}</td>
                                                <td className='text-center'>{data.userName}</td>
                                                <td className='text-center'>{data.count}</td>
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

export default OpenTickets;