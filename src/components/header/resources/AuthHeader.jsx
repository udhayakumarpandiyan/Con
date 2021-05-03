import React from 'react';
import { CustomDropDown } from "../../home/resources/CustomDropDown";
// import logo from "../../assets/resources/Concierto_logo_white.png";
import logo from "../../assets/resources/Concierto_Logo.png";

function getContentAfterWelcome(clientList, onClientChange, selectedClient) {
    let shortName = '';
    let nameSplit = (localStorage.getItem('userName') || '').trim().split(' ');
    if (Array.isArray(nameSplit) && nameSplit.length > 1) {
        shortName = nameSplit[0][0] + nameSplit[nameSplit.length - 1][0];
    } else {
        shortName = nameSplit[0][0] + nameSplit[0][1];
    }
    return <>
        <button className="navbar-toggler" type="button" data-toggle="collapse"
            data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02"
            aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse padLeft-1" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto mt-2 mr-55 mt-lg-0">
                <li className="nav-item">
                    <CustomDropDown
                        list={clientList}
                        onChange={onClientChange}
                        defaultSelected={selectedClient}
                        textnIconColor='#fff'
                        fontFamily='Open Sans Bold'
                    />
                </li>
                {/* <li className="nav-item">
                    <a className="notification">notification</a>
                </li> */}
                <li className="nav-item profilediv">
                    <div className="dropdown" style={{ border: 'none' }}>
                        <div className="dropdown-toggle txt-cl fs"
                            id="dropdownMenuButton" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                            <span className="dot">{shortName}</span>
                        </div>
                        <div className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton">
                            <div className="dropdown-item flex-content" style={{ borderBottom: "1px solid #CDCDCD" }}>
                                <div className="dot" style={{ alignSelf: 'center' }}>{shortName}</div>
                                <div className="dropdown-item profile">
                                    <p style={{ marginBottom: "0.4rem" }}>{localStorage.getItem('userName')}</p>
                                    <p className='m-0'>{localStorage.getItem('email')}</p>
                                </div>
                            </div>
                            <a className="dropdown-item" href="#">Settings</a>
                            <a className="dropdown-item" href="/login" onClick={() => {
                                localStorage.clear();
                                deleteAllCookies()
                            }}>Sign out</a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </>
}

export default function AuthHeader(props) {
    const { userClients, onClientChange, selectedClient, history } = props;
    const clientList = Array.isArray(userClients) && userClients.map(item => ({ label: item.name, value: item.clientId }))
    return <nav className="navbar navbar-expand-lg navbar-light auth-light p-0">
        <img className="navbar-brand" src={logo} onClick={() => history.push('/home')} style={{ cursor: 'pointer' }} />
        {
            getContentAfterWelcome(clientList, onClientChange, selectedClient)
        }
    </nav>
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}