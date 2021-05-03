import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import ComponentHeader from '../resources/DashboardHeader';

function GenerateReport() {

    let history = useHistory();
    const getTableColumn = ['S.no', 'Reports', 'Description']

    const getTableBody = [
        { sNo: 1, name: 'Ticket Summary', description: 'Summary of all tickets logged for a time period, exportable as an Excel Report' },
        { sNo: 2, name: 'Service Summary', description: 'Summary report of the infrastructure managed through the system including SLA compliance, activities' },
        { sNo: 3, name: 'Retention Policy Summary', description: 'Summary report of all the clients Retention Policy(copiable into MS Excel)' },
        { sNo: 4, name: 'User Management Tickets', description: 'Summary report of tickets which are created to manage Users' },
        { sNo: 5, name: 'Client Management Tickets', description: 'Summary report of tickets which are created to manage Clients' },
        { sNo: 6, name: 'Open Tickets', description: 'Summary report of open tickets' },
        { sNo: 7, name: 'User Report', description: 'Download user report' }
    ]

    const paths = ['/reports/ticket-summary', '/reports/service-summary', '/reports/retention-policy-summary',
        '/reports/user-management-tickets', '/reports/client-management-tickets', '/reports/open-tickets', '/reports/user-report']
    return (
        <>
            <ComponentHeader
                dashboardText={[{ name: 'REPORTS' }]}
            />
            <div className="page" id='reports'>
                <div className="bg-wh" >
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
                            {
                                getTableBody.map((item, index) =>
                                    <tr key={item.name} onClick={() => history.push(paths[index])}>
                                        <td >{item.sNo}</td>
                                        <td >{item.name}</td>
                                        <td >{item.description}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default GenerateReport;