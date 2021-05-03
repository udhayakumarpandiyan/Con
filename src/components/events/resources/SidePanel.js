import React from 'react';
import { CEM_TICKET_PRIORITY, MONITORING_TOOLS, EVENT_STATUS } from '../../../constants/index';
import "./page.css";

export default function SidePanel({ onSidePanelClick, isShowSidePanel, onFilterChanged, resetFilters, applyFilters, filtereventservice, filterpriority, filterstatus, filterstartdate, filterenddate }) {
    return isShowSidePanel && (
        <div id="mySidepanel" className="side-panel filters-width">
            <div className="modal-header">
                <h6 className="modal-title"><b>Filters</b></h6>
                <h6 type="button" className="close" onClick={onSidePanelClick}>&times;</h6>
            </div>
            <div className="form-group pad-10">
                <label className="filters-label" htmlFor="source">Source</label>
                <select onChange={onFilterChanged} name="filtereventservice">
                    <option selected value={""}>Select Source</option>
                    {Object.values(MONITORING_TOOLS).map(
                        monitoringTool => {
                            return (
                                <option key={monitoringTool.id} value={monitoringTool.id}>
                                    {monitoringTool.name}
                                </option>
                            );
                        }
                    )}
                </select>
            </div>
            <div className="form-group pad-10">
                <label className="filters-label" htmlFor="priority">Priority</label>
                <select onChange={onFilterChanged} name="filterpriority">
                    <option selected value={""}>Select Priority</option>
                    {
                        Object.keys(CEM_TICKET_PRIORITY).map((priority) => (
                            <option value={priority} key={priority}>{CEM_TICKET_PRIORITY[priority]["name"]}</option>))
                    }
                </select>
            </div>
            <div className="form-group pad-10">
                <label className="filters-label" htmlFor="status">Status</label>
                <select onChange={onFilterChanged} name="filterstatus">
                    <option value={""}>Select Status</option>
                    {Object.keys(EVENT_STATUS).map((key) => {
                        return (
                            <option value={key} key={key}>
                                {EVENT_STATUS[key]["name"]}
                            </option>
                        );
                    })}
                </select>
            </div>

            <div className="form-group pad-10">
                <label className="filters-label" htmlFor="startdate">Start Date</label>
                <input className="filters-input" type="date" id="startdate" name="filterstartdate" onChange={onFilterChanged} />
            </div>
            <div className="form-group pad-10">
                <label className="filters-label" htmlFor="endate">End Date</label>
                <input className="filters-input" type="date" id="enddate" name="filterenddate" onChange={onFilterChanged} />
            </div>
            <div className='d-flex justify-content-center mb-4'>
                <button type="button" className="filter-buttons" onClick={resetFilters}>Reset</button>
                <button type="button" className="filter-buttons" onClick={applyFilters}>Apply</button>
            </div>
        </div>
    )
}
