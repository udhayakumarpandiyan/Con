import React, { Component } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import axios from "axios";
import { userApiUrls, masterApiUrls } from "../../util/apiManager";
import $ from 'jquery';
import _ from "lodash";
import cookie from 'js-cookie';
// import { ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
/* Actoins */
import { generateToken, setClientLogos, getAllMasterData, setMasterDataOptions } from "../../actions/commons/commonActions";
import { getClientMasterClient } from "../../actions/monitoring/monitoringMain";
import { getDefaultClientFromUser, setSelectedClientInState, getDefaultClientSAMLFromUser } from "../../actions/auth/userClients"
import { getClientUserFeatures } from "../../actions/auth/clientUserFeatures";
import { featureChecking } from "../../actions/auth/checkingFeature";
import { login } from "../../actions/auth";
import { failureToast, successToast } from "../../actions/commons/toaster"
import { fetchSsoLoginUrl } from "../../actions/hostInventory/awsHostInventoryMain";
import { graphanaWidgetList } from "../../actions/cemDashboard/activeEvents";
// import { GOOGLE_CAPTCH_KEY } from "../../constants/index";
import "./resources/page.css";
import slide1 from "../../assets/concierto/images/slide1.png";
import slide2 from "../../assets/concierto/images/slide2.png";
import slide3 from "../../assets/concierto/images/slide3.png";
/* orch engine api's */
// import useRequest from '../../util/useRequest';
import { RootAPI } from '../../api';
/*  */
import logo from "../assets/resources/Concierto_logo_white.png";

