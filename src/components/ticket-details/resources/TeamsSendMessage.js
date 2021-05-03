import React from 'react';

export default function SendMessageTeamsBox(props) {
    const { onCloseWindow, hasShowTeamsSendBox, teamsList, onCaretOpen, onTeamsMessageChange,
        getChannelsList, teamsSendMessage, selectedChannelId, onSelectedChannel, sendTeamsMessage, ticketId } = props;
    return (
        <>
            <ul className="teamBox teams-mess ul-list" id="myUL">
                <div className="teamHead">
                    <div className="ms-teams-icon" style={{ padding: "0px 20px", margin: "15px" }}>Teams</div>
                    <div className="teams-head teams-send-message-head">Microsoft Teams</div>
                    <div className="close-x" style={{ cursor: "pointer" }} onClick={(e) => onCloseWindow(e, hasShowTeamsSendBox)}>&times;</div>
                </div>
                <div style={{ margin: "5px 20px" }}>
                    <div className="btm-border">
                        {
                            Array.isArray(teamsList) && teamsList.map((team, index) =>
                                <li key={team.id}>
                                    <span className="caret" onClick={(e) => onCaretOpen(index, team.id)}>
                                        <span className="teamIcon ">CC</span>
                                        <span className=" teamText teams-send-message-text">{team.displayName}</span>
                                    </span>
                                    <ul className="nested">
                                        {
                                            Array.isArray(getChannelsList) && getChannelsList[index] && getChannelsList[index].map(channel =>
                                                <li key={channel.id} onClick={(e) => onSelectedChannel(e, team.id, channel.id)} className={`channelText ${selectedChannelId === channel.id ? "active-channel" : ""}`}>{channel.displayName}</li>
                                            )
                                        }
                                    </ul>
                                </li>
                            )
                        }
                    </div>
                    <div className="ms-tab-sub">
                        <span className="subject-ms">Subject:</span> <strong>Ticket #{ticketId}</strong>
                    </div>
                </div>
                <div className="teamBoxFooter">
                    <div>
                        <div className="circle">KS</div>
                    </div>
                    <div className="send-msg-box">
                        <div style={{
                            border: "0.5px solid #c7c4c4",
                            borderBottom: "none"
                        }}>
                            <div style={{ paddingLeft: "10px" }}> {localStorage.getItem('userName')} (Trianz) {new Date().getHours() + ':' + new Date().getMinutes()}</div>
                            <textarea className="messg-input textarea-bg"/*  rows="8"  */ name="teamsSendMessage" onChange={onTeamsMessageChange} value={teamsSendMessage} style={{ outline: "none" }} placeholder="Type details for this new meeting"></textarea>
                        </div>
                        <div className="reply-btn" style={{
                            border: "0.5px solid #c7c4c4",
                            borderTop: "none",
                            cursor: "pointer"
                        }}
                            onClick={sendTeamsMessage}
                        >
                            <i className="fa fa-share" style={{ marginRight: "1rem", cursor: "pointer" }} onClick={sendTeamsMessage}></i>Send
                                </div>
                        <div style={{ display: "none" }}>
                            <div className="float-left">
                                <i className="fa fa-paperclip" style={{ marginRight: "0.5rem" }}></i>
                            Attachments
                                </div>
                            <div className="float-right">
                                <i className="fa fa-paper-plane"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </ul>
        </>
    )
}