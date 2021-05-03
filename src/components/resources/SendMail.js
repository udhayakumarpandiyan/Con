import React from 'react';

export default function SendMail(props) {
    const { onSubmitSendMail, isLoading, data, smemailid, eventState, onChange, smsubject, smdescription, onCancelSendMail } = props;
    return (
        <div
            className="modal"
            data-backdrop="static"
            data-keyboard="false"
            id="sendEmailModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
        >
            <div
                className="modal-dialog"
                role="document"
            >
                <div className="modal-content">
                    <div className="modal-header" style={{ height: "auto" }}>
                        <h5
                            className="modal-title"
                            style={{ fontSize: "16px", lineHeight: "0.8" }}
                        >
                            Send Mail
</h5>
                        <i
                            className="fa fa-times-circle"
                            data-dismiss="modal"
                        ></i>
                    </div>
                    <div className="modal-body" style={{ height: "330px" }}>
                        {/* {isLoading && <Loader />} */}
                        <div className="container-fluid mt-3">
                            <div className="row form-group">
                                <label
                                    className="col-sm-2 col-form-label"
                                    style={{ fontSize: "16px" }}
                                >
                                    Email
</label>
                                <div className="col-sm-10">
                                    <input
                                        type="email"
                                        value={smemailid}
                                        name="smemailid"
                                        className="form-control"
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row form-group">
                                <label
                                    className="col-sm-2 col-form-label"
                                    style={{ fontSize: "16px" }}
                                >
                                    Subject
</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        name="smsubject"
                                        value={smsubject}
                                        className="form-control"
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                            <div className="row form-group">
                                <label
                                    className="col-sm-2 col-form-label"
                                    style={{ fontSize: "16px" }}
                                >
                                    Description
</label>
                                <div className="col-sm-10">
                                    <textarea
                                        value={smdescription}
                                        name="smdescription"
                                        className="form-control"
                                        style={{ height: "100px" }}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                            <div className="row" style={{ marginTop: "-25px" }}>
                                <div className="col-md-12 text-right mt-5">
                                    <button
                                        type="button"
                                        className="btn btn-secondary mr-2 pl-3 pr-3"
                                        data-dismiss="modal"
                                        onClick={onCancelSendMail}
                                        style={{ fontSize: "16px" }}
                                    >
                                        Cancel
  </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary pl-3 pr-3 mr-3"
                                        disabled={
                                            Number(eventState) === 2 ? true : false
                                        }
                                        onClick={onSubmitSendMail}
                                        style={{ fontSize: "16px" }}
                                    >
                                        Submit
  </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}