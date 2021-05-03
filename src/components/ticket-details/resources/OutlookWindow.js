import React from 'react';

export default function OutLookWindow(props) {
    const { onCloseWindow, hasShowOutLookWindow } = props;

    return (
        <>

            <ul className="teamBox teams-mess ul-list" id="myUL" style={{ width: "38rem" }}>
                <div className="teamHead" style={{ background: "#000000" }}>
                    <span className="outlook-icon">Outlook</span>
                    <div className="teams-head">Outlook</div>
                    <div className="close-x" style={{ cursor: "pointer",  marginLeft:"100px" }} onClick={(e) => onCloseWindow(e, hasShowOutLookWindow)}>&times;</div>
                </div>

                <form style={{ padding: "20px" }}>
                    <h5 class="outlook-window-head">New Message</h5>
                    <br />

                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div class="outlook-window-to" style={{ borderBottom: "1px solid gray" }}>To: </div>
                        </div>
                        <input type="text" className="fill-width" id="inlineFormInputGroupUsername2" />

                        <div className="chip chip-md outlook-window-to-name" style={{ left: "30px", position: "absolute", bottom: "5px", background:"#F2F2F2", borderRadius:"19px" }}>
                            <span className="badge badge-light span-text" style={{ backgroundColor: '#9A3EB0', borderRadius:' 19px' }}><text class="outlook-window-badge-text" style={{ color: "#fff"}}>AW</text></span>
   Alex Wibber
   </div>

                        <div className="chip chip-md outlook-window-to-name" style={{ left: "180px", position: "absolute", bottom: "5px" , background:"#F2F2F2", borderRadius:"19px" }}>
                            <span className="badge badge-light span-text" style={{ backgroundColor: '#0D23AF' , borderRadius:' 19px'}}><text class="outlook-window-badge-text" style={{ color: "#fff" }}>CT</text></span>
   Concierto Team
   </div>

                        <text style={{ color: '#0F01D1', right: '0px', position: 'absolute', bottom: '5px' }}>Bcc</text>
                    </div>
                    <br />
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div class="outlook-window-to" style={{ borderBottom: '1px solid gray' }}>Cc: </div>
                        </div>
                        <input type="text" className="fill-width" id="inlineFormInputGroupUsername2" />
                    </div>
                    <br />
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div class="outlook-window-sub" style={{ borderBottom: '1px solid gray' }}>Subject: </div>
                        </div>
                        <input type="text" className="fill-width outlook-window-ticket" id="inlineFormInputGroupUsername2" style={{ fontWeight: 'bold' }} value="  Tickets #1167600" />
                    </div>
                    <br />
                    <text class="outlook-window-sub"><i className="fa fa-paperclip" aria-hidden="true"></i> Attachments</text>
                    <br />
                    <br />
                    <div className="form-group">
                        <textarea className="form-control" rows="8" id="message" placeholder="Add a message"></textarea>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" style={{ backgroundColor: '#5C3EB0', border: '1px solid #5C3EB0' }}>Send</button>
                        <button type="button" className="btn btn-outline-secondary mr-auto" data-dismiss="modal">Discard</button>
                    </div>
                </form>

            </ul>
        </>
    )
}