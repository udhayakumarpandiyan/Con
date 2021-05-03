import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ComponentHeader from '../resources/DashboardHeader';
import { reportApiUrls } from "../../util/apiManager";
import { failureToast } from '../../actions/commons/toaster';
import { generateToken } from '../../actions/commons/commonActions';
import './page.css';

export default function UserReport() {

    const [clientId, setClient] = useState('');
    const [statusId, setStatus] = useState('');
    const dispatch = useDispatch();
    const { featureId, userId, getAllMasterData: { statusList }, requestClientName, masterClient } = useSelector(state => ({
        featureId: state.clientUserFeatures?.featureIds?.["reports"],
        userId: state.current_user.payload ? state.current_user.payload.userId : "",
        requestClientName: Array.isArray(state.userClients) ? state.userClients : [],
        getAllMasterData: state?.getAllMasterData && Array.isArray(state.getAllMasterData) && state.getAllMasterData.length ? state.getAllMasterData[0] : {},
        masterClient: state?.masterClient
    }));

    const exportToExcel = () => {

    }
    const onReset = (e) => {
        e.preventDefault();
        setClient('');
        setStatus('');
    }


    const getQuerystringForUserReportExcel = (userId, featureId, clientId, statusId, generateToken) => {
        let masterClientID = masterClient.clientId;
        let queryString = "";
        let queryStringTxt = `?clientId=${masterClientID}&actionBy=${userId}&apiToken=${generateToken}&featureId=${featureId}`;
        if (!statusId && !clientId) {
            queryString = queryStringTxt;
        }
        if (statusId && !clientId) {
            queryString = `${queryStringTxt}&status=${statusId}`;
        }
        if (clientId && !statusId) {
            queryString = `${queryStringTxt}&reportByclientId=${clientId}`;
        }
        if (clientId && statusId) {
            queryString = `${queryStringTxt}&status=${statusId}&reportByclientId=${clientId}`;
        }
        return queryString;
    }

    const exportExcel = (e) => {
        e.preventDefault();
        dispatch(generateToken())
            .then((data) => {
                let queryString = getQuerystringForUserReportExcel(userId, featureId, clientId, statusId, data.generateToken);
                let url = reportApiUrls.userReportForExcel + queryString;
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
                breadCrumb={[{ name: 'Reports', path: '/reports' }, { name: 'Users Report', path: '' }]}
            />

            <div className="page">
                <div className="bg-wh" >
                    <form>
                        <div class="form-group">
                            <div class="flex-wrap">
                                <div class="flex-div">
                                    <label>Client</label>
                                    <select value={clientId} onChange={({ target: { value } }) => setClient(value)} >
                                        <option value=''>Select Client</option>
                                        {
                                            Array.isArray(requestClientName) && requestClientName.map(clientList =>
                                                <option name={clientList.name} title={clientList.name} value={clientList.clientId}>{clientList.name}</option>)
                                        }
                                    </select>
                                </div>
                                <div class="flex-div">
                                    <label>Status</label>
                                    <select value={statusId} onChange={({ target: { value } }) => setStatus(value)} >
                                        <option value=''>Select Status</option>
                                        {
                                            Array.isArray(statusList) && statusList.map(status =>
                                                <option name={status.id} title={status.name} value={status.id}>{status.name}</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="button-align-div">
                            <button class="button_cls_light" onClick={onReset}>Reset</button>
                            <button class="button_cls_dark" onClick={exportExcel}>Export Excel</button>
                        </div>
                    </form>
                </div>
            </div>

        </>
    )
}