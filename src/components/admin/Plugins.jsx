import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { productConfigUrls } from '../../util/apiManager';
import axios from "axios";
import { generateToken } from '../../actions/commons/commonActions';
import { failureToast, successToast } from "../../actions/commons/toaster";
import { MONITORING_TOOLS } from "../../constants/index";
import ComponentHeader from '../resources/DashboardHeader';
import './plugins.css';
import Loader from '../resources/Loader';

class Plugins extends Component {

    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
        this.state = {
            hasConfigurePrometheus: false,
            plugins: [],
            loading: false
        }
    }

    onChange = async (e, toolId) => {
        const { checked } = e.target;
        if (this.state.hasConfigurePrometheus) {
            return this.onUpdatePrometheus(toolId, checked);
        }
        const { generateToken, userId, clientId } = this.props;
        const { generateToken: apiToken } = await generateToken();
        await axios.post(productConfigUrls.postClientSubscriptionTools, {
            clientId,
            monitoringToolId: String(toolId),
            createdBy: userId,
            apiToken,
            userId
        });
        await this.getSubscribeTool();
        // if true , needs to go apiDetails section
    }

    onUpdatePrometheus = async (toolId, checked) => {
        const { generateToken, userId, clientId, failureToast, successToast } = this.props;
        const { generateToken: apiToken } = await generateToken();
        axios.put(productConfigUrls.editSubscriptionDetails, {
            clientId, userId, apiToken, updateKeys: {
                "status": Number(checked) ? 0 : 1
            },
            monitoringToolId: String(toolId)
        }).then(res => {
            if (Number(res.data.status) === 200) {
                this.getSubscribedToolsDetails();
            }
        });
    }

    componentDidMount() {
        const { hasShowOnlyEnabledTools } = this.props;
        !hasShowOnlyEnabledTools && this.getSubscribeTool();
        this.getSubscribedToolsDetails();
    }

    getSubscribedToolsDetails = async () => {
        const { generateToken: apiToken } = await this.props.generateToken();
        const self = this;
        let uri = `${productConfigUrls.getClientSubscriptionTools}?clientId=${self.props.clientId}&apiToken=${apiToken}&userId=${this.props.userId}`;
        axios.get(uri).then(res => {
            if (res.data.status === 200) {
                const data = res.data.data && res.data.data.subscribedToolDetails ? res.data.data.subscribedToolDetails : [];
                return self.setState({
                    plugins: self.setPlugins(data)
                });
            }
            // return self.setState({ isLoading: false }, () => self.props.failureToast('Something went wrong! Please try again'));
        }).catch(() => {
            // return self.setState({ isLoading: false }, () => self.props.failureToast('Something went wrong! Please try again'));
        });
    }

    setPlugins = (subscribedToolDetails) => {
        const { hasShowOnlyEnabledTools } = this.props;
        let plugins = Array.isArray(subscribedToolDetails) && subscribedToolDetails.map(item => {
            var status = item['status'] ? item['status'].toLowerCase() : '';
            const ss = hasShowOnlyEnabledTools ? status === "enabled" : true;
            return ss && {
                'name': item.monitoringToolName,
                'display': item.monitoringToolName,
                'toolId': item.monitoringToolId,
                'path': String(item.monitoringToolId) === String(MONITORING_TOOLS['9'].id) ? '/admin/plugins/prometheus' : '',
                'enableHooks': !hasShowOnlyEnabledTools, 'onChange': String(item.monitoringToolId) === String(MONITORING_TOOLS['9'].id) ? this.onChange : () => { },
                'icon': MONITORING_TOOLS[item.monitoringToolId].logoPath,
                'checked': status === "enabled"
            };
        });
        if (!hasShowOnlyEnabledTools) {
            const msTeam = { "checked": true, onChange: () => { }, 'enableHooks': true, "name": "Microsoft Teams", "display": "Microsoft Teams", "path": "/admin/plugins/ms-teams", "icon": "teams_icon_gray.svg" };
            const serviceNow = { "checked": true, toolId: MONITORING_TOOLS[10].id, onChange: this.onChange, 'enableHooks': true, "name": "Servicenow", "display": "Servicenow", "path": "/admin/plugins/servicenow", "text": "Servicenow", 'className': 'servicenow' }
            plugins.unshift(msTeam);
            plugins.push(serviceNow);
        }
        if (hasShowOnlyEnabledTools) {
            const { onSetActiveTools = () => { } } = this.props;
            // set active tools in event page;
            onSetActiveTools(plugins.filter(item => item));
        }
        return plugins.filter(item => item);
    }

    getSubscribeTool = async () => {
        const { generateToken: apiToken } = await this.props.generateToken();
        const self = this;
        let uri = `${productConfigUrls.getMappingByClient}?clientId=${self.props.clientId}&apiToken=${apiToken}&userId=${this.props.userId}&monitoringToolId=${MONITORING_TOOLS['9'].id}`;
        this.setState({ loading: true });
        axios.get(uri).then(res => {
            this.setState({ loading: false });
            if (res.data.status === 200) {
                const { data } = res.data;
                self.setState({
                    hasConfigurePrometheus: Array.isArray(data) && !!data.length
                });
            }
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.clientId !== prevProps.clientId) {
            this.getSubscribedToolsDetails();
            const { hasShowOnlyEnabledTools } = this.props;
            !hasShowOnlyEnabledTools && this.getSubscribeTool();
        }
    }

    render() {
        const { plugins, loading } = this.state;
        const { history, hasShowOnlyEnabledTools } = this.props;
        return (
            <>
                < Loader loading={loading} />
                {
                    hasShowOnlyEnabledTools ?
                        <ComponentHeader
                            dashboardText={[{ name: 'Admin', className: "component-head-text " }]}
                            tabsText={['Monitoring Apps', 'Mute', 'Config']}
                            onTabClick={this.props.onTabClick}
                            // hasShowBreadcrumb
                            breadCrumb={[{ name: 'Admin', path: '/admin' }, { name: 'Configure Event Rules / Monitoring Apps', path: '' }]}
                        />
                        :
                        <ComponentHeader
                            dashboardText={[{ name: 'Plugins', className: "component-head-text " }, { name: <NavLink className="btn veiw-btn btn-lg plugin-back-btn" exact to="/admin">Back</NavLink>, className: 'btn add-new-tc' }]}
                            hasShowBreadcrumb
                            breadCrumb={[{ name: 'Admin', path: '/admin' }, { name: 'Plugins', path: '' }]}
                        />
                }
                <div className="flex-wrap">
                    {Array.isArray(plugins) && plugins.length > 0 && plugins.map((tile, index) => {
                        return <div className="res-widgets" key={index}>
                            <div className="card-body">
                                {tile.enableHooks ? <div className="pmm" style={{
                                    float: 'right',
                                    marginTop: '-1rem',
                                    marginRight: '-1rem'
                                }}>
                                    {/* <h1 style={{ fontSize: '1rem', display: "inline-block" }}>Configure</h1> */}
                                    <label className="switch">
                                        <input type="checkbox" checked={tile.checked} onChange={(e) => {
                                            tile.onChange(e, tile.toolId);
                                        }} />
                                        <span className="slider round" style={{ width: '50px' }}>
                                        </span>
                                    </label>
                                </div> : null}
                                <div className="text-center" style={{ height: '4rem' }}>
                                    {
                                        tile.icon &&
                                        <img src={tile.icon ? require(`../assets/plugins/${tile.icon}`) : null} style={{ width: tile.width ? tile.width : '' }} ></img>
                                    }
                                    {
                                        tile.text && <div className={tile.className}>{tile.text}</div>
                                    }
                                </div>
                                <p id={tile.modalId ? tile.modalId : null} className="card-text text-center" onClick={() => tile.path && history.push(tile.path)}>
                                    <button type="button" className="btn btn-link" style={{
                                        fontSize: "1.5rem", whiteSpace: "normal", marginLeft: '-1.5rem'
                                    }}>{tile.display}</button>
                                </p>
                            </div>
                        </div>
                    }
                    )}
                </div>
            </>
        )
    }
}
const mapStateToProps = state => {
    return {
        userId: state.current_user.payload.userId,
        clientId: state?.current_client?.payload ? state.current_client.payload.client : ''
    }
}

export default connect(mapStateToProps, { generateToken, failureToast, successToast })(Plugins);