class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getUserAccessDetails = this.getUserAccessDetails.bind(this);
    this.getLoggedInUserDetails = this.getLoggedInUserDetails.bind(this);
    this.setInitialState = this.setInitialState.bind(this);
    this.setShowAuditReport = this.setShowAuditReport.bind(this);
    this.showLoaderIcon = this.showLoaderIcon.bind(this);
    this.verifyOtpResetPassword = this.verifyOtpResetPassword.bind(this);
    this.resetRecaptcha = this.resetRecaptcha.bind(this);
    this.recaptchaRef = React.createRef();
  }

  getInitialState = () => ({
    userName: '',
    password: '',
    otp: "",
    otpFormHidden: false,
    resetPasswordFormHidden: false,
    showMFAForm: true,
    submitUserNameFormHidden: true,
    confirmPassword: "",
    newPassword: "",
    mfaToken: "",
    userName1: '',
    password1: '',
    userName2: '',
    userName3: '',
    oldPassword: '',
    newPasswordChange: '',
    confirmNew: '',
    allClientIds: [],
    resendOTP: false
  });

  setInitialState() {
    this.setState(this.getInitialState());
  }

  componentDidMount() {
    const { forSAMLRef } = this.props;
    forSAMLRef && forSAMLRef(this);
    const { user_clients } = this.props;
    const allClientIds = Array.isArray(user_clients) && user_clients.length ? user_clients.map(x => x.clientId) : []
    this.setState({ allClientIds });
  }

  componentDidUpdate() {
    const { forSAMLRef, auth, history } = this.props;
    if (localStorage.getItem("isSAML") && auth) {
      if (forSAMLRef && typeof forSAMLRef === "function") {
        return localStorage.removeItem("isSAML");
      }
      forSAMLRef && forSAMLRef(this);
      history && history.push('/');
    }
    // for adfs login success, replace path;
    if (localStorage.getItem("isAdfsLogin") && auth) {
      forSAMLRef && forSAMLRef(this);
      history && history.push('/home');
      return;
    }
  }

  async setShowAuditReport(loggedInId) {
    const { failureToast, generateToken, userId } = this.props;
    const { generateToken: apiToken } = await generateToken();
    axios.get(`${masterApiUrls.getProductConfiguration}?userId=${userId}&apiToken=${apiToken}`)
      .then(response => {
        if (response.data && response.data.status !== 200) {
          const { message } = response.data;
          const text = typeof message === "string" ? message : "Something went wrong while retrieving audit report!"
          return failureToast(text);
        }
        const { assurenceApprover, assurenceSubmitt } = response.data && response.data.data ? response.data.data : {};
        const hasApprover = Array.isArray(assurenceApprover) && assurenceApprover.findIndex(i => i.userId === loggedInId) > -1;
        if (hasApprover) {
          localStorage.setItem("reportApprover", true);
        }
        const hasShowAuditReport = Array.isArray(assurenceApprover) && !!assurenceApprover.length && Array.isArray(assurenceSubmitt) && !!assurenceSubmitt.length;
        if (hasShowAuditReport && (hasApprover || assurenceSubmitt.findIndex(i => i.userId === loggedInId) > -1)) {
          localStorage.setItem("showAuditReport", true);
        }
      }).catch(exception => {
        const message = typeof exception.message === "string" ? exception.message : "Something went wrong!";
        failureToast(message);
      });
  }

  showLoaderIcon(isLoading) {
    this.setState({ isLoading });
  }

  async onSubmit(e) {
    e.preventDefault();
    const { userName, password, mfaToken } = this.state;
    let loginRequest = { userName, password };
    Promise.all([this.onConciertoLogin({ ...loginRequest, mfaToken }), this.orchLogin(loginRequest)])
  }

  orchLogin = async ({ userName: username, password }) => {
    await RootAPI.login(username, password);
  }

  async onConciertoLogin(loginRequest) {
    const { failureToast, login } = this.props;
    this.showLoaderIcon(true);
    const self = this;
    login(loginRequest)
      .then(async (res) => {
        if (res && res.data.status !== 200) {
          const { message } = res.data;
          const text = typeof message === "string" ? message : "Something went wrong while logging in!";
          failureToast(text)
          return self.showLoaderIcon(false);
        }
        if (res.data.data.firstTimeLogin == true && res.data.status == 200) {
          self.showLoaderIcon(false);
          return $('#changePasswordModel').modal('show');
        }
        await self.getUserAccessDetails(res.data.data.userId);
        localStorage.setItem('userId', res.data.data.userId);
        $('#concierto-body').removeClass('login-theme');
      });
  }

  async masterData(userId) {
    const { generateToken, setMasterDataOptions } = this.props;
    const { generateToken: apiToken } = await generateToken();
    let codes = "SM,SA,TT,TA,DM,ST,CRT";
    return this.props.getAllMasterData(codes, userId, apiToken).then((res) => {
      const statusList = _.filter(res.masterData, { code: "SM" });
      const priorityList = _.filter(res.masterData, { code: "SA" });
      const ticketType = _.filter(res.masterData, { code: "TT" });
      const stateList = _.filter(res.masterData, { code: "TA" });
      const deviceType = _.filter(res.masterData, { code: "DM", name: "Others" });
      const CRState = _.filter(res.masterData, { code: "ST" });
      const CRType = _.filter(res.masterData, { code: "CRT" });
      setMasterDataOptions([{ statusList, priorityList, ticketType, stateList, deviceType, CRState, CRType }]);
      // return this.setState({ statusList: statusList, priorityList: priorityList, ticketType: ticketType, stateList: stateList, deviceType: deviceType });
    }).catch((err) => {
      return this.props.failureToast("Something went wrong whilte getting master data!");
    });
  }

  async getUserAccessDetails(userId) {
    await this.getLoggedInUserDetails(userId);
    this.showLoaderIcon(false);
    this.setShowAuditReport(userId);
    this.masterData(userId);
    return;
  }

  async getLoggedInUserDetails(userId) {
    const { setClientLogos } = this.props;
    // var cookie_obj = Object.assign({ headers: { 'Cookie': [cookie.get('UserId'), cookie.get('UserGmail')] } });
    // SAML request
    // if (cookie_obj["headers"]["Cookie"][0] !== undefined) {
    //   let { generateToken } = await this.props.generateToken();
    //   let client = await this.props.getDefaultClientSAMLFromUser(userId, generateToken);
    //   if (localStorage.getItem("client") === null) {
    //     if (client.userClients.length > 0 && client.userClients[0].clientId !== undefined) {
    //       const clinetID = client.userClients[0].clientId;
    //       localStorage.setItem("client", clinetID);
    //       localStorage.setItem('clientName', client.userClients[0].name);
    //       this.getLoggedInUSerClients(clinetID);
    //       setClientLogos({ clientLogos: client.userClients[0] });
    //       // this.graphanaWidgetList(clinetID);
    //     }
    //   }
    // } else {
    let { generateToken } = await this.props.generateToken();
    let client = await this.props.getDefaultClientFromUser(userId, generateToken);
    if (!localStorage.getItem("client")) {
      if (client.userClients.length > 0 && client.userClients[0].clientId) {
        const clinetID = client.userClients[0].clientId;
        await this.props.setSelectedClientInState(clinetID);
        localStorage.setItem("client", clinetID);
        localStorage.setItem('clientName', client.userClients[0].name);
        setClientLogos({ clientLogos: client.userClients[0] });
        return await this.getLoggedInUSerClients(clinetID);
      }
    }
  }

  async getLoggedInUSerClients(clientId) {
    const { masterClient: { clientId: masterClientId } } = await this.props.getClientMasterClient();
    const payloadId = clientId === "all" ? masterClientId : clientId;
    let { generateToken: apiToken } = await this.props.generateToken();
    // status is active
    let home = this.props?.history?.replace?.('/home');
    await this.props.getClientUserFeatures(payloadId, apiToken, "active");
    // checking default client has access for available features;
    await this.props.featureChecking();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  changePassword() {
    const { userName3: userName, oldPassword, newPasswordChange: newPassword, confirmNew: confirmPassword } = this.state;
    const actionBy = localStorage.getItem("userId");
    const { successToast, failureToast } = this.props;
    const payload = { userName, oldPassword, newPassword, confirmPassword, actionBy };
    const self = this;
    this.props.generateToken()
      .then(res => {
        if (res.generateToken) {
          payload["apiToken"] = res.generateToken;
          self.showLoaderIcon(true);
          axios.put(userApiUrls.changePassword, payload)
            .then(async (res) => {
              if (res.data.status == 200) {
                successToast(res.data.message);
                self.showLoaderIcon(false);
                localStorage.clear();
                window.location = "/login";
              }
              failureToast(res.data.message);
              self.showLoaderIcon(false);
            }).catch(error => {
              const message = typeof error.message === "string" ? error.message : "Something went wrong!";
              failureToast(message);
              self.showLoaderIcon(false);
            });
        }
      }).catch(error => {
        const message = typeof error.message === "string" ? error.message : "Something went wrong!";
        failureToast(message);
        self.showLoaderIcon(false);
      });
  }

  submitUserName() {
    const { failureToast, successToast } = this.props;
    if (!this.state.userName2.trim()) {
      this.showLoaderIcon(false);
      return failureToast('Please Enter User Name!');
    }
    const self = this;
    axios.post(userApiUrls.sendOtp, { "userName": this.state.userName2 })
      .then(res => {
        if (res.data.status == 200) {
          successToast(res.data.message);
          self.showLoaderIcon(false);
          return this.setState({
            otpFormHidden: false,
            resetPasswordFormHidden: true,
            submitUserNameFormHidden: false,
            otp: '',
            newPassword: "",
            confirmPassword: ""
          });
        }
        failureToast(res.data.message);
        return self.showLoaderIcon(false);
      }).catch(error => {
        const message = typeof error.message === "string" ? error.message : "Something went wrong!";
        failureToast(message);
        self.showLoaderIcon(false);
      });
  }

  resendOTPReq() {
    this.setState({
      otpFormHidden: false,
      resetPasswordFormHidden: false,
      submitUserNameFormHidden: false,
      resendOTP: true,
      otp: '',
      newPassword: "",
      confirmPassword: ""
    });
  }

  submitOtp() {
    const { failureToast, successToast } = this.props;
    const { userName2: userName, otp } = this.state;
    const self = this;
    self.showLoaderIcon(true);
    axios.post(userApiUrls.verifyOtp, { userName, otp })
      .then(res => {
        if (res.data && res.data.status == 200) {
          const { data: { otpAuthStr } } = res.data || { data: {} };
          successToast(res.data.message);
          this.setState({
            otpFormHidden: false,
            resetPasswordFormHidden: true,
            otpAuthStr
          });
          return self.showLoaderIcon(false);
        }
        self.setState({ otp: "" });
        failureToast(res.data.message);
        self.showLoaderIcon(false);
      }).catch(error => {
        const message = typeof error.message === "string" ? error.message : "Something went wrong!";
        failureToast(message);
        self.showLoaderIcon(false);
      });
  }

  closeModalOnSuccess = () => {
    $(".modal-backdrop").remove();
    $("#modalClose1").click();
    $("#modalClose2").click();
    $("#modalClose3").click();
  }

  submitResetPassword() {
    const { failureToast, successToast } = this.props;
    const { userName2: userName, newPassword, confirmPassword, otpAuthStr } = this.state;
    const self = this;
    self.showLoaderIcon(true);
    axios.put(userApiUrls.resetPassword, { userName, newPassword, confirmPassword, otpAuthStr })
      .then(res => {
        if (res.data.status == 200) {
          successToast(res.data.message);
          self.setInitialState();
          self.closeModalOnSuccess();
          return self.showLoaderIcon(false);
        }
        failureToast(res.data.message);
        return self.showLoaderIcon(false);
      }).catch(error => {
        const message = typeof error.message === "string" ? error.message : "Something went wrong!";
        failureToast(message);
        self.showLoaderIcon(false);
      });
  }

  verifyOtpResetPassword() {
    const { failureToast, successToast } = this.props;
    const { userName2: userName, newPassword, confirmPassword, otp } = this.state;
    const self = this;
    self.showLoaderIcon(true);
    axios.post(userApiUrls.verifyOtpResetPassword, { userName, newPassword, confirmPassword, otp })
      .then(res => {
        if (res.data.status == 200) {
          successToast(res.data.message);
          self.setInitialState();
          self.closeModalOnSuccess();
          return self.showLoaderIcon(false);
        }
        failureToast(res.data.message);
        return self.showLoaderIcon(false);
      }).catch(error => {
        const message = typeof error.message === "string" ? error.message : "Something went wrong!";
        failureToast(message);
        self.showLoaderIcon(false);
      });
  }

  cancelBtn() {
    this.setInitialState();
  }

  resetMFA() {
    const { userName1: userName, password1: password } = this.state;
    const { failureToast, successToast } = this.props;
    const self = this;
    self.showLoaderIcon(true);
    axios.put(userApiUrls.resetMfaToken, { userName, password })
      .then(res => {
        if (res.data.status == 200) {
          successToast(res.data.message);
          this.setState({ mfaData: res.data.data.mfaSecret, showMFAForm: false });
          return self.showLoaderIcon(false);
        }
        failureToast(res.data.message);
        return self.showLoaderIcon(false);
      }).catch(error => {
        const message = typeof error.message === "string" ? error.message : "Something went wrong!";
        failureToast(message);
        self.showLoaderIcon(false);
      });
  }

  ssoLogin = async (e) => {
    e.preventDefault();
    let { fetchSsoLoginUrl, failureToast } = this.props;
    fetchSsoLoginUrl()
      .then(res => {
        try {
          if (res.data.status !== 200) {
            return failureToast('SSO URL not found');
          }
          let { ssoLoginUrl } = res.data.data;
          if (ssoLoginUrl) {
            localStorage.setItem("isLoginFirst", true);
            window.location.href = typeof ssoLoginUrl === "string" ? ssoLoginUrl : ssoLoginUrl && ssoLoginUrl.url;
            return;
          }
          return failureToast('Login SSO URL not found');
        } catch (err) {
          return failureToast('Login SSO URL not found');
        }
      }).catch(ex => {
        let msg = ex.message ? ex.message : 'Something went wrong. Please try again';
        return failureToast(msg);
      })
  }

  graphanaWidgetList = async (clientId) => {
    const { failureToast, graphanaWidgetList, generateToken, userId } = this.props;
    const { generateToken: apiToken } = await generateToken();
    const bodydata = {
      apiToken: apiToken,
      clientId,
      userId: userId,
    };
    const self = this;
    graphanaWidgetList(bodydata)
      .then(res => {
        if (res.data && res.data.status !== 200) {
          const { message } = res.data;
          const text = typeof message === "string" ? message : "Something went wrong while fetching events!";
          return failureToast(text);
        }
      }).catch((err) => {
        return failureToast("Something went wrong. Please try again!");
      });
  }

  onCapChange = (text, hasPasswordFormHidden) => {
    if (text) {
      this.showLoaderIcon(true);
      const { failureToast } = this.props;
      const self = this;
      axios.post(userApiUrls.validateRecaptcha, { "g-recaptcha-response": text })
        .then(res => {
          const { status, message } = res.data || {};
          if (status !== 200) {
            self.showLoaderIcon(false);
            return failureToast(message);
          }
          self.submitUserName();
          if (hasPasswordFormHidden) {
            self.setState({ resetPasswordFormHidden: true, resendOTP: false });
          }
        }).catch(e => {
          this.showLoaderIcon(false);
        });
    }
  }

  resetRecaptcha() {
    this.recaptchaRef.reset();
  }

  orchAuth = () => {

  }

  render() {
    const { userName, password } = this.state;
    var enterUsernameField = {
      border: "1px solid #7d7878",
      padding: "10px",
      width: "100%"
    };

    var centerBtnLogin = {
      justifyContent: "center",
      display: "flex",
      padding: "1em",
      float: "none"
    };

    var otpFormHidden = {
      display: this.state.otpFormHidden ? "block" : "none"
    };

    var resetPasswordFormHidden = {
      display: this.state.resetPasswordFormHidden ? "block" : "none"
    };

    var showMFAForm = {
      display: this.state.showMFAForm ? "block" : "none"
    };

    var submitUserNameFormHidden = {
      display: this.state.submitUserNameFormHidden ? "block" : "none"
    };
    var resendOTP = {
      display: this.state.resendOTP ? "block" : "none"
    };

    var noteStyle = {
      fontSize: "12px",
      paddingTop: "1em",
      color: "red"
    };
    var mfaText = {
      fontSize: "12px",
      textAlign: "center",
      paddingTop: "1em",
      paddingBottom: "2em"
    };

    var mfaText1 = {
      fontSize: "12px"
    };

    var mfaText2 = {
      fontSize: "12px",
      color: "red"
    };

    var mfaText3 = {
      fontSize: "13px",
      fontWeight: "bold",
      paddingTop: "0.5em",
      paddingBottom: "0.5em"
    };


    if (!localStorage.getItem('isApplicationLogin')) {
      $('#concierto-body').addClass('login-theme');
    }

    return (
      <div className="container-fluid pad-0">
        {/* <ToastContainer /> */}
        <div className='login-theme'>
          <div className='card login-theme-card'>
            <div className='card-body'>
              <div style={{ fontFamily: 'sans-serif', color: '#5555a7', fontSize: '2.2rem', marginLeft: '25px', verticalAlign: 'middle' }}>
                <strong style={{ color: '#5C3EB0', fontSize: '2.2rem', fontFamily: 'sans-serif', fontWeight: 'bold' }}>Concierto.</strong>
                Cloud
              </div>
              <h3 className='login-text' style={{ "marginLeft": "25px" }}>Login</h3>
              <div className='wish' style={{ "marginLeft": "25px" }}>Good morning! Welcome Back</div>
              <div className="login-enter-details-text-style" style={{ "marginLeft": "25px" }}>Please enter your details below</div>
              <form className='details-form' style={{ "marginLeft": "25px", "marginRight": "25px" }} onSubmit={(e) => e.preventDefault()}>
                <div className="form-group-login">
                  <label htmlFor="userName" className="login-label"><span className='text-danger'>*</span>User Name</label>
                  <input type="text" className="form-control" name="userName" value={userName} onChange={this.onChange} />
                </div>
                <div className="form-group-login">
                  <label htmlFor="password" className="login-label"><span className='text-danger'>*</span>Password</label>
                  <input type="password" className="form-control" value={password} onChange={this.onChange} name="password" />
                </div>
                <div className="form-group-login">
                  <label htmlFor="mfa" className="login-label"><span className='text-danger'>*</span>MFA</label>
                  <input type="number" className="form-control" name="mfaToken" onChange={this.onChange} />
                </div>
                <button type="submit" className="btn btn-primary login-btn" onClick={this.onSubmit}>LOGIN</button>
                <button type="submit" className="btn sso-btn" onClick={this.ssoLogin}>SSO</button>
                <div className='mt-3'>
                  <button type="submit" className="supported-btns" data-toggle="modal" data-target="#cspModal1">Forgot Password?</button>
                  <button type="submit" className="supported-btns" data-toggle="modal" data-target="#mfaModal">Reset MFA</button>
                </div>
              </form>
              <div className="modal" id="mfaModal" role="dialog" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header login-modal-header">
                      {/* {
                        this.state.isLoading && <Loader />
                      } */}
                      <h4 className="modal-title">Reset MFA</h4>
                      <button type="button" className="close" data-dismiss="modal" onClick={this.cancelBtn.bind(this)}>&times;</button>
                    </div>
                    <div className="modal-body">
                      {/* <p style={mfaText}>{this.state.mfaData}</p> */}

                      <div className="add_edit_card" style={showMFAForm}>
                        <input type="text" name="userName1" value={this.state.userName1} id="userName1" placeholder="Enter Username" onChange={this.handleChange} style={enterUsernameField} />
                        <br /><br />
                        <input type="password" name="password1" value={this.state.password1} id="password1" placeholder="Enter Password" onChange={this.handleChange} style={enterUsernameField} />
                        <span style={centerBtnLogin}>
                          <button type="button" className="btn btn-primary loginpage-submit-btn" onClick={this.resetMFA.bind(this)}>Submit</button>
                        </span>
                      </div>
                      <div>
                        <p style={mfaText2}>Note: Please do not share this MFA token with anyone</p>
                        <p style={mfaText3}>Instructions:</p>
                        <p style={mfaText1}>&#9654; To use this MFA token, please install the Google Authenticator app on your Android/iOS phone.</p>
                        <p style={mfaText1}>&#9654; Please follow the instructions in the app and enter this MFA token when requested</p>
                        <p style={mfaText1}>&#9654; Next time onwards, when you login, please enter the value generated in your Google Authenticator app, alongside your username and password</p>
                      </div>
                    </div>
                    {/* <div className="modal-footer">
                      <button type="button" id="modalClose1" className="btn btn-default" data-dismiss="modal" onClick={this.cancelBtn.bind(this)}>Close</button>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="modal" id="cspModal1" role="dialog" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog">
                  <div className="modal-content" style={{ height: '300px' }}>
                    <div className="modal-header login-modal-header">
                      {/* {
                        this.state.isLoading && <Loader />
                      } */}
                      <h4 className="modal-title">Forgot Password</h4>
                      <button type="button" className="close" data-dismiss="modal" onClick={this.cancelBtn.bind(this)}>&times;</button>
                    </div>
                    <div className="modal-body">
                      <div className="add_edit_card" style={submitUserNameFormHidden}>
                        <input type="text" name="userName2" id="userName2" value={this.state.userName2} placeholder="Enter Username" onChange={this.handleChange} style={enterUsernameField} />
                        <div style={{ margin: "2% 0.1%" }} >
                          {/* <ReCAPTCHA
                            style={{ display: "inline-block" }}
                            ref={e => this.recaptchaRef = e}
                            sitekey={GOOGLE_CAPTCH_KEY}
                            onChange={this.onCapChange}
                          /> */}
                          {/* <button className="google_captch" onClick={this.resetRecaptcha}></button> */}
                        </div>
                        <span style={centerBtnLogin}/*  style={{ display: "none" }} */>
                          <button type="button" className="btn btn-primary loginpage-submit-btn" onClick={this.submitUserName.bind(this)}>Submit</button>
                        </span>
                      </div>
                      <div className="add_edit_card" style={resendOTP}>
                        <div style={{ margin: "2% 0.1%" }} >
                          {/* <ReCAPTCHA
                            style={{ display: "inline-block" }}
                            ref={e => this.recaptchaRef = e}
                            sitekey={GOOGLE_CAPTCH_KEY}
                            onChange={(text) => this.onCapChange(text, resetPasswordFormHidden)}
                          /> */}
                          {/* <button className="google_captch" onClick={this.resetRecaptcha}></button> */}
                        </div>
                      </div>
                      <div className="add_edit_card" style={otpFormHidden}>
                        {/*  */}
                        <input type="password" name="otp" value={this.state.otp} id="otp" placeholder="Enter OTP" onChange={this.handleChange} style={enterUsernameField} />
                        <span style={centerBtnLogin}>
                          <button type="button" className="btn btn-primary loginpage-submit-btn" onClick={this.submitOtp.bind(this)}>Submit</button>
                        </span>
                        <span style={centerBtnLogin}>
                          <button type="button" className="btn btn-primary" onClick={this.submitUserName.bind(this)}>Regenerate OTP</button>
                        </span>
                      </div>
                      <div className="add_edit_card" style={resetPasswordFormHidden}>
                        <input type="password" name="otp" value={this.state.otp} id="otp" placeholder="Enter OTP" onChange={this.handleChange} style={{ ...enterUsernameField, marginBottom: "20px" }} />
                        <input type="password" name="newPassword" value={this.state.newPassword} id="newPassword" placeholder="Enter New Password" onChange={this.handleChange} style={enterUsernameField} />
                        <br /><br />
                        <input type="password" name="confirmPassword" value={this.state.confirmPassword} id="confirmPassword" placeholder="Re-Enter New Password" onChange={this.handleChange} style={enterUsernameField} />
                        <p style={noteStyle}>Note : Password must contain minimum 8 characters,one uppercase, one lowercase and special characters.</p>
                        <span style={centerBtnLogin}>
                          <button type="button" className="btn btn-primary loginpage-submit-btn" onClick={this.verifyOtpResetPassword}>Submit</button>
                        </span>
                        <span style={centerBtnLogin}>
                          <button type="button" className="btn btn-primary" onClick={this.resendOTPReq.bind(this)}>Regenerate OTP</button>
                        </span>
                      </div>
                    </div>
                    {/* <div className="modal-footer">
                      <button type="button" id="modalClose2" className="btn btn-default" data-dismiss="modal" onClick={this.cancelBtn.bind(this)}>Close</button>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="modal" id="changePasswordModel" role="dialog" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header login-modal-header">
                      <h4 className="modal-title">Change Password</h4>
                    </div>
                    <div className="modal-body">
                      <div className="add_edit_card" >
                        <input type="text" name="userName3" value={this.state.userName3} id="userName3" placeholder="Enter Username" onChange={this.handleChange} style={enterUsernameField} />
                        <br /><br />
                        <input type="password" name="oldPassword" value={this.state.oldPassword} id="oldPassword" placeholder="Enter old password" onChange={this.handleChange} style={enterUsernameField} />
                        <br /><br />
                        <input type="password" name="newPasswordChange" value={this.state.newPasswordChange} id="newPasswordChange" placeholder="Enter new password" onChange={this.handleChange} style={enterUsernameField} />
                        <br /><br />
                        <input type="password" name="confirmNew" value={this.state.confirmNew} id="confirmNew" placeholder="Confirm new password" onChange={this.handleChange} style={enterUsernameField} />
                        <span style={centerBtnLogin}>
                          <button type="button" className="btn btn-primary loginpage-submit-btn" onClick={this.changePassword.bind(this)}>Submit</button>
                        </span>
                      </div>

                    </div>
                    <div className="modal-footer">
                      <button type="button" id="modalClose3" className="btn btn-default" data-dismiss="modal" onClick={this.cancelBtn.bind(this)}>Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
// let's add some propTypes for additional validation and readability
LoginForm.propTypes = {
  login: PropTypes.func.isRequired
}

// $(document).ready(function () {
//   $("#ssoBtn").click(function () {
//     localStorage.setItem("isLoginFirst", true)
//     $("#ssoBtn").attr("href", samlUrl.samlLogin);
//   });
// });


function mapStateToProps(state) {
  return {
    current_user: state.current_user,
    featureIds: state.clientUserFeatures && state.clientUserFeatures.featureIds,
    auth: state.current_user.isAuthenticated,
    user_clients: state.userClients,
    userId: state.current_user && state.current_user.payload && state.current_user.payload.userId
  }
}

export default connect(mapStateToProps,
  {
    login,
    generateToken,
    getDefaultClientSAMLFromUser,
    getDefaultClientFromUser,
    getClientMasterClient,
    getClientUserFeatures,
    setSelectedClientInState,
    featureChecking,
    failureToast,
    successToast,
    fetchSsoLoginUrl,
    setClientLogos,
    graphanaWidgetList,
    getAllMasterData,
    setMasterDataOptions
  })(LoginForm);

export { LoginForm };