import React, { Component } from 'react';
import { NavLink } from "react-router-dom"
import $ from "jquery";
import { connect } from "react-redux";
import "./page.css";

class SideBar extends Component {
  componentDidMount() {
    var header = document.getElementById("mySidenav");
    var btns = header?.getElementsByClassName("navIcon");
    for (var i = 0; i < btns?.length; i++) {
      btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active-color");
        if (current[0]) {
          current[0].className = current[0].className.replace(" active-color", "");
        }
        var parent_div = $(`#${this.id}`).closest('.nav-div');
        var closest_div = parent_div.find('.nav-text');
        if (closest_div[0]) {
          closest_div[0].className += ' active-color';
        }
      });
    }
  }

  render() {
    const URL = ['/home', '/events', '/ticket-list', '/admin', '/orchestartion-home', '/jobs', '/schedules',
      '/templates', '/credentials', '/projects', '/inventories', '/hosts', '/change-requests', '/knowledge-base',
      '/awsInventory', '/service-request', '/Inventory', '/azureInventory', '/reports'];
    const locationPath = window.location.pathname;
    const { userId } = this.props;
    return (
      !!userId && <div id="mySidenav" className="sidebar">
        <div className="nav-div">
          <NavLink id="home" className="home navIcon" to={URL[0]}>My Dashboard</NavLink>
          <div className={`nav-text ${locationPath === URL[0] ? "active-color" : ""}`}>My dashboard</div>
        </div>
        <div className="nav-div">
          <NavLink id="events" className="events navIcon" to={URL[1]}>Event</NavLink>
          <div className={`nav-text  ${locationPath === URL[1] ? "active-color" : ""}`}>Event</div>
        </div>
        <div className="nav-div">
          <NavLink id="tickets" className="tickets navIcon" to={URL[2]}>Tickets</NavLink>
          <div className={`nav-text  ${locationPath === URL[2] ? "active-color" : ""}`}>Tickets</div>
        </div>
        <div className="nav-div">
          <NavLink id="userDir" className="userDir navIcon" to={URL[3]}>Admin</NavLink>
          <div className={`nav-text  ${locationPath === URL[3] ? "active-color" : ""}`}>Admin</div>
        </div>
        <div className="nav-div pos-rel" style={{ border: 'none', width: 'auto' }}>
          <a className="nav-link dropdown-toggle orchestartion-home navIcon " href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">Orchestartion</a>
          <div className={`nav-text  ${locationPath === URL[4] ? "active-color" : ""}`}>Orchestration Engine</div>
          <div className="sub-menu dropdown-menu" aria-labelledby="navbarDropdown">
            <div className="sub-nav-div dropdown-item">
              <NavLink id="Jobs" className="jobs-icon navIcon gray-filter" to={URL[5]}></NavLink>
              <div className={`nav-text  ${locationPath === URL[5] ? "active-color" : ""}`}>Jobs</div>
            </div>
            <div className="sub-nav-div dropdown-item">
              <NavLink id="schedules" className="schedules-icon navIcon gray-filter" to={URL[6]}></NavLink>
              <div className={`nav-text  ${locationPath === URL[6] ? "active-color" : ""}`}>Schedules</div>
            </div>
            <div className="sub-nav-div dropdown-item">
              <NavLink id="templates" className="templates-icon navIcon gray-filter" to={URL[7]}></NavLink>
              <div className={`nav-text  ${locationPath === URL[7] ? "active-color" : ""}`}>Templates</div>
            </div>
            <div className="sub-nav-div dropdown-item">
              <NavLink id="credentials" className="credentials-icon navIcon gray-filter" to={URL[8]}></NavLink>
              <div className={`nav-text  ${locationPath === URL[8] ? "active-color" : ""}`}>Credentials</div>
            </div>
            <div className="sub-nav-div dropdown-item">
              <NavLink id="projects" className="projects-icon navIcon gray-filter" to={URL[9]}></NavLink>
              <div className={`nav-text  ${locationPath === URL[9] ? "active-color" : ""}`}>Projects</div>
            </div>
            <div className="sub-nav-div dropdown-item">
              <NavLink id="inventories" className="inventories-icon navIcon gray-filter" to={URL[10]}></NavLink>
              <div className={`nav-text  ${locationPath === URL[10] ? "active-color" : ""}`}>Inventories</div>
            </div>
            <div className="sub-nav-div dropdown-item">
              <NavLink id="hosts" className="hosts-icon navIcon gray-filter" to={URL[11]}></NavLink>
              <div className={`nav-text  ${locationPath === URL[11] ? "active-color" : ""}`}>Hosts</div>
            </div>
          </div>
        </div>
        {/* Change Request */}
        <div className="nav-div">
          <NavLink id="cr" className="tickets navIcon" to={URL[12]}></NavLink>
          <div className={`nav-text  ${locationPath === URL[12] ? "active-color" : ""}`}>Change Requests</div>
        </div>
        <div className="nav-div">
          <NavLink id="kb" className="kb-menu navIcon" to={URL[13]}></NavLink>
          <div className={`nav-text  ${locationPath === URL[13] ? "active-color" : ""}`}>Knowledge Base</div>
        </div>
        {/*  */}
        <div className="nav-div pos-rel" style={{ border: 'none', width: 'auto' }}>
          <a className="nav-link dropdown-toggle inventory-home navIcon" href="#" id="awsDropdown" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">Inventory</a>
          <div className={`nav-text  ${locationPath === URL[16] ? "active-color" : ""}`}>Inventory</div>
          <div className="sub-menu dropdown-menu" aria-labelledby="awsDropdown">
            <div className="sub-nav-div dropdown-item">
              <NavLink id="aws" className="aws-menu navIcon gray-filter" to={URL[14]}></NavLink>
              <div className={`nav-text  ${locationPath === URL[14] ? "active-color" : ""}`}>AWS<div>Inventory</div></div>
            </div>
            <div className="sub-nav-div dropdown-item">
              <NavLink id="azure" className="azure-menu navIcon gray-filter" to={URL[17]}></NavLink>
              <div className={`nav-text  ${locationPath === URL[17] ? "active-color" : ""}`}>AZURE<div>Inventory</div></div>
            </div>
          </div>
        </div>
        {/*  */}
        <div className="nav-div">
          <NavLink id="requestform" className="request-menu navIcon" to={URL[15]}></NavLink>
          <div className={`nav-text  ${locationPath === URL[15] ? "active-color" : ""}`}>Request Form</div>
        </div>
        <div className="nav-div">
          <NavLink id='reports' className="reports navIcon" to={URL[18]}></NavLink>
          <div className={`nav-text  ${locationPath === URL[18] ? "active-color" : ""}`}>Reports</div>
        </div>
      </div >
    )
  }
}

function mapStateToProps() {
  return {
    userId: localStorage.getItem('userId')
  }
}

export default connect(mapStateToProps, {})(SideBar);