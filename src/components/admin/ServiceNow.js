import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux'
import ComponentHeader from '../resources/DashboardHeader';
import './servicenow.css';
import { generateToken } from '../../actions/commons/commonActions';
import { getServicenow, createServicenow, updateServicenow } from '../../actions/admin/servicenow';
import Loader from '../resources/Loader';
import { successToast, failureToast, infoToast } from '../../actions/commons/toaster';

class ServiceNow extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        apiBaseUrl: '',
        userName: '',
        userPassword: '',
        ticketCreationType: undefined,
        syncPattern: undefined,
        enableTicket: false,
        enableInventory: false,
        loading: false
    })

    onChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'enableInventory' || name === 'enableTicket') {
            return this.setState({ [name]: checked });
        }
        this.setState({ [name]: Number(value) ? Number(value) : value });
    }

    componentDidMount() {
        this.getServicenowConf();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.clientId !== this.props.clientId) {
            this.setState(this.getInitialState());
            this.getServicenowConf();
        }
    }

    getServicenowConf = async () => {
        const { generateToken, clientId, userId, getServicenow } = this.props;
        const { generateToken: apiToken } = await generateToken();
        this.setState({ loading: true });
        const res = await getServicenow(`?apiToken=${apiToken}&clientId=${clientId}&userId=${userId}`);
        this.setState({ loading: false });
    }

    createServiewnowConf = async () => {
        const { generateToken, clientId, userId, createServicenow, successToast, failureToast, infoToast } = this.props;
        const { apiBaseUrl, userName, userPassword, ticketCreationType, syncPattern, enableTicket, enableInventory } = this.state;
        const payload = {
            clientId, "sortName": "Service Now", "description": "Service Now", userId, apiBaseUrl,
            userName, userPassword, ticketCreationType, syncPattern, enableTicket, enableInventory
        }
        const { generateToken: apiToken } = await generateToken();
        payload['apiToken'] = apiToken;
        this.setState({ loading: true });
        const res = await createServicenow(payload);
        if (res.data.status === 200) {
            successToast(res.data.message);
            this.setState(this.getInitialState());
            this.getServicenowConf();
        }
        if (res.data.status === 201) {
            failureToast(res.data.message);
        }
        this.setState({ loading: false });
    }

    updateServiewnowConf = async () => {
        const { generateToken, clientId, userId, updateServicenow, successToast, failureToast } = this.props;
        const { apiBaseUrl, userName, userPassword, ticketCreationType, syncPattern, enableTicket, enableInventory } = this.state;
        const payload = {
            clientId, userId
        }
        const { generateToken: apiToken } = await generateToken();
        payload['apiToken'] = apiToken;
        payload['updateKeys'] = {
            apiBaseUrl: apiBaseUrl ? apiBaseUrl : undefined,
            userName: userName ? userName : undefined,
            userPassword: userPassword ? userPassword : undefined,
            ticketCreationType, syncPattern, enableTicket, enableInventory
        };
        this.setState({ loading: true });
        const res = await updateServicenow(payload);
        if (res.data.status === 200) {
            successToast(res.data.message);
            this.setState(this.getInitialState());
            this.getServicenowConf();
        }
        if (res.data.status === 201) {
            failureToast(res.data.message);
        }
        this.setState({ loading: false });
    }

    render() {
        const { apiBaseUrl, userName, userPassword, enableTicket, enableInventory, ticketCreationType, syncPattern, loading } = this.state;
        const { servicenowConf } = this.props;
        return (
            <>
                <Loader loading={loading} />
                <ComponentHeader
                    dashboardText={[{ name: 'Plugins', className: "component-head-text " }, { name: <NavLink className="btn veiw-btn plugin-back-btn" style={{ color: "#fff", padding: '0px' }} exact to="/admin/plugins">Back</NavLink>, className: 'btn add-new-tc' }]}
                />
                <div className="row m-o justify-content-between" style={{ background: "#F4F4F4", marginLeft: "0px" }}>
                    <div style={{ width: "100%" }}>
                        <div className="bgcolors" style={{ background: "#FFFFFF", padding: "7px 20px", fontSize: '18px' }}>
                            <span>Servicenow Configuration</span>
                        </div>

                        <div className="flex-content">
                            <div style={{ width: "50%", marginLeft: "30px", marginRight: "80px", marginTop: "30px" }}>
                                <label className="col-form-label ms-teams-label"><span className='color-red'>*</span>Domain/API URL:</label>
                                <input name="apiBaseUrl" onChange={this.onChange} type="text" className="form-control no-border" style={{ borderRadius: '0px' }} value={apiBaseUrl || servicenowConf.apiBaseUrl} />
                            </div>
                            <div style={{ width: "50%", marginLeft: "30px", marginRight: "80px", marginTop: "30px" }}>
                                <label className="col-form-label ms-teams-label"><span className='color-red'>*</span>Username:</label>
                                <input type="text" onChange={this.onChange} className="form-control no-border" style={{ borderRadius: '0px' }} name="userName" value={userName || servicenowConf.userName} />
                            </div>
                        </div>

                        <div className="flex-content">
                            <div style={{ width: "41.5%", marginLeft: "30px", marginRight: "80px", marginTop: "30px" }}>
                                <label className="col-form-label ms-teams-label"><span className='color-red'>*</span>Password:</label>
                                <input name="userPassword" onChange={this.onChange} type="password" className="form-control no-border" style={{ borderRadius: '0px' }} value={userPassword || servicenowConf.userPassword} />
                            </div>
                        </div>
                        <div className="d-flex" style={{ marginLeft: "30px", marginRight: "80px", marginTop: "30px" }}>
                            <div>
                                <input type='checkbox' name='enableTicket' onChange={this.onChange} checked={enableTicket || servicenowConf.enableTicket} />
                                <span style={{ marginLeft: "1rem" }}>Inventory</span>
                            </div>
                            <div style={{ marginLeft: "10rem" }}>
                                <input type='checkbox' onChange={this.onChange} name='enableInventory' checked={enableInventory || servicenowConf.enableInventory} />
                                <span style={{ marginLeft: "1rem" }}>Ticket</span>
                            </div>
                        </div>
                        {/*  */}
                        <div style={{ padding: '20px', margin: '10px' }}>
                            <h3>Initiate ServiceNow Ticket</h3>
                            <div>
                                <div class="form-check service-conf">
                                    <input class="form-check-input" type="radio" name="ticketCreationType" onChange={this.onChange} value={1} checked={ticketCreationType ? Number(ticketCreationType) === 1 : (Number(servicenowConf.ticketCreationType) === 1)} />
                                    <label class="form-check-label" for="manul">Manual</label>
                                </div>
                                <div class="form-check service-conf">
                                    <input class="form-check-input" type="radio" name="ticketCreationType" onChange={this.onChange} value={2} checked={ticketCreationType ? Number(ticketCreationType) === 2 : (Number(servicenowConf.ticketCreationType) === 2)} />
                                    <label class="form-check-label" for="auto">Auto</label>
                                </div>
                            </div>
                            <h3>Sync Pattern</h3>
                            <div>
                                <div class="form-check service-conf">
                                    <input class="form-check-input" type="radio" name="syncPattern" value={1} checked={syncPattern ? Number(syncPattern) === 1 : (Number(servicenowConf.syncPattern) === 1)} onChange={this.onChange} />
                                    <label class="form-check-label" >{`ServiceNow ==> Concierto`}</label>
                                </div>
                                <div class="form-check service-conf">
                                    <input class="form-check-input" type="radio" name="syncPattern" value={2} checked={syncPattern ? Number(syncPattern) === 2 : (Number(servicenowConf.syncPattern) === 2)} onChange={this.onChange} />
                                    <label class="form-check-label" >{`Concierto ==> ServiceNow`}</label>
                                </div>
                                <div class="form-check service-conf">
                                    <input class="form-check-input" type="radio" name="syncPattern" value={3} checked={syncPattern ? Number(syncPattern) === 3 : (Number(servicenowConf.syncPattern) === 3)} onChange={this.onChange} />
                                    <label class="form-check-label" >Bidirectional</label>
                                </div>
                                <div class="form-check service-conf">
                                    <input class="form-check-input" type="radio" name="syncPattern" value={4} checked={syncPattern ? Number(syncPattern) === 4 : (Number(servicenowConf.syncPattern) === 4)} onChange={this.onChange} />
                                    <label class="form-check-label" >Not Required</label>
                                </div>
                            </div>
                        </div>
                        <div className="flex-content" style={{ justifyContent: "center", margin: '3.25rem 0rem' }}>
                            <button style={{ margin: '0px 20px', border: '1px solid #d0c9c9', background: "#fff", width: '7.5rem', height: '2.75rem' }} onClick={() => this.setState(this.getInitialState())}>Cancel</button>
                            <button style={{ margin: '0px 20px', border: '1px solid #d0c9c9', color: "#fff", background: "#593CAB", width: '7.5rem', height: '2.75rem' }} onClick={servicenowConf.apiBaseUrl ? this.updateServiewnowConf : this.createServiewnowConf}>{servicenowConf.apiBaseUrl ? 'Update' : 'Connect'}</button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        servicenowConf: Array.isArray(state.getServicenowObj?.data) && state.getServicenowObj.data.length ? state.getServicenowObj.data[0] : {},
        userId: state?.current_user?.payload?.userId,
        clientId: state?.current_client?.payload?.client
    }
}

export default connect(mapStateToProps, { generateToken, getServicenow, createServicenow, updateServicenow, successToast, failureToast, infoToast })(ServiceNow);
