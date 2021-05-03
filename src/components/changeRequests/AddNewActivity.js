import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { saveActivityMetaInformation } from "../../actions/plannedActivity/activity"
import { generateToken } from "../../actions/commons/commonActions"
import { failureToast, successToast } from "../../actions/commons/toaster";
import $ from "jquery";
import Loader from '../resources/Loader';

class ActivityAddPage extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.state = {
            activity: "",
            isLoading: false
        };
    }


    handleChange = (e) => {
        e.preventDefault();
        const { value, name } = e.target;
        this.setState({ [name]: value });
    }
    showLoaderIcon = (isLoading) => this.setState({ isLoading });

    handleSubmit(e) {
        e.preventDefault();
        const refBtn = this.refs.addPA;
        refBtn && refBtn.setAttribute('disabled', 'disabled');
        const { userId: actionBy, clientId, featureId, fetchActivities, failureToast, successToast } = this.props;
        const { activity } = this.state;
        if (!activity) {
            refBtn && refBtn.removeAttribute("disabled");
            return failureToast("Please Enter Activity Name!");
        }
        // this.setState({ isLoading: true });
        const self = this;
        this.props.generateToken().then((token) => {
            self.showLoaderIcon(true);
            this.props.saveActivityMetaInformation({ activity, actionBy, clientId, featureId, apiToken: token.generateToken })
                .then((res) => {
                    self.showLoaderIcon(false);
                    if (res.newActivity && Number(res.newActivity.status) && res.newActivity.status !== 200) {
                        // self.setState({ isLoading: false });
                        const { message } = res.newActivity;
                        refBtn && refBtn.removeAttribute("disabled");
                        const text = typeof message === "string" ? message : "Something went wrong while creating activity!";
                        return failureToast(text);
                    }
                    refBtn && refBtn.removeAttribute("disabled");
                    successToast("Change Request has been created successfully");
                    fetchActivities();
                    this.setState({ activity: "" });
                    $('#addnewId').modal('hide');
                }).catch((err) => {
                    console.log(err);
                    self.showLoaderIcon(false);
                    refBtn && refBtn.removeAttribute("disabled");
                    failureToast("Something went wrong while creating activity!");
                });
        }).catch((err) => {
            self.showLoaderIcon(false);
            refBtn && refBtn.removeAttribute("disabled");
            failureToast("Something went wrong while creating activity!");
        });
    }

    handleCancel = () => {
        this.setState({ activity: "" });
        $('#addnewId').modal('hide');
    }

    render() {
        const { activity, isLoading } = this.state;
        return (
            <div className="form_block flex-fill mb-3 addForm" style={{ border: "none" }}>
                <Loader loading={isLoading} />
                <form className="add_edit_card" style={{ display: 'flex', flexDirection: 'column', marginBottom: "2rem", marginTop: "30px" }}>
                    <ul>
                        <li className="w-100" style={{ marginLeft: "3%", display: 'flex', flexDirection: 'column' }}>
                            <label style={{ display: 'inline-block', padding: '10px' }}>Activity Name</label>
                            <input type="text" id="txtActivity" name="activity" onChange={this.handleChange} style={{
                                margin: "1% 1%", border: "1px solid #ddd7d7", width: "92%", height
                                    : '2.5rem'
                            }} value={activity} />
                        </li>
                    </ul>
                    <div className="flex-content add-window" style={{ justifyContent: 'center', paddingTop: '20px' }}>
                        <button type="button" className="btn btn-align" data-dismiss="modal" onClick={this.handleCancel}>Close</button>
                        <button type="button" className="btn btn-align save-btn-all" onClick={this.handleSubmit} ref="addPA">Save</button>
                    </div>
                </form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    let fId = (state.clientUserFeatures.featureIds && state.clientUserFeatures.featureIds.PlannedActivity) ? state.clientUserFeatures.featureIds.PlannedActivity : ""
    return {
        userId: state.current_user.payload.userId,
        featureId: fId,
        clientId: state?.current_client?.payload?.client

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ saveActivityMetaInformation, generateToken, failureToast, successToast }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityAddPage);