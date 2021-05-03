import React from 'react';
import { PROJECT_LINKED } from '../../constants/index';

export default function SidePanel({ onSidePanelClick, isShowSidePanel, onFilterChanged, onProjectChange, applyFilter, onReset, projectListData, sandboxAccountData, projectIdFilter, accountIdFilter, isProjectLinkedFilter, hostStatus }) {
    return isShowSidePanel && (
        <div id="mySidepanel" className="side-panel filters-width">
            <div className="modal-header">
                <h6 className="modal-title side-panel-modal-title"><b>Filters</b></h6>
                <h6 type="button" className="close" onClick={onSidePanelClick}>&times;</h6>
            </div>
            <div className="form-group pad-10">
                <label class="side-panel-label" htmlFor="sel1">Project</label>
                <select class="side-panel-select" onChange={onProjectChange} name="projectIdFilter" value={projectIdFilter}>
                    <option value=''>Select Project</option>
                    {
                        Array.isArray(projectListData) && projectListData.map((project) => {
                            if (project && project.projectName.trim())
                                return <option title={project.projectName} key={project.projectId} value={project.projectId}>{project.projectName}</option>
                        })
                    }
                </select>
            </div>
            <div className="form-group pad-10">
                <label class="side-panel-label" htmlFor="sel1">Account</label>
                <select class="side-panel-select" onChange={onFilterChanged} name="accountIdFilter" value={accountIdFilter}>
                    <option value=''>Select Account</option>
                    {
                        Array.isArray(sandboxAccountData) && sandboxAccountData.map((data) => {
                            if (data.sandboxName && data.sandboxName.trim())
                                return <option key={data.sandboxId} value={data.sandboxId}>{data.sandboxName}</option>
                        })
                    }
                </select>
            </div>
            <div className="form-group pad-10">
                <label class="side-panel-label" htmlFor="sel1">Is Project Linked</label>
                <select class="side-panel-select" onChange={onFilterChanged} name="isProjectLinkedFilter" value={isProjectLinkedFilter}>
                    <option value=''>Select</option>
                    {
                        typeof PROJECT_LINKED === "object" && Object.keys(PROJECT_LINKED).map(key =>
                            <option key={key} value={PROJECT_LINKED[key]}>{PROJECT_LINKED[key]}</option>)
                    }
                </select>
            </div>
            <div className="form-group pad-10">
                <label class="side-panel-label">Host Status</label>
                <select class="side-panel-select" onChange={onFilterChanged} name="hostStatus" value={hostStatus}>
                    <option value=''>Select</option>
                    <option value='running'>Running</option>
                    <option value='stopped'>Stopped</option>
                </select>
            </div>
            <div className='d-flex justify-content-center mb-4'>
                <button type="button" className="filter-buttons" onClick={onReset}>Reset</button>
                <button type="button" className="filter-buttons" onClick={applyFilter}>Apply</button>
            </div>
        </div>
    )
}