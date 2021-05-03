import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import ComponentHeader from '../resources/DashboardHeader';
import "./resources/page.css";

class Prometheus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiURL: 'https://demo.concierto.in/api/v1/triggerPrometheus'
        }
    }

    onChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSubmitCred = () => {
        window.location = '/admin/eventListener'
    }

    startConfBtn = {
        width: '12.875rem',
        height: '2.375rem',
        // background: '#5C3EB0 0% 0% no-repeat padding-box',
        letterSpacing: '0px',
        color: '#FFFFFF',
        opacity: 1,
        border: 'none',
        margin: '0px 0.625rem'
    }
    render() {
        const { apiURL } = this.state;
        return (
            <>
             <ComponentHeader
                    dashboardText={[{ name: 'Plugins', className: "component-head-text " }, { name: <NavLink className="btn veiw-btn btn-lg plugin-back-btn" exact to="/admin/plugins">Back</NavLink>, className: 'btn add-new-tc' }]}
                />
            <div className="row m-o justify-content-between" style={{ background: "#F4F4F4", marginLeft: "0px" }}>
                <div style={{ width: "100%" }}>
                    <div className="bgcolors" style={{ background: "#FFFFFF", padding: "7px 20px", fontSize: '18px' }}> <span>Prometheus Configuration</span></div>
                    <div className="flex-content" style={{ marginTop: "1.25rem", marginBottom: "1.5rem" , marginLeft: "1.5rem" }}>
                        <div style={{ padding: "0px 20px",width: "100%"   }}>
                            <label className="col-form-label" style={{ fontWeight: "bold" }}>Webhook Endpoint:</label>
                            <input name="sortName" name="apiURL" value={apiURL} /* onChange={this.onChange} */ type="text" className="form-control no-border modal-input-height prometheus-input" placeholder="API Details" style={{width: "95%"}} />
                        </div>
                    </div>
                    <details style={{ padding: "7px 20px" ,marginLeft: "1.5rem", marginBottom: "1.5rem"}}>
                        <summary>Prometheus listener is enabled on Concierto.Cloud.</summary>
                        <p>You can start configuring rules to automatically generate tickets, send notifications and much more. Please use the above API details to configure the AlertManager on your Prometheus application to broadcast the alerts. For more details visit
                        <a style={{ textDecoration: "underline", marginLeft: "5px" }} href="https://prometheus.io/docs/prometheus/latest/getting_started/#configure-prometheus-to-monitor-the-sample-targets">Prometheus</a>
                        </p>
                    </details>
                </div>
                <div className="flex-content" style={{ justifyContent: "center", width: "100%", marginTop: "12rem" }}>
                    <button className="btn btn-info" onClick={() => window.location = '/admin/plugins'} style={{ width: "8.9375rem", height: "2.375rem", color: '#000', border: '0.5px solid #5C3EB0', background: "#FFFFFF 0% 0% no-repeat padding-box", margin: '0px 0.625rem' }}><text className="cancel-btn">Cancel</text></button>
                    <button className="btn btn-info btn-start-config" style={this.startConfBtn} onClick={this.onSubmitCred}><text className="start-config-btn">Start Configuration</text></button>
                </div>
            </div>
            </>
        );
    }
}

export default Prometheus;