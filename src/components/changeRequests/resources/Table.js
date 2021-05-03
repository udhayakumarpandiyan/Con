import React from 'react';
import { CHANGE_REQUESTS_TABLE_COLUMNS } from './enum';
import SLATimerIcon from '../../resources/SLATimerIcon';

export default function Table(props) {
    const { data, currentPage, itemsPerPage, onSearchClick, onActivityClick, onObseleteClick, onCopyClick, onTicketClick } = props;
    const priority_icons = ['emergency-icon.svg', 'high-icon.svg', 'low-icon.svg', 'normal-icon.svg', 'exception-icon.svg', 'emrg.svg', 'excp.svg'];
    const formatDateString = (dateString) => {
        if (dateString) {
            let formatDate = new Date(dateString);
            let month = formatDate.getMonth() + 1;
            let date = formatDate.getDate();
            date = date < 10 ? `0${date}` : date;
            month = month < 10 ? `0${month}` : month;
            return `${formatDate.getFullYear()}-${month}-${date}`;
        }
        return "";
    }

    const getPath = (row) => {
        let typeName = row.typeName ? row.typeName.toLowerCase() : "";
        typeName = typeName === "stnd" ? "high" : typeName;
        let iconIndex = -1;
        if (typeName.length > 0) {
            iconIndex = priority_icons.findIndex(priority => priority.includes(typeName));
        }
        let path = '';
        if (iconIndex > -1) {
            path = priority_icons[iconIndex];
            path = require(`../../assets/Tickets/${path}`);
        }

        return path;
    }
    return (
        <>
            <table className="table table-hover cr-table">
                <thead>
                    <tr>
                        {
                            Array.isArray(CHANGE_REQUESTS_TABLE_COLUMNS) && CHANGE_REQUESTS_TABLE_COLUMNS.map((column, index) =>
                                <th width={index === 0 ? 60 : ''} key={column.displayName} className={column.className}><span className="th-text change-request-details-table-th">{column.displayName}</span></th>)
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        Array.isArray(data) && data.map((activity, index) =>
                        (
                            <tr key={activity.activityId} className="change-request-table-row">
                                {
                                    currentPage === 1 ? <td>{index + 1}</td> : <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                }
                                <td className="change-request-table-td-activity" style={{ width: '100px' }} title={activity.activityId}>{activity.activityId}</td>
                                <td className="change-request-table-td-normal" title={activity.activity}
                                    disabled={(activity.stateName?.toLowerCase() === "obsolete") ? true : false}
                                    style={{ color: (activity.stateName?.toLowerCase() === "obsolete") ? "" : "blue" }}>
                                    <a id="activityLink" onClick={(activity.stateName?.toLowerCase() === "obsolete") ? () => { } : () => onActivityClick(activity)}>{activity.activity}</a>
                                </td>
                                <td title={activity.typeName} >
                                    <span className="priority high" style={{ marginRight: '3px' }}>
                                        <img src={getPath(activity)} style={{ paddingBottom: '2px' }} />
                                    </span>
                                    {activity.typeName}
                                </td>
                                <td title={activity.statusName} >{activity.statusName}</td>
                                <td title={activity.stateName} >{activity.stateName}</td>
                                <td title={formatDateString(activity.scheduleSD) + ' ' + activity.scheduleST} >{formatDateString(activity.scheduleSD) + ' ' + activity.scheduleST}</td>
                                <td className='ticket-link btn-link' title={activity.ticketId} onClick={() => onTicketClick(activity.ticketId)} >{activity.ticketId}</td>
                                {/* <td title={activity.stateName} >{activity.stateName}</td> */}
                                <td className="change-request-table-td-normal" title={activity.createdByName} >{activity.createdByName}</td>
                                <td className="actions" style={{
                                    overflow: "auto",
                                    textOverflow: "normal",
                                    whiteSpace: "nowrap"
                                }}>
                                    <span title="View">
                                        <i className="fa fa-eye" aria-hidden="true" style={{ marginRight: "10px" }} onClick={() => onSearchClick(activity)}></i>
                                    </span>
                                    <span title="Obselete">
                                        <i className="obselete-icon" style={{ marginRight: "10px" }} onClick={() => onObseleteClick(activity)}>{SLATimerIcon}</i>
                                    </span>
                                    <span title="Copy">
                                        <i className="fa fa-copy" onClick={() => onCopyClick(activity)}></i>
                                    </span>
                                </td>
                            </tr >
                        ))
                    }
                </tbody>
            </table>
            {
                (!Array.isArray(data) || !data.length) &&
                <div className='text-center'>
                    <p>No Data Available</p>
                </div>
            }
        </>
    )
}