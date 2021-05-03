import React from 'react';

export default function SidePanel({ onSidePanelClick, isShowSidePanel, onFilterChanged, priorityList, ticketType, stateList, applyFilter, onReset, status, endDate, type, startDate, priority }) {
    return isShowSidePanel && (
        <div id="mySidepanel" className="side-panel filters-width">
            <div className="modal-header">
                <h6 className="modal-title side-panel-modal-title"><b>Filters</b></h6>
                <h6 type="button" className="close" onClick={onSidePanelClick}>&times;</h6>
            </div>
            <div className="form-group pad-10">
                <label class="side-panel-label" htmlFor="sel1">Status</label>
                <select class="side-panel-select" onChange={onFilterChanged} name="status" value={status}>
                    <option value=''>Select Status</option>
                    {
                        Array.isArray(stateList) && stateList.map((stateOptions) =>
                            <option key={stateOptions.id} value={stateOptions.id}> {stateOptions.name} </option>)
                    }
                </select>
            </div>
            <div className="form-group pad-10">
                <label class="side-panel-label" htmlFor="sel1">Priority</label>
                <select class="side-panel-select" onChange={onFilterChanged} name="priority" value={priority}>
                    <option value=''>Select Priority</option>
                    {
                        Array.isArray(priorityList) && priorityList.map((priorityOptions) =>
                            <option key={priorityOptions.id} value={priorityOptions.id}> {priorityOptions.name} </option>)
                    }
                </select>
            </div>
            <div className="form-group pad-10">
                <label class="side-panel-label" htmlFor="sel1">Type</label>
                <select class="side-panel-select" onChange={onFilterChanged} name="type" value={type}>
                    <option value=''>Select Type</option>
                    {
                        Array.isArray(ticketType) && ticketType.map((TTOptions) =>
                            <option key={TTOptions.id} value={TTOptions.id}> {TTOptions.name} </option>)
                    }
                </select>
            </div>
            <div className="form-group pad-10">
                <label class="side-panel-label" htmlFor="sel1">Start Date</label>
                <input class="side-panel-input" type="date" id="startdate" name="startDate" onChange={onFilterChanged} value={startDate} />
            </div>
            <div className="form-group pad-10">
                <label class="side-panel-label" htmlFor="sel1">End Date</label>
                <input class="side-panel-input" type="date" id="enddate" name="endDate" onChange={onFilterChanged} value={endDate} />
            </div>
            <div className='d-flex justify-content-center mb-4'>
                <button type="button" className="filter-buttons" onClick={onReset}>Reset</button>
                <button type="button" className="filter-buttons" onClick={applyFilter}>Apply</button>
            </div>
        </div>
    )
}