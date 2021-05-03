import React from 'react';

export function ServicenowExportMessage({ results: { insertCount, totalSyncIime, updateCount }, onClose = () => { } }) {

    return (
        <>
            <div class="modal" id="servicenowresults" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Export To Servicenow</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <h4>Inventory Export to ServiceNow Completed Successfully </h4>
                            <div className='m-2'>New Hosts added - <strong>{insertCount}</strong></div>
                            <div className='m-2'>Hosts updated - <strong>{updateCount}</strong></div>
                            <div className='m-2'>Total Sync time - <strong>{totalSyncIime}</strong></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}