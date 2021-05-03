import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import $ from "jquery";
import axios from "axios";
import { teamsConfiguration } from "../../util/apiManager";
import "./msteams.css";
import { generateToken } from "../../actions/commons/commonActions";
import ComponentHeader from '../resources/DashboardHeader';
import { failureToast, successToast } from '../../actions/commons/toaster';

class MSTeams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teamsList: [],
            getChannelsList: [],
            teamId: "",
            channelId: "",
            hasShowSettings: true
        };
        this.onOpenCreateTeam = this.onOpenCreateTeam.bind(this);
    }

    onOpenCreateTeam() {
        $('#createTeam').modal('show');
    }

    onCreateChannel = () => {
        $('#createChannel').modal('show');
    }

    onAddMember = () => {
        $('#addMember').modal('show');
    }

    componentDidMount() {
        this.getAllTeams();
    }

    componentDidUpdate() {
        this.enableCaret();
    }

    onChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        if (name === "emails") {
            const emails = value.split(',');
            return this.setState({ emails: emails });
        }
        this.setState({ [name]: value });
    }

    enableCaret = () => {
        if (!this.eventListenerAdded) {
            var toggler = document.getElementsByClassName("caret");
            this.eventListenerAdded = this.eventListenerAdded || false;
            var i;
            for (i = 0; i < toggler.length; i++) {
                toggler[i].addEventListener("click", function () {
                    this.parentElement.querySelector(".nested").classList.toggle("active-team");
                    this.classList.toggle("caret-down");
                    this.eventListenerAdded = true;
                });
            }
        }
    }

    getAllTeams = async () => {
        const { userId, generateToken, clientId } = this.props;
        const { teamsList } = this.state;
        const { generateToken: apiToken } = await generateToken();
        return Array.isArray(teamsList) && !teamsList.length && axios.post(teamsConfiguration.getTeamsList, { clientId, userId, apiToken })
            .then(res => {
                const { data } = res?.data || {};
                const { value } = data || {};
                this.setState({ teamsList: value });
                return value;
            }).catch(err => {
                console.log(err);
            });
    }

    getChannelsList = async (teamIndex, teamId) => {
        const { userId, generateToken, clientId } = this.props;
        const { getChannelsList } = this.state;
        const { generateToken: apiToken } = await generateToken();
        Array.isArray(getChannelsList) && !getChannelsList[teamIndex] && axios.post(teamsConfiguration.getChannelsList, { clientId, userId, apiToken, teamId })
            .then(res => {
                const { data } = res?.data || {};
                const { value } = data || {};
                this.setState(prevState => {
                    const prevChannels = prevState.getChannelsList;
                    const newArray = [...prevChannels];
                    newArray[teamIndex] = value;
                    return { getChannelsList: newArray, teamId: teamId };
                });
            }).catch(err => {
                console.log(err);
            });
    }

    onSelectedChannel(e, teamId, channelId) {
        this.setState({ teamId, channelId });
    }

    onSubmitCred = async (e) => {
        e.preventDefault();
        const { sortName, description, appClientId, clientSceret, tenantId, userName, userPassword } = this.state;
        const { generateToken, userId, clientId } = this.props;
        const { generateToken: apiToken } = await generateToken();
        const payload = { clientId, apiToken, sortName, description, appClientId, clientSceret, tenantId, userName, userPassword, userId };
        axios.post(teamsConfiguration.addMSTeamsSettings, payload)
            .then(res => {
                const { status, message } = res.data;
                if (Number(status) === 201) {
                    return failureToast(message);
                }
                return successToast('Settings Added Successfully');
            });
    }

    onCreateTeamSubmit = async (e) => {
        e.preventDefault();
        const { displayNameForTeam: displayName, descriptionForTeam: description } = this.state;
        const { generateToken, userId, clientId } = this.props;
        const { generateToken: apiToken } = await generateToken();
        axios.post(teamsConfiguration.createTeamsBehalfOfUser, {
            displayName, description, clientId, userId, apiToken
        })
            .then(res => {
                const { status, message } = res.data;
                if (Number(status) === 201) {
                    return failureToast(message);
                }
                $('#createTeam').modal('hide');
                return successToast(message);
            });
    }

    onCreateChannelSubmit = async (e) => {
        e.preventDefault();
        const { displayNameForChannel: displayName, descriptionForChannel: description, teamId } = this.state;
        const { generateToken, userId, clientId } = this.props;
        if (!teamId) {
            return failureToast('Please Select Team');
        }
        const { generateToken: apiToken } = await generateToken();
        axios.post(teamsConfiguration.createTeamsBehalfOfUser, { userId, clientId, apiToken, teamId, displayName, description, })
            .then(res => {
                const { status, message } = res.data;
                if (Number(status) === 201) {
                    return failureToast(message);
                }
                $('#createChannel').modal('hide');
                return successToast(message);
            });
    }

    onAddMemberSubmit = async (e) => {
        e.preventDefault();
        const { teamId, channelId, emails } = this.state;
        const { generateToken, userId, clientId } = this.props;
        if (!teamId || !channelId) {
            return failureToast('Please select Team/Channel');
        }
        const userEmails = Array.isArray(emails) && emails.map(email => email && email.trim());
        const { generateToken: apiToken } = await generateToken();
        axios.post(teamsConfiguration.addMemberTeamChannelBehalfOfUser, {
            apiToken, userId, clientId, teamId, channelId, userEmails
        }).then(res => {
            const { status, message } = res.data;
            if (Number(status) === 201) {
                return failureToast(message);
            }
            $('#addMember').modal('hide');
            return successToast(message);
        });
    }

    onNext = (e) => {
        e.preventDefault();
        this.setState({ hasShowSettings: false });
    }

    render() {
        const { getChannelsList, teamsList, channelId, hasShowSettings } = this.state;
        return (
            <>
                <ComponentHeader
                    dashboardText={[{ name: 'Plugins', className: "component-head-text " }]}
                    headerClass=""
                // tabsText={TICKET_TABS}
                // onTabClick={this.onTabClick}
                />

                { hasShowSettings && <div className="row m-o justify-content-between" style={{ background: "#F4F4F4", marginLeft: "0px" }}>
                    <div style={{ width: "100%" }}>
                        <div className="bgcolors" style={{ background: "#FFFFFF", padding: "7px 20px", fontSize: '18px' }}> <span>Teams Configuration Settings</span></div>
                        <div className="flex-content">
                            <div className="width-40" style={{ width: "50%", marginLeft: "30px", marginRight: "80px", marginTop: "30px" }}>
                                <label className="col-form-label ms-teams-label">Sort Name:</label>
                                <input name="sortName" onChange={this.onChange} type="text" className="form-control no-border modal-input-height ms-teams-input" placeholder="Teams Chat" />
                            </div>
                            <div className="width-40" style={{ width: "50%", marginLeft: "30px", marginRight: "80px", marginTop: "30px" }}>
                                <label className="col-form-label ms-teams-label">Description:</label>
                                <input type="text" onChange={this.onChange} className="form-control no-border modal-input-height ms-teams-input" name="description" placeholder="Teams Chat" />
                            </div>
                        </div>
                        <div className="flex-content">
                            <div className="width-40" style={{ width: "50%", marginLeft: "30px", marginRight: "80px", marginTop: "30px" }}>
                                <label className="col-form-label ms-teams-label">App Client ID:</label>
                                <input type="text" onChange={this.onChange} className="form-control no-border modal-input-height ms-teams-input" placeholder="Client Id" name="appClientId" />
                            </div>
                            <div className="width-40" style={{ width: "50%", marginLeft: "30px", marginRight: "80px", marginTop: "30px" }}>
                                <label className="col-form-label ms-teams-label">Client Secret:</label>
                                <input type="text" onChange={this.onChange} className="form-control no-border modal-input-height ms-teams-input" placeholder="Client Secret" name="clientSceret" />
                            </div>
                        </div>
                        <div className="flex-content">
                            <div className="width-40" style={{ width: "50%", marginLeft: "30px", marginRight: "80px", marginTop: "30px" }}>
                                <label className="col-form-label ms-teams-label">Tenant ID:</label>
                                <input type="text" onChange={this.onChange} className="form-control no-border modal-input-height ms-teams-input" placeholder="Tenant Id" name="tenantId" />
                            </div>
                            <div className="width-40" style={{ width: "50%", marginLeft: "30px", marginRight: "80px", marginTop: "30px" }}>
                            </div>
                        </div>
                        <div className="bgcolors" style={{ marginTop: "50px", marginLeft: "30px" }}> <span>User Details</span></div>
                        <div className="flex-content">
                            <div className="width-40" style={{ width: "50%", marginLeft: "30px", marginRight: "80px", marginTop: "10px" }}>
                                <label className="col-form-label ms-teams-label">User Name:</label>
                                <input type="text" onChange={this.onChange} className="form-control no-border modal-input-height ms-teams-input" placeholder="Client Id" name="userName" />
                            </div>
                            <div className="width-40" style={{ width: "50%", marginLeft: "30px", marginRight: "80px", marginTop: "10px" }}>
                                <label className="col-form-label ms-teams-label">User Password:</label>
                                <input type="text" onChange={this.onChange} className="form-control no-border modal-input-height ms-teams-input" placeholder="Client Secret" name='userPassword' />
                            </div>
                        </div>
                        <div className="flex-content" style={{ justifyContent: "center", marginTop: "50px" }}>
                            <button style={{ margin: '0px 20px', border: '1px solid #d0c9c9', background: "#fff", width: '7.5rem', height: '2.75rem' }}>Cancel</button>
                            <button style={{ margin: '0px 20px', border: '1px solid #d0c9c9', color: "#fff", background: "#593CAB", width: '7.5rem', height: '2.75rem' }} onClick={this.onSubmitCred}>Submit</button>
                            <button style={{ margin: '0px 20px', border: '1px solid #d0c9c9', background: "#fff", width: '7.5rem', height: '2.75rem' }} onClick={this.onNext}>Next</button>
                        </div>
                    </div>
                </div>}
                {!hasShowSettings && <>
                    {/* teams groups */}
                    <div>
                        <ul className="teamBox ul-list" id="myUL">
                            <div className="teamHead">
                                <div className="ms-teams-icon" style={{ padding: "0px 20px" }}>Teams</div>
                                <div className="teams-head">Microsoft Teams</div>
                            </div>
                            <div style={{ margin: "5px 20px" }}>
                                <div className="btm-border">
                                    {
                                        Array.isArray(teamsList) && teamsList.map((team, index) =>
                                            <li key={team.id}>
                                                <span className="caret" onClick={(e) => this.getChannelsList(index, team.id)}>
                                                    <span className="teamIcon ">CC</span>
                                                    <span className=" teamText">{team.displayName}</span>
                                                </span>
                                                <ul className="nested">
                                                    {
                                                        Array.isArray(getChannelsList) && getChannelsList[index] && getChannelsList[index].map(channel =>
                                                            <li key={channel.id} onClick={(e) => this.onSelectedChannel(e, team.id, channel.id)} className={`channelText ${channelId === channel.id ? "active-channel" : ""}`}>{channel.displayName}</li>
                                                        )
                                                    }
                                                </ul>
                                            </li>
                                        )
                                    }
                                </div>
                            </div>
                            <div class="teamBoxFooter">
                                <div class="teamRow" style={{ borderTop: '1px solid #ccc', padding: '20px', cursor: "pointer" }} onClick={this.onOpenCreateTeam}>
                                    <span style={{ color: '#5C3EB0' }} class="teamText">
                                        <i className="fa fa-users" aria-hidden="true" style={{ marginRight: "5px" }}></i>Create Team</span>
                                </div>
                            </div>
                        </ul>
                        <div class="teamBox" style={{ backgroundColor: 'transparent' }}>
                            <div style={{ padding: "20px" }}>
                                <span class="teamIcon">CC</span>
                                <span style={{ width: '100%', color: '#000000', borderBottom: "1px solid #d8cbcb" }}>Concierto.cloud</span>
                            </div>
                            <div class="flex-content" style={{ overflowX: "hidden" }}>
                                <div>
                                    <div class="teamRow" onClick={this.onAddMember}>
                                        <img src="https://statics.teams.cdn.office.net/hashedassets/wmAddMembers-804dc7c.svg" />
                                        <button className="add-member">Add people</button>
                                    </div>
                                </div>
                                <div>
                                    <div class="teamRow" onClick={this.onCreateChannel}>
                                        <img src="https://statics.teams.cdn.office.net/hashedassets/wmCreateChannel-7088ce9.svg" />
                                        <button className="add-channel">Add Channel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* create team window */}
                    <div class="modal" id="createTeam">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title">Create Team</h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="form-group">
                                            <label style={{ display: "block" }}>Team Name</label>
                                            <input style={{ width: "100%" }} name="displayNameForTeam" className='input-ct' value={this.state.displayNameForTeam} onChange={this.onChange} />
                                        </div>
                                        <div class="form-group">
                                            <label>Description</label>
                                            <textarea class="form-control" rows="5" name="descriptionForTeam" value={this.state.descriptionForTeam} onChange={this.onChange} placeholder="Note..."></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer" style={{ textAlign: "center" }}>
                                    <button type="button" onClick={this.onCreateTeamSubmit} class="btn" style={{ border: '1px solid #593CAB', color: "#593CAB", background: "#fff", width: "4.4rem", borderRadius: "0", height: "2rem", padding: "1px" }}>Create</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* add people */}
                    <div class="modal" id="addMember">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title">Add Member</h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="form-group">
                                            <label style={{ display: "block" }}>Add Member</label>
                                            <input style={{ width: "100%" }} className='input-ct' value={this.state.emails} name="emails" onChange={this.onChange} />
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer" style={{ textAlign: "center" }}>
                                    <button type="button" class="btn" style={{ border: '1px solid #593CAB', color: "#593CAB", background: "#fff", width: "4.4rem", borderRadius: "0", height: "2rem", padding: "1px" }} onClick={this.onAddMemberSubmit}>Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* add channel */}
                    <div class="modal" id="createChannel">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title">Add Channel</h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="form-group">
                                            <label style={{ display: "block" }} >Channel Name</label>
                                            <input style={{ width: "100%" }} name="displayNameForChannel" value={this.state.displayNameForChannel} onChange={this.onChange} className='input-ct' />
                                        </div>
                                        <div class="form-group">
                                            <label>Description</label>
                                            <textarea class="form-control" rows="5" name="descriptionForChannel" value={this.state.descriptionForChannel} onChange={this.onChange} placeholder="Note..."></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer" style={{ textAlign: "center" }}>
                                    <button type="button" class="btn" style={{ border: '1px solid #593CAB', color: "#593CAB", background: "#fff", width: "4.4rem", borderRadius: "0", height: "2rem", padding: "1px" }} onClick={this.onCreateChannelSubmit}>Create</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        userId: localStorage.getItem('userId'),
        clientId: localStorage.getItem('client'),
        featureId: state?.clientUserFeatures?.featureIds?.Tickets,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        generateToken
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MSTeams)