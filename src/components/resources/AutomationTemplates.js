import React from 'react';


export default function AutomationTemplates(props) {
    const { data, runCFT } = props;
    return (
        <div
            className="modal"
            data-backdrop="static"
            data-keyboard="false"
            id='runCEF'
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
        >
            <div
                className="modal-dialog view-event-details"
                role="document"
            >
                <div className="modal-content">
                    <div className="modal-header" style={{ height: "auto" }}>
                        <h5 className="modal-title">Orchestration</h5>
                        <i
                            className="fa fa-times-circle"
                            data-dismiss="modal"
                        ></i>
                    </div>
                    <div className="modal-body" style={{ height: "330px" }}>
                        {/* {isLoading && <Loader />} */}
                        {data.cftInformation &&
                            data.cftInformation.templateName ? (
                                <div className="row">
                                    <table
                                        className="table table-bordered"
                                        style={{ margin: "25px" }}
                                    >
                                        <thead>
                                            <tr style={{ textAlign: "center" }}>
                                                <th scope="col">#</th>
                                                <th scope="col">Template</th>
                                                <th scope="col">Description</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ textAlign: "center" }}>
                                                <th scope="row">1</th>
                                                <td style={{ background: "none" }}>
                                                    {data.cftInformation &&
                                                        data.cftInformation.templateName}
                                                </td>
                                                <td style={{ background: "none" }}>
                                                    {data.cftInformation &&
                                                        data.cftInformation.templateName}
                                                </td>
                                                <td style={{ background: "none" }}>
                                                    <i
                                                        className="fa fa-rocket float-sm-cente pr-1 btn-link"
                                                        title="Run Action"
                                                        disabled={
                                                            Number(data.eventState) === 2
                                                                ? true
                                                                : false
                                                        }
                                                        onClick={
                                                            Number(data.eventState) === 2
                                                                ? () => { }
                                                                : () => runCFT(data)
                                                        }
                                                        style={{
                                                            color:
                                                                Number(data.eventState) === 2
                                                                    ? "gray"
                                                                    : "",
                                                        }}
                                                    ></i>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p
                                    style={{ textAlign: "center", marginTop: "40px" }}
                                >
                                    No Data Available
                                </p>
                            )}
                    </div>
                </div>
            </div>
        </div>
    )
}