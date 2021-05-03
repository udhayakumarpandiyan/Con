import React from 'react';

export default function SidePanel({ onSidePanelClick, isShowSidePanel, onFilterChanged, CRState, statusList, applyFilter, onReset, state, status, activity, activityId }) {
    return isShowSidePanel && (
        <div id="mySidepanel" className="side-panel filters-width">
            <div className="modal-header">
                <h6 className="modal-title side-panel-modal-title"><b>Filters</b></h6>
                <h6 type="button" className="close" onClick={onSidePanelClick}>&times;</h6>
            </div>
            <div className="form-group pad-10">
                <label class="side-panel-label">Status</label>
                <select class="side-panel-select" onChange={onFilterChanged} name="status" value={status}>
                    <option value=''>Select Status</option>
                    {
                        Array.isArray(statusList) && statusList.map((stateOptions) =>
                            <option key={stateOptions.id} value={stateOptions.id}> {stateOptions.name} </option>)
                    }
                </select>
            </div>
            <div className="form-group pad-10">
                <label class="side-panel-label">State</label>
                <select class="side-panel-select" onChange={onFilterChanged} name="state" value={state}>
                    <option value=''>Select State</option>
                    {
                        Array.isArray(CRState) && CRState.map((stateOptions) =>
                            <option key={stateOptions.id} value={stateOptions.id}> {stateOptions.name} </option>)
                    }
                </select>
            </div>
            <div className="form-group pad-10">
                <label class="side-panel-label" >Activity</label>
                <input class="side-panel-input" type="text" name='activity' onChange={onFilterChanged} value={activity} />
            </div>
            <div className="form-group pad-10">
                <label class="side-panel-label" >ChangeRequest Id</label>
                <input class="side-panel-input" type="text" id="activityId" name="activityId" value={activityId} onChange={onFilterChanged} />
            </div>
            <div className='d-flex justify-content-center mb-4'>
                <button type="button" className="filter-buttons" onClick={onReset}>Reset</button>
                <button type="button" className="filter-buttons" onClick={applyFilter}>Apply</button>
            </div>
        </div>
    )
}