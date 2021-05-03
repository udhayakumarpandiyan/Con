import React from 'react';
import MergeTickets from "./MergeTickets";
import CloseBulkTickets from "./CloseBulkTickets";
import editIcon from "../../assets/Tickets/edit-icon.svg";

const assendingArrow = <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
>
    <path
        strokeWidth="2"
        fillRule="evenodd"
        d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
    />
</svg>;

const descendingArrow = <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-arrow-down"
    viewBox="0 0 16 16"
>
    <path
        strokeWidth="2"
        fillRule="evenodd"
        d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
    />
</svg>;


const priority_icons = ['emergency-icon.svg', 'high-icon.svg', 'low-icon.svg', 'normal-icon.svg', 'exception-icon.svg', 'emrg.svg', 'excp.svg'];
function renderTableData(ticketsData, onTicketEdit, handleCellClick, onCheckChange, itemsPerPage, activePage) {
    return Array.isArray(ticketsData) && ticketsData.map((row, index) => {
        const priorityText = row.priorityDesc ? row.priorityDesc.toLowerCase() : "";
        let iconIndex = priority_icons.findIndex(priority => priority.includes(priorityText));
        let path = priority_icons[iconIndex];
        let slaText = (row.isAnswered === 0 && row.isSlaBreached === 1) ? "SLA response breached" : "";
        if (row.isSlaResolutionBreached) {
            slaText = "SLA resolution breached";
        }
        console.log(`../../assets/Tickets/${path}`, iconIndex, priorityText);
        return <tr key={row.ticketId} onClick={(e) => handleCellClick(e, row)}>
            <td>
                <div className="form-check form-check-inline form-group group-lable m-0">
                    <input className="form-check-input" type="checkbox" id={`${row.ticketId}`} value={row.ticketId} onClick={onCheckChange} />
                    <label className="form-check-label checkAll" htmlFor={`${row.ticketId}`}>
                        {
                            Number(activePage) === 1 ? index + 1 : (activePage - 1) * itemsPerPage + index + 1
                        }
                    </label>
                </div>
            </td>
            <td>
                <span title={row.ticketId}>{row.ticketId}</span>
            </td>
            <td>
                <span title={window.DateTimeParser(row.createdDate)}> {window.DateTimeParser(row.createdDate)} </span>
            </td>
            <td>
                <span className="priority high">
                    <img src={iconIndex > -1 ? require(`../../assets/Tickets/${path}`) : ''} />
                </span>
                <span title={row.priorityDesc}> {row.priorityDesc} </span>
            </td>

            <td>
                <span title={row.stateDesc}>{row.stateDesc}</span>
            </td>

            <td>
                <span title={row.ticketTypeDesc}> {row.ticketTypeDesc} </span>
            </td>
            <td>
                <span className="subject-text" title={row.subject}>
                    {row.subject}
                </span>
            </td>

            <td>
                <div className="timer-sec">
                    <span className="timer-icon" title={slaText}>
                        {
                            ((row.isAnswered === 0 && row.isSlaBreached === 1) || (row.isSlaResolutionBreached === 1)) ?
                                <i className="fa fa-clock-o fa-lg" style={{ "color": row.isSlaResolutionBreached ? "#f7ba23" : "red" }}></i> : ""
                        }
                    </span>
                    <span title={window.DateTimeParser(row.dueDate)}> {window.DateTimeParser(row.dueDate)} </span>
                </div>
            </td>
            <td>
                <button className="btn btn-link edit-btn">
                    <img src={editIcon} alt="edit icon" onClick={(e) => onTicketEdit(e, row)} />
                </button>
            </td>
        </tr>
    })
}
export default function TicketTable(props) {
    const {
        ticketsData, onTicketEdit, onSidePanelClick, handleCellClick, onSearchInput, onSelectAll, onCheckChange, onSearchSubmit,
        checkedTickets, saveMergeTickets, featureId, closeBulkTicketes, itemsPerPage, activePage, searchText, failureToast } = props;

    return <div >
        <div className="flex-content">
            <div className="left-sec">
                {/* <button className="btn btn-link mr-2">
                    <img src={closeBulk} alt="close bulk icon" title="Close Bulk Tickets" />
                </button> */}
                <CloseBulkTickets
                    ticketIds={checkedTickets}
                    featureId={featureId}
                    closeBulkTicketes={closeBulkTicketes}
                />
                {/* <button className="btn btn-link">
                    <img src={mergeIcon} alt="merge icon" title="Merge Tickets" />
                </button> */}
                <MergeTickets
                    checkedTickets={checkedTickets}
                    featureId={featureId}
                    saveMergeTickets={saveMergeTickets}
                    failureToast={failureToast}
                />
            </div>
            <div className="right-sec">
                <div className="search-sec">
                    <input
                        id='ticketSearch'
                        className="search-input"
                        type="text"
                        placeholder="Search ticket number"
                        name="searchText"
                        onChange={onSearchInput}
                        value={searchText}
                    />
                    <div className="search-icon" onClick={onSearchSubmit} id='searchIcon'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-search"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                            />
                        </svg>
                    </div>
                </div>
                <div className="filter">
                    <button className="btn btn-link p-0" onClick={onSidePanelClick}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-funnel-fill"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div className="mt-3">
            <table className="table table-hover my-table">
                <thead>
                    <tr>
                        <th>
                            <span className="checkbox-all">
                                <div className="form-check form-check-inline" style={{ width: "50px" }}>
                                    <input className="form-check-input" type="checkbox" id="checkAll" onClick={onSelectAll} />
                                    <label htmlFor="checkAll" className="form-check-label th-text ticket-table-th-label"> S.no </label>
                                </div>
                            </span>
                        </th>
                        <th>
                            <span className="th-text ticket-table-th-label" title='Ticket ID'>Ticket ID</span>
                        </th>
                        <th>
                            <span className="th-text ticket-table-th-label" title='Created'>Created</span>
                            <span className="ass-arrow">
                                {assendingArrow}
                            </span>
                            <span className="des-arrow">
                                {descendingArrow}
                            </span>
                        </th>
                        <th>
                            <span className="th-text ticket-table-th-label" title='Priority'>Priority</span>
                            <span className="ass-arrow">
                                {assendingArrow}
                            </span>
                            <span className="des-arrow">
                                {descendingArrow}
                            </span>
                        </th>
                        <th>
                            <span className="th-text ticket-table-th-label" title='Status'> Status </span>
                        </th>
                        <th>
                            <span className="th-text ticket-table-th-label" title='Ticket Type'> Ticket Type </span>
                        </th>
                        <th>
                            <span className="th-text ticket-table-th-label" title='Subject'> Subject </span>
                        </th>
                        <th>
                            <span className="th-text ticket-table-th-label" title='Due Date'>Due Date</span>
                            <span className="ass-arrow">
                                {assendingArrow}
                            </span>
                            <span className="des-arrow">
                                {descendingArrow}
                            </span>
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableData(ticketsData, onTicketEdit, handleCellClick, onCheckChange, itemsPerPage, activePage)}
                </tbody>
            </table>
        </div>
    </div>
}