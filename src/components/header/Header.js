import React from 'react';
import { connect } from "react-redux";
import cookie from 'js-cookie';
import moment from "moment";
import $ from "jquery";
import AuthHeader from "./resources/AuthHeader";
import { setSelectedClientName } from "../../actions/commons/commonActions";
import "./resources/header.css";
import { getClientUserFeatures } from "../../actions/auth/clientUserFeatures";
import { getCurrentUserClientList } from "../../actions/auth/userClients";
import { generateToken, setClientLogos } from "../../actions/commons/commonActions";
import { featureChecking } from "../../actions/auth/checkingFeature";
import LoginForm from '../Auth/Login';
import Loader from '../resources/Loader';
import { failureToast } from '../../actions/commons/toaster';
class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.onClientChange = this.onClientChange.bind(this);
        this.loginForm = '';
    }

    getInitialState = () => ({
        selectedClient: this.props.defaultClient,
        loading: false
    });

    onClientChange({ label, value }) {
        this.setState({ loading: true });
        localStorage.setItem('clientName', label);
        localStorage.setItem('client', value);
        this.props.setSelectedClientName(label);
        this.change(value);
    }

    static getDerivedStateFromProps(props, state) {
        if (state.selectedClient !== props.defaultClient) {
            return { selectedClient: props.defaultClient || null };
        }
        return null;
    }

    componentDidMount() {
        if (!localStorage.getItem("autologgedout")) {
            localStorage.setItem("autologgedout", moment().add(1, 'days').format());
            // this Header component will render for every nav(route changes) actions, So for avoiding uncessary calls, put this api calls in this if block;
            // autologgedout will setup only once per one login request; so below api calls, will run only one time at initial login request;
            // await this.setCurrentClientFeaturesAndTickets(this.state.current_selected_client);
            // await this.hasAdminAccess(this.state.current_selected_client);
        }
        const loggedoutDate = new Date(localStorage.getItem("autologgedout"));
        const currentDate = new Date();
        const diffTime = Math.abs(loggedoutDate - currentDate);
        // auto logged out after 24 hours;
        window.setTimeout(() => {
            clearInterval(window.localStorage.getItem("healthBoardIntervalFunc"));
            localStorage.clear();
            window.localStorage.clear();
            window.location.href = '/login';
        }, Math.ceil(diffTime));
        if (localStorage.getItem("redirectPath")) {
            const redirectPath = localStorage.getItem("redirectPath");
            localStorage.removeItem("redirectPath");
            return this.props.history.push(redirectPath);
        }
    }

    async change(currentValue) {
        const { masterClient: { clientId: masterClientId }, setClientLogos, userClients } = this.props;
        const clientId = (currentValue === "all") ? masterClientId : currentValue;
        const { generateToken } = await this.props.generateToken();
        const self = this;
        this.setState({ loading: true });
        this.props.getClientUserFeatures(clientId, generateToken, "active")
            .then(async (res) => {
                const { message, status } = res;
                if (status !== 200) {
                    const text = typeof message === "string" ? message : "Something went wrong while retrieving features!";
                    return failureToast(text);
                }
                await self.props.getCurrentUserClientList(currentValue);
                const index = Array.isArray(userClients) && userClients.findIndex(client => client.clientId === clientId);
                if (index > 0) {
                    setClientLogos({ clientLogos: userClients[index] });
                }
                self.setState({ loading: false });
                self.props.featureChecking();
            });
    }

    componentDidUpdate() {
        // var cookie_obj = Object.assign({ headers: { 'Cookie': [cookie.get('UserId'), cookie.get('UserGmail')] } });
        // if ((cookie_obj["headers"]["Cookie"][0] !== undefined && !localStorage.getItem("isSAMLAccess")) || localStorage.getItem('isAdfsLogin')) {
        //     this.loginForm && this.loginForm.getUserAccessDetails(localStorage.getItem("userId"));
        //     this.loginForm && localStorage.setItem("isSAMLAccess", true);
        //     this.loginForm && localStorage.removeItem("isAdfsLogin");
        // }
    }

    render() {
        const { userClients, userId } = this.props;
        return (
            !!userId &&
            <>
                <div style={{ display: "none" }}>
                    <LoginForm forSAMLRef={(ref) => (this.loginForm = ref)} {...this.props} />
                </div>
                <Loader loading={this.state.loading} />
                <AuthHeader
                    userClients={userClients}
                    onClientChange={this.onClientChange}
                    selectedClient={this.state.selectedClient}
                    {...this.props}
                />
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        userId: localStorage.getItem('userId'),
        clientId: state?.current_client?.payload?.client,
        masterClient: state?.masterClient,
        userClients: state?.userClients,
        defaultClient: localStorage.getItem('clientName')
    }
}

export default connect(mapStateToProps, { setSelectedClientName, getClientUserFeatures, getCurrentUserClientList, generateToken, setClientLogos, featureChecking })(Header);
