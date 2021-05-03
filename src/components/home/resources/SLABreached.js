import React from 'react';
/* eslint-disable max-len */
export default function SLABreached({ label = "", data = {}, intervals = [], color = "",  }) {
    const slaCount = data?.slaCount;
    const slaFutureCount = data?.slaFutureCount;
    const ticketDetails = Object.assign({}, data);
    delete ticketDetails['slaCount'];
    delete ticketDetails['slaFutureCount'];
    return <div className="mb-5">
        <div className="row sla-table-div">
            <span className="count" style={{ color }}>{slaFutureCount}</span>
            <span>{label}</span>
        </div>
        <div className="sla-table">
            {
                ticketDetails && Object.values(ticketDetails).map((data, index) =>
                    <div key={index} className="sla-table-col font-size">{data}</div>
                )
            }
            {/* <div className="total-ls fs-2">{slaCount}</div> */}
        </div>
        <div className="table-interval">
            {
                Array.isArray(intervals) && intervals.map((period) =>
                    <div key={period} className="interval">{period}</div>
                )
            }
        </div>
    </div>
}