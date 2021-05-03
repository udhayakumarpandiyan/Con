import React from 'react';


export default function OperationsDashboard({ graphanaWidgetData, selectedGrafanaURL, onOperationsDashBoardChange, graphanaName }) {
    const dashboardDetails = Array.isArray(graphanaWidgetData) && graphanaWidgetData.length ? graphanaWidgetData[0].dashboardDetails : [];
    return (
        <>
            <div className="page">
                <div className="bg-wh" >
                    <div className="operations-dashboard">
                        <button className="btn dropdown-toggle-op" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {
                                graphanaName ? graphanaName : (dashboardDetails[0] ? dashboardDetails[0] && dashboardDetails[0].dashBoaredName : 'Operations DashBoard')
                            }
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" className="bi bi-chevron-down svg-cl" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path></svg>
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            {
                                Array.isArray(dashboardDetails) &&
                                dashboardDetails.map((url) => {
                                    return (
                                        url.type.toLowerCase() === "cem" && (
                                            <button className="dropdown-item dropdown-item-hover" onClick={() => onOperationsDashBoardChange(url.url, url.dashBoaredName)}
                                                name="selectedGrafanaURL" value={url.url}
                                            >
                                                {url.dashBoaredName}
                                            </button>
                                        )
                                    );
                                })
                            }
                        </div>
                    </div>
                    {/* iframe */}
                    <div style={{ height: '1200px', marginTop: '10px' }}>
                        <iframe id="myIframe"
                            width="100%"
                            scrolling="yes"
                            allow="fullscreen"
                            src={selectedGrafanaURL ? selectedGrafanaURL : dashboardDetails[0] && dashboardDetails[0].url}>
                        </iframe>
                    </div>
                </div>
            </div>
        </>
    )
}
