import React from 'react';
import "./teamsConference.css";
import ControlledOpenSelect from "./CustomDropDown";

export default function TeamsConference(props) {
    const { onCloseWindow, hasShowTeamsConferenceWindow, onChange, emailAddress, startDate,
        endDate, startTime, endTime, location, onSubmitConference, teamsList, getChannelsList, onSelectedChannel, ticketId, zones = [] } = props;
    const { timeZone } = props;
    // <span class='badge badge-primary float-left' style='font-size:1rem; margin-right:5px;'>CC</span> Concierto Cloud > General
    const generateChannels = Array.isArray(teamsList) && teamsList.map((team, index) => {
        return Array.isArray(getChannelsList) && getChannelsList[index] && getChannelsList[index].reduce((arr, channel) => {
            let span = {
                span: <>
                    <span className='badge badge-primary float-left mr-10'>CC</span>{`${team.displayName} > ${channel.displayName}`}
                </>,
                value: `${team.id}||${channel.id}`
            }
            arr.push(span);
            return arr;
        }, []);

    });
    return (
        <>
            <ul className="teamBox teams-mess ul-list" id="myUL" style={{ width: "38rem" }}>
                <div className="teamHead">
                    <div className="ms-teams-icon" style={{ padding: "0px 20px", margin: "15px" }}>Teams</div>
                    <div className="teams-head teams-send-message-head">Microsoft Teams</div>
                    <div className="close-x" style={{ cursor: "pointer", marginLeft: "70px" }} onClick={(e) => onCloseWindow(e, hasShowTeamsConferenceWindow)}>&times;</div>
                </div>
                <form style={{ padding: "20px" }}>
                    <h5 class="teams-conference-h4">Schedule Conference</h5>
                    <div className="form-group">
                        <label class="teams-conference-label" htmlFor="sel1"><b>New meeting</b></label>
                        <select className="select-tm teams-conference-select" name="timeZone" value={timeZone} onChange={onChange}>
                            {
                                zones.map(zone => <option key={zone.alias} value={zone.alias}>{zone.displayName}</option>)
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control input-tm bc teams-conference-ticket-input" id="title" placeholder="Add title" value={`Tickets#${ticketId}`} />
                    </div>
                    <div className="form-group">
                        <ControlledOpenSelect
                            channelList={generateChannels}
                            onSelectedChannel={onSelectedChannel}
                        />
                    </div>
                    <div className="form-group">
                        <input type="email" className="form-control" onChange={onChange} id="emails" multiple placeholder="Add Additional Attendies" value={emailAddress} name="emailAddress" />
                        <span className="fa fa-users attendees-span" title="Separate each email address with a comma"></span>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col">
                                <input type="date" id="fromdate" name="startDate" value={startDate} onChange={onChange} className="input-tm" />
                            </div>
                            <div className="col">
                                <input type="date" id="todate" name="endDate" onChange={onChange} value={endDate} className="input-tm" />
                            </div>
                            <div className="col">
                                <text><i className="fa fa-video-camera teams-conference-meet-now" aria-hidden="true" style={{ color: "#5C3EB0" }}></i> Meet Now</text>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col">
                                <input type="time" id="fromtime" name="startTime" onChange={onChange} className="input-tm" />
                            </div>
                            <div className="col">
                                <input type="time" id="totime" name="endTime" onChange={onChange} className="input-tm" />
                            </div>
                            {/* <div className="col">
                                <text>30 min</text>
                            </div> */}
                        </div>
                    </div>
                    <div className="form-group">
                        <input type="text" className="bc" style={{ width: "100%" }} value={location} name="location" placeholder="Please enter location" onChange={onChange} />
                    </div>
                    <div className="form-group">
                        <textarea className="form-control textarea-details bc" name="meetingDetails" onChange={onChange} rows="8" style={{ backgroundColor: "#F2F2F2", color: "#222222", border: "0px", borderRadius: "0px" }} id="message" placeholder="Type details for this new meeting"></textarea>
                    </div>
                </form>
                {/* </div> */}
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" style={{ backgroundColor: "#5C3EB0", border: "1px solid #5C3EB0" }} onClick={onSubmitConference}>Send</button>
                    <button type="button" className="btn btn-outline-secondary mr-auto" data-dismiss="modal" onClick={(e) => onCloseWindow(e, hasShowTeamsConferenceWindow)}>Close</button>
                </div>
            </ul>
        </>
    )
}