import React from 'react';
import LineGraph from "../../resources/LineGraph";
import VerticalBar from "../../resources/VerticalBar";
import { CustomDropDown } from "./CustomDropDown";
import "./overView.css";
import emergencyIcon from "../../assets/resources/icon_emergency.svg";
import exceptionIcon from "../../assets/resources/icon_exception.svg";
import $ from 'jquery';

export default function Overview(props) {
    const { hasShowOverView, eventAndTicketStats, acknowledgeEventsData, TicketStatsData, eventsBySourceData, eventsToolsTrendsObj, hasHideTickets } = props;
    const eventsBySourceGraphData = Array.isArray(eventsBySourceData) && eventsBySourceData.length ? eventsBySourceData[0] : {};
    const { onAllTicketsFilter, onEventActivityFilter, onAcknowledgeEventsFilter, onEventsToolsTrendsFilter, onEventsBySourceFilter, defaultEventType } = props;
    $(function () {

        $(".progress").each(function () {

            var value = $(this).attr('data-value');
            var left = $(this).find('.progress-left .progress-bar');
            var right = $(this).find('.progress-right .progress-bar');

            if (value > 0) {
                if (value <= 50) {
                    right.css('transform', 'rotate(' + percentageToDegrees(value) + 'deg)')
                } else {
                    right.css('transform', 'rotate(180deg)')
                    left.css('transform', 'rotate(' + percentageToDegrees(value - 50) + 'deg)')
                }
            }

        })

        function percentageToDegrees(percentage) {

            return percentage / 100 * 360

        }

    });
    const { totalResolvedEvents = 0, ticketCreated = 0, ticketResolved = 0, totalEvents = 0, totalActiveEvents = 0, totalInActiveEvents = 0 } = eventAndTicketStats || {};
    const resolvedEventsInPercentage = (totalResolvedEvents / totalEvents) * 100 || 0;
    const activeEventsInPercentage = (totalActiveEvents / totalEvents) * 100 || 0;
    const inActiveEventsInPercentage = (totalInActiveEvents / totalEvents) * 100 || 0;

    return hasShowOverView && (
        <>
            {
                !hasHideTickets &&
                <div className="page">
                    <div className="bg-wh" >
                        <div className="container-fluid">
                            <div className="tickets-container">
                                <div className='d-flex all-tickets'>
                                    <h2 className="heading-tickets">All Tickets</h2>
                                    <div>
                                        <CustomDropDown
                                            onChange={onAllTicketsFilter}
                                        />
                                    </div>
                                </div>
                                <div className="flex-content allTickets">
                                    <div
                                        className="mar-emergency"
                                    >
                                        <div className="heading-count">
                                            <img
                                                className="side-icons"
                                                src={emergencyIcon}
                                                alt="Emergency icon"
                                            />
                                            <div className="heading-ticket-sec">
                                                <span className="title" style={{ marginTop: '-5px' }}> Emergency </span>
                                                <span className="count-value"> {TicketStatsData?.ticketPriorityCategory?.Emergency} </span>
                                            </div>
                                        </div>
                                        <div className="sla-time-sec">
                                            <span className="sla-title"> SLA time </span>
                                            <span className="time"> {TicketStatsData?.ticketisSlaTimeCategory?.Emergency} min</span>
                                        </div>

                                        <div className="sla-time-sec">
                                            <span className="sla-title"> Breaches to date </span>
                                            <span className="time"> {TicketStatsData?.ticketSLAResolutionCountCategory?.Emergency} </span>
                                        </div>

                                        <div className="sla-time-sec">
                                            <span className="sla-title"> Avg. resolution time </span>
                                            <span className="time"> {TicketStatsData?.ticketSLAResolutionAvgCategory?.Emergency} min</span>
                                        </div>
                                        <div className="border-line"></div>
                                    </div>
                                    <div className="mar-high">
                                        <div className="heading-count">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-exclamation-triangle-fill high"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
                                                />
                                            </svg>

                                            <div className="heading-ticket-sec">
                                                <span className="title" style={{ marginTop: '-5px' }}> High </span>
                                                <span className="count-value"> {TicketStatsData?.ticketPriorityCategory?.High} </span>
                                            </div>
                                        </div>

                                        <div className="sla-time-sec">
                                            <span className="sla-title"> SLA time </span>
                                            <span className="time"> {TicketStatsData?.ticketisSlaTimeCategory?.High} min</span>
                                        </div>

                                        <div className="sla-time-sec">
                                            <span className="sla-title"> Breaches to date </span>
                                            <span className="time"> {TicketStatsData?.ticketSLAResolutionCountCategory?.High} </span>
                                        </div>

                                        <div className="sla-time-sec">
                                            <span className="sla-title"> Avg. resolution time </span>
                                            <span className="time"> {TicketStatsData?.ticketSLAResolutionAvgCategory?.High} min</span>
                                        </div>

                                        <div className="border-line"></div>
                                    </div>

                                    <div className="mar-normal">
                                        <div className="heading-count">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-exclamation-triangle-fill normal"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
                                                />
                                            </svg>

                                            <div className="heading-ticket-sec">
                                                <span className="title" style={{ marginTop: '-5px' }}> Normal </span>
                                                <span className="count-value"> {TicketStatsData?.ticketPriorityCategory?.Normal} </span>
                                            </div>
                                        </div>

                                        <div className="sla-time-sec">
                                            <span className="sla-title"> SLA time </span>
                                            <span className="time"> {TicketStatsData?.ticketisSlaTimeCategory?.Normal} min</span>
                                        </div>

                                        <div className="sla-time-sec">
                                            <span className="sla-title"> Breaches to date </span>
                                            <span className="time"> {TicketStatsData?.ticketSLAResolutionCountCategory?.Normal} </span>
                                        </div>

                                        <div className="sla-time-sec">
                                            <span className="sla-title"> Avg. resolution time </span>
                                            <span className="time"> {TicketStatsData?.ticketSLAResolutionAvgCategory?.Normal} min</span>
                                        </div>

                                        <div className="border-line"></div>
                                    </div>

                                    <div className="mar-low">
                                        <div className="heading-count">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-exclamation-triangle-fill low"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
                                                />
                                            </svg>

                                            <div className="heading-ticket-sec">
                                                <span className="title" style={{ marginTop: '-5px' }}> Low </span>
                                                <span className="count-value"> {TicketStatsData?.ticketPriorityCategory?.Low} </span>
                                            </div>
                                        </div>

                                        <div className="sla-time-sec">
                                            <span className="sla-title"> SLA time </span>
                                            <span className="time"> {TicketStatsData?.ticketisSlaTimeCategory?.Low} min</span>
                                        </div>

                                        <div className="sla-time-sec">
                                            <span className="sla-title"> Breaches to date </span>
                                            <span className="time"> {TicketStatsData?.ticketSLAResolutionCountCategory?.Low} </span>
                                        </div>

                                        <div className="sla-time-sec">
                                            <span className="sla-title"> Avg. resolution time </span>
                                            <span className="time"> {TicketStatsData?.ticketSLAResolutionAvgCategory?.Low} min</span>
                                        </div>

                                        <div className="border-line"></div>
                                    </div>

                                    <div className="mar-hold">
                                        <div className="heading-count">
                                            <img
                                                className="side-icons"
                                                src={exceptionIcon}
                                                alt="exception icon"
                                                style={{ marginTop: '3px' }}
                                            />
                                            <div className="heading-ticket-sec">
                                                <span className="title" style={{ marginTop: '-5px' }}> On-Hold </span>
                                                <span className="count-value"> {TicketStatsData?.ticketPriorityCategory?.Exception} </span>
                                            </div>
                                        </div>

                                        <div className="sla-time-sec">
                                            <span className="sla-title"> SLA time </span>
                                            <span className="time"> {TicketStatsData?.ticketisSlaTimeCategory?.Exception} min</span>
                                        </div>

                                        <div className="sla-time-sec">
                                            <span className="sla-title"> Breaches to date </span>
                                            <span className="time"> {TicketStatsData?.ticketSLAResolutionCountCategory?.Exception} </span>
                                        </div>

                                        <div className="sla-time-sec">
                                            <span className="sla-title"> Avg. resolution time </span>
                                            <span className="time"> {TicketStatsData?.ticketSLAResolutionAvgCategory?.Exception} min</span>
                                        </div>

                                        <div className="border-line"></div>

                                    </div>
                                    <div className="" style={{ display: "none" }}>
                                        <div className="heading-count">
                                            <div className="heading-ticket-sec">
                                                <span className="title"> Total </span>
                                                <span className="count-value">{TicketStatsData?.ticketPriorityCategory?.Total} </span>
                                            </div>
                                        </div>

                                        <div className="sla-time-sec">
                                            {/* <span className="sla-title"> SLA time </span> */}
                                            {/* <span className="time"> {TicketStatsData?.ticketisSlaTimeCategory?.Total} min</span> */}
                                        </div>

                                        <div className="sla-time-sec">
                                            <span className="sla-title"> Breaches to date </span>
                                            <span className="time"> {TicketStatsData?.ticketSLAResolutionCountCategory?.Total} </span>
                                        </div>

                                        <div className="sla-time-sec">
                                            {/* <span className="sla-title"> Avg. resolution time </span> */}
                                            {/* <span className="time"> {TicketStatsData?.ticketSLAResolutionAvgCategory?.Total} min</span> */}
                                        </div>
                                        <div className="left-border"></div>

                                        <div className="border-line"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div /* className="ticket-activity-event-main" */>
                <div className="row page" style={{ margin: '0px' }}>
                    <div className="col-xs-12 col-sm-12 col-md-4 ticket-activity-sec">
                        <div className="page">
                            <div className="bg-wh" >
                                <div className="comp-heading">
                                    <h3 className="comp-title"> Ticket activity </h3>
                                    {/* <CustomDropDown
                                        onChange={onEventActivityFilter}
                                    /> */}
                                </div>
                                <div className="events-covered">
                                    <span className="title ml-0"> Events converted to tickets </span>
                                    <span className="count"> {ticketCreated} </span>
                                </div>
                                <div className="events-covered">
                                    <span className="title ml-0"> Resolved tickets </span>
                                    <span className="count"> {ticketResolved} </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-8 event-activity-main" style={{ paddingRight: '0px' }}>
                        <div >
                            <div className="bg-wh" >
                                <div className="ml-2 event-activity">
                                    <div className="comp-heading">
                                        <h3 className="comp-title" style={{ marginTop: '10px' }}> Event activity </h3>
                                        <CustomDropDown
                                            onChange={onEventActivityFilter}
                                        />
                                    </div>

                                    <div className="charting-area">
                                        <div className="events-covered">
                                            <span className="title ml-0"> All Events </span>
                                            <span className="count"> {totalEvents} </span>

                                            <div class="progress mx-auto" data-value={totalEvents ? 100 : 0}>
                                                <span class="progress-left">
                                                    <span class="progress-bar border-success"></span>
                                                </span>
                                                <span class="progress-right">
                                                    <span class="progress-bar border-success"></span>
                                                </span>
                                                <div class="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                                                    <div class="h2 font-weight-bold">{totalEvents ? 100 : 0}<sup class="small">%</sup></div>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="ack-main-sec">
                                            <div className="ack-events-heading">
                                                <div className="title-ack">Resolved Events</div>
                                                <div className="title-count">{totalResolvedEvents}</div>
                                            </div>

                                            <div className="chart-ack small-chart">
                                                <div class="progress mx-auto" data-value={Number(resolvedEventsInPercentage).toFixed(1)}>
                                                    <span class="progress-left">
                                                        <span class="progress-bar border-success"></span>
                                                    </span>
                                                    <span class="progress-right">
                                                        <span class="progress-bar border-success"></span>
                                                    </span>
                                                    <div class="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                                                        <div class="h2 font-weight-bold">{Number(resolvedEventsInPercentage).toFixed(1)}<sup class="small">%</sup></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ack-main-sec">
                                            <div className="ack-events-heading">
                                                <div className="title-ack">Active events</div>
                                                <div className="title-count">{totalActiveEvents}</div>
                                            </div>

                                            <div className="chart-ack small-chart">
                                                <div class="progress mx-auto" data-value={Number(activeEventsInPercentage).toFixed(1)}>
                                                    <span class="progress-left">
                                                        <span class="progress-bar border-success"></span>
                                                    </span>
                                                    <span class="progress-right">
                                                        <span class="progress-bar border-success"></span>
                                                    </span>
                                                    <div class="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                                                        <div class="h2 font-weight-bold">{Number(activeEventsInPercentage).toFixed(1)}<sup class="small">%</sup></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ack-main-sec">
                                            <div className="ack-events-heading">
                                                <div className="title-ack">Closed events</div>

                                                <div className="title-count">{totalInActiveEvents}</div>
                                            </div>

                                            <div className="chart-ack small-chart">
                                                <div class="progress mx-auto" data-value={Number(inActiveEventsInPercentage).toFixed(1)}>
                                                    <span class="progress-left">
                                                        <span class="progress-bar border-success"></span>
                                                    </span>
                                                    <span class="progress-right">
                                                        <span class="progress-bar border-success"></span>
                                                    </span>
                                                    <div class="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                                                        <div class="h2 font-weight-bold">{Number(inActiveEventsInPercentage).toFixed(1)}<sup class="small">%</sup></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* all tickets end */}
            <div className="page">
                <div className="bg-wh" >
                    <div className="flex-content">
                        <div className="head-text">Events</div>
                        <div className='flex-content'>
                            <CustomDropDown
                                onChange={(data) => onAcknowledgeEventsFilter(data, {})}
                                list={[
                                    { value: 1, label: 'Daily' },
                                    { value: 7, label: 'Weekly' }, { label: 'Monthly', value: 30 }]}
                                defaultSelected={'Weekly'}
                            />
                            <div style={{ marginLeft: '2rem' }}>
                                <CustomDropDown
                                    list={[{ value: 'active', label: 'Active' },
                                    { value: 'inactive', label: 'Inactive' },
                                    { value: 'acknowledged', label: 'Acknowledged' }]}
                                    onChange={(data) => onAcknowledgeEventsFilter({}, data)}
                                    defaultSelected={defaultEventType}
                                />
                            </div>
                        </div>
                    </div>
                    <LineGraph data={acknowledgeEventsData} x_datakey="date" dataKey="value" className="date" height={260} />
                </div>
            </div>
            <div className="row" style={{ margin: '0px' }}>
                <div className="col-md-6 col-sm-12 page">
                    <div className="bg-wh" style={{ paddingBottom: '25px', marginRight: '0px' }}>
                        <div className="flex-content">
                            <div className="head-text">Event Volume By Source</div>
                            <div>
                                <CustomDropDown
                                    onChange={onEventsBySourceFilter}
                                />
                            </div>
                        </div>
                        <VerticalBar Ylabel={'No. of Tickets'} Xlabel={'1 Week'} Yposition={'insideBottomLeft'} layout={"vertical"} data={eventsBySourceGraphData} />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 page">
                    <div className="bg-wh" style={{ paddingBottom: '25px', marginRight: '0px' }}>
                        <div className="flex-content">
                            <div className="head-text">Event trend by week</div>
                            <div>
                                <CustomDropDown
                                    onChange={onEventsToolsTrendsFilter}
                                    list={[
                                        { value: 1, label: 'Daily' },
                                        { value: 7, label: 'Weekly' }, { label: 'Monthly', value: 30 }]}
                                    defaultSelected={'Weekly'}
                                />
                            </div>
                        </div>
                        <LineGraph data={eventsToolsTrendsObj} dataKey="name" x_datakey="date" lineDataKey="count" multiple />
                    </div>
                </div>
            </div>
        </>
    )
}