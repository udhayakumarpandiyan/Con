import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ComponentHeader from '../resources/DashboardHeader';
import { fetchPolicyReport } from "./../../actions/reports/reportsMain";
import { failureToast } from '../../actions/commons/toaster';
import { generateToken } from '../../actions/commons/commonActions';


function RetensionPolicy() {

    const dispatch = useDispatch();
    const { userId, clientId, policyReport } = useSelector(state => ({
        clientId: state.current_client.payload ? state.current_client.payload.client : "",
        userId: state.current_user.payload ? state.current_user.payload.userId : "",
        policyReport: state.policyReport && state.policyReport.data && state.policyReport.data.logsData ? state.policyReport.data.logsData : []
    }));

    const getPolicyReport = async () => {
        try {
            const { generateToken: apiToken } = await dispatch(generateToken());
            dispatch(fetchPolicyReport(userId, apiToken))
                .then((res) => {
                    if (res && res.policyReport.status !== 200) {
                        const { message } = res.policyReport;
                        const text = typeof message === "string" ? message : "Something went wrong. Please try again!";
                        return failureToast(text);
                    }
                });
        } catch (err) {
            failureToast("Something went wrong. Please try again!");
        }
    }

    useEffect(() => { getPolicyReport() }, [clientId])

    return (
        <>
            <ComponentHeader
                dashboardText={[{ name: 'Reports', className: "component-head-text " }]}
                headerClass=""
                hasShowBreadcrumb
                breadCrumb={[{ name: 'Reports', path: '/reports' }, { name: 'Retension Policy', path: '' }]}
            />
            <div className="page">
                <div className="bg-wh" >
                    <div className='form-group' id='reports'>
                        <table className="table table-hover my-table">
                            <thead>
                                <tr>
                                    <th>ClientName</th>
                                    <th>Backup Retention Policy (days)</th>
                                    <th>Log Retention Policy (days)</th>
                                    <th>SIEM Log Retention Policy (months)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Array.isArray(policyReport) && policyReport.map((data) =>
                                        <tr key={data.clientName}>
                                            <td> {data.clientName}</td>
                                            <td>{data.logsVal[0].periodVal}</td>
                                            <td>{data.logsVal[1].periodVal}</td>
                                            <td>{data.logsVal[2].periodVal}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}


export default RetensionPolicy;