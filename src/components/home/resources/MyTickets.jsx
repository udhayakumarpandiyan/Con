import React, { Fragment } from 'react';
import SLABreached from "./SLABreached";
import BarGraph from "../../resources/BarGraph";
import { CustomDropDown } from "./CustomDropDown";
import Content from "./content.json";
import ActivityAddPage from '../../changeRequests/AddNewActivity';
import $ from 'jquery';

function getActivityList(getPlannedActivityData) {
    return Array.isArray(getPlannedActivityData) && getPlannedActivityData.map((activity, index) => {
        return (
            <tr key={activity.activityId}>
                <td title={activity.activityId}>{activity.activityId}</td>
                <td title={activity.activity}>{activity.activity}</td>
                <td title={activity.ticketId} >{activity.ticketId}</td>
                <td title={activity.statusName} >{activity.statusName}</td>
                <td title={activity.stateName} >{activity.stateName}</td>
                <td title={window.DateTimeParser(activity.createdDate)} >{window.DateTimeParser(activity.createdDate)}</td>
            </tr >
        )
    });
}

function getEscalatedTickets(EscalateTicketsData) {
    return Array.isArray(EscalateTicketsData) && EscalateTicketsData.map((esTicket, index) => {
        return (
            <tr key={esTicket.ticketId}>
                <td title={esTicket.ticketId}>{esTicket.ticketId}</td>
                <td title={esTicket.ticketType}>{esTicket.ticketType}</td>
                <td title={esTicket.priority} >{esTicket.priority}</td>
                {/* <td title={esTicket.statusName} >{esTicket.statusName}</td> */}
                <td title={esTicket.stateName} >{esTicket.stateName}</td>
                <td title={esTicket.createdByName} >{window.DateTimeParser(esTicket.createdDate)}</td>
                <td title={esTicket.createdByName} >{window.DateTimeParser(esTicket.createdDate)}</td>
            </tr >
        )
    });
}

export default function MyTickets(props) {
    const { getPlannedActivityData, hasShowMyTickets, MyTicketSLAStasData,
        MyPerformanceStatsData, MyResponseResolutionData, EscalateTicketsData, MyTicketDetails } = props;
    const MyResponseResolutionGraph = typeof MyResponseResolutionData === "object" && Object.values(MyResponseResolutionData);
    const MyPerformanceGraphData = typeof MyPerformanceStatsData === "object" && Object.values(MyPerformanceStatsData);
    const { onMyPerformanceStatsFilter, onMyResponseResolutionFilter, onSLAStatisticsFilter, fetchActivities } = props;
    $("#addNewCR").click(function () {
        $('#addnewId').modal('show');
    });
    return hasShowMyTickets && <>
        <div className="page">
            {/* body component part */}
            <div className="bg-wh" >
                <p className="title-head">Ticket Details</p>
                <div className="row pr">
                    <div className="col-md-2 td-text-font" style={{ paddingLeft: '2%' }}>
                        <span className="icon-emr"></span>
                        <span className="col-title">Emergency</span>
                    </div>
                    <div className="col-md-2 td-text-font">
                        <p className="icon-hg" style={{ marginBottom: '-1px' }}></p>
                        <p className="col-title">High</p>
                    </div>
                    <div className="col-md-2 td-text-font">
                        <p className="icon-normal" style={{ marginBottom: '-1px' }}></p>
                        <p className="col-title">Normal</p>
                    </div>
                    <div className="col-md-2 td-text-font">
                        <p className="icon-low" style={{ marginBottom: '-1px' }}></p>
                        <p className="col-title">Low</p>
                    </div>
                    <div className="col-md-2 td-text-font">
                        <p className="icon-excep" style={{ marginBottom: '-8px' }}></p>
                        <p className="col-title">On Hold</p>
                    </div>
                    <div className="col-md-2 text-center" style={{ marginTop: '10px' }}>
                        <p className="total float-none">Total</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 text-center" >
                        <span className="font-size">{MyTicketDetails?.Emergency}</span>
                    </div>
                    <div className="col-md-2 text-center">
                        <span className="font-size">{MyTicketDetails?.High}</span>
                    </div>
                    <div className="col-md-2 text-center">
                        <span className="font-size">{MyTicketDetails?.Normal}</span>
                    </div>
                    <div className="col-md-2 text-center">
                        <span className="font-size">{MyTicketDetails?.Low}</span>
                    </div>
                    <div className="col-md-2 text-center">
                        <span className="font-size">{MyTicketDetails?.Exception}</span>
                    </div>
                    <div className="col-md-2 text-center">
                        <span className="fs-2">{MyTicketDetails?.Total}</span>
                    </div>
                </div>
            </div>
        </div>
        {/* already breached */}
        <div className="page" style={{ padding: "0.1rem 0.9rem" }}>
            {/* body component part */}
            <div className="bg-wh" >
                <p className="breached-ticktes">Breached Tickets</p>
                <div className="row breached-pr justify-content-sm-around">
                    <div className="td-text-font" style={{ paddingLeft: '2%' }}>
                        <div>
                            <span className="icon-emr"></span>
                            <span className="col-title">Emergency</span>
                        </div>
                        <div className="text-center" >
                            <span className="font-size">{Number(MyTicketSLAStasData?.Emergency?.slaCount || 0)}</span>
                        </div>
                    </div>
                    <div className="td-text-font">
                        <div>
                            <span className="icon-hg" style={{ marginBottom: '-1px' }}></span>
                            <span className="col-title">High</span>
                        </div>
                        <div className="text-center">
                            <span className="font-size">{Number(MyTicketSLAStasData?.High?.slaCount || 0)}</span>
                        </div>
                    </div>
                    <div className="td-text-font">
                        <div>
                            <span className="icon-normal" style={{ marginBottom: '-1px' }}></span>
                            <span className="col-title">Normal</span>
                        </div>
                        <div>
                            <div className="text-center">
                                <span className="font-size">{Number(MyTicketSLAStasData?.Normal?.slaCount || 0)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="td-text-font">
                        <div>
                            <span className="icon-low" style={{ marginBottom: '-1px' }}></span>
                            <span className="col-title">Low</span>
                        </div>
                        <div className="text-center">
                            <span className="font-size">{Number(MyTicketSLAStasData?.Low?.slaCount || 0)}</span>
                        </div>
                    </div>
                    <div className="td-text-font">
                        <div> <span className="col-title">Total</span></div>
                        <div className="text-center">
                            <span className="font-size">
                                {
                                    Number(MyTicketSLAStasData?.Emergency?.slaCount || 0) +
                                    Number(MyTicketSLAStasData?.High?.slaCount || 0) +
                                    Number(MyTicketSLAStasData?.Normal?.slaCount || 0) +
                                    Number(MyTicketSLAStasData?.Low?.slaCount || 0)
                                }
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ display: 'none' }}>
                    <div className="col-md-2 text-center" >
                        <span className="font-size">{Number(MyTicketSLAStasData?.Emergency?.slaCount || 0)}</span>
                    </div>
                    <div className="col-md-2 text-center">
                        <span className="font-size">{Number(MyTicketSLAStasData?.High?.slaCount || 0)}</span>
                    </div>
                    <div className="col-md-2 text-center">
                        <span className="font-size">{Number(MyTicketSLAStasData?.Normal?.slaCount || 0)}</span>
                    </div>
                    <div className="col-md-2 text-center">
                        <span className="font-size">{Number(MyTicketSLAStasData?.Low?.slaCount || 0)}</span>
                    </div>
                    <div className="col-md-2 text-center">
                        <span className="fs-2">{
                            Number(MyTicketSLAStasData?.Emergency?.slaCount || 0) +
                            Number(MyTicketSLAStasData?.High?.slaCount || 0) +
                            Number(MyTicketSLAStasData?.Normal?.slaCount || 0) +
                            Number(MyTicketSLAStasData?.Low?.slaCount || 0)
                        }</span>
                    </div>
                </div>
            </div>
        </div>
        {/*  */}
        <div className="page">
            <div className="bg-wh" >
                <div className="title-head flex-content">
                    <div>
                        <span className="mr-2">Time to SLA Breach</span>
                        <span className="info" title={Content["Hover-text"]}></span>
                    </div>
                    <CustomDropDown
                        onChange={onSLAStatisticsFilter}
                    />
                </div>
                <Fragment>
                    <SLABreached {...Content['Emergency']} data={MyTicketSLAStasData?.Emergency} />
                    <SLABreached {...Content['High priority']} data={MyTicketSLAStasData?.High} />
                    <SLABreached {...Content['Normal priority']} data={MyTicketSLAStasData?.Normal} />
                    <SLABreached {...Content['Low priority']} data={MyTicketSLAStasData?.Low} />
                    <div className="row ml-5">
                        <div className="text-center" style={{ width: "83%" }}>
                            Resolution SLA in Minutes
                </div >
                        {/* <div className="text-center" style={{ width: "17%" }}>Total Breached</div> */}
                    </div>
                    {/* <div className="row ml-5">
                        <div style={{ width: "83%" }}>
                        </div >
                        <div className="text-center fs-2" style={{ width: "17%" }}>{
                            Number(MyTicketSLAStasData?.Emergency?.slaCount || 0) +
                            Number(MyTicketSLAStasData?.High?.slaCount || 0) +
                            Number(MyTicketSLAStasData?.Normal?.slaCount || 0) +
                            Number(MyTicketSLAStasData?.Low?.slaCount || 0)
                        }</div>
                    </div> */}
                </Fragment>
            </div>
        </div>
        {/* tables */}
        <div className="row home-page" style={{ margin: '10px 20px 10px 10px' }}>
            <div className="col-md-6 col-sm-12 pa-es page" style={{ background: '#fff' }}>
                <div className="bg-wh" style={{ marginRight: '-9px' }}>
                    <div className="flex-content">
                        <div className="head-text">Change Requests</div>
                        <div id='addNewCR'><button className="add-new-activity" style={{ outline: "none", marginTop: '10px', marginRight: '10px' }}>+ New Change Request</button></div>
                    </div>
                    <table className="table">
                        <thead style={{ display: 'block' }}>
                            <tr>
                                {
                                    ['Activity ID', 'Activity Type', 'Ticket ID', 'Status', 'State', 'Initiated On'].map(column => {
                                        return <th key={column}>{column}</th>
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody style={{ display: 'block', height: '200px', overflowY: 'auto', overflowX: 'hidden' }}>
                            {
                                getActivityList(getPlannedActivityData)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col-md-6 col-sm-12 pa-es page" style={{
                background: '#fff',
                borderLeft: '1px solid #f1f1f1',
                borderLeftWidth: '12px'
            }}>
                <div className="bg-wh" >
                    <div className="head-text">My Escalated Tickets</div>
                    <table className="table">
                        <thead>
                            <tr>
                                {
                                    ['Ticket ID', 'Ticket Type', 'Priority', 'Status', 'Escalated Time', 'Close on'].map(column => {
                                        return <th key={column} title={column}>{column}</th>
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                getEscalatedTickets(EscalateTicketsData)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        {/* graphs */}
        <div className="row">
            <div className="col-md-6 col-sm-12 page">
                <div className="bg-wh" style={{ marginRight: '-8px' }}>
                    <div className="flex-content ">
                        <div className="head-text col-md-9">My Response/Resolution Time</div>
                        <div>
                            {/* <div className="div-float">
                                <CustomDropDown 
                                list
                                />
                            </div> */}
                            <div className="div-float col-md-3">
                                <CustomDropDown
                                    onChange={onMyResponseResolutionFilter}
                                    list={[
                                        { value: 1, label: 'Daily' },
                                        { value: 7, label: 'Weekly' }, { label: 'Monthly', value: 30 }]}
                                    defaultSelected={'Weekly'}
                                />
                            </div>
                        </div>
                    </div>
                    <BarGraph
                        Ylabel={'Resolution Time in Minutes'}
                        Xlabel={'1 Week'}
                        data={MyResponseResolutionGraph}
                        Yposition={'insideBottomLeft'}
                        verticalCartesianGrid={false}
                        XDataKey={"date"}
                        barDataKey={["SLA Resolution", "SLA Response"]}
                        fill={["#82ca9d", "#8884d8"]}
                    />
                </div>
            </div>
            <div className="col-md-6 col-sm-12 page">
                <div className="bg-wh">
                    <div className="flex-content">
                        <div className="head-text col-md-9">My Performance</div>
                        <div class="div-float col-md-3" style={{ marginRight: '10px' }}>
                            <CustomDropDown
                                onChange={onMyPerformanceStatsFilter}
                                list={[
                                    { value: 1, label: 'Daily' },
                                    { value: 7, label: 'Weekly' }, { label: 'Monthly', value: 30 }]}
                                defaultSelected={'Weekly'}
                            />
                        </div>
                    </div>
                    <BarGraph
                        Ylabel={'No. of Tickets'}
                        Xlabel={'1 Week'}
                        Yposition={'insideBottomLeft'}
                        verticalCartesianGrid={false}
                        XDataKey={"date"}
                        fill={["#7D7F7D", "#F5187E", "#CC141E", "#F08943", "#F1C21B"]}
                        data={MyPerformanceGraphData}
                    />
                </div>
            </div>
        </div>
        {/* add new cr */}
        <div className="modal" id="addnewId" aria-labelledby="myLargeModalLabel" data-backdrop="static"
            data-keyboard="false" tabIndex="-1" role="dialog" aria-hidden="true" style={{ overflow: "auto" }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div class="modal-header" style={{ borderBottom: 'none' }}>
                        <h4 class="modal-title" style={{ fontFamily: 'Open Sans Bold' }}>New Activity</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => $('#addnewId').modal('hide')}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        {
                            <ActivityAddPage
                                fetchActivities={() => {
                                    $('#addnewId').modal('hide');
                                    fetchActivities();
                                }}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    </>
}