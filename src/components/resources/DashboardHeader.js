import React from 'react';
import { NavLink } from "react-router-dom"

class ComponentHeader extends React.PureComponent {

    onTabClick(index, e) {
        e.preventDefault();
        var header = document.getElementById("dashboard");
        var current = header.getElementsByClassName("btn-active");
        if (current[0]) {
            current[0].className = current[0].className.replace(" btn-active", "");
        }
        if (e?.currentTarget?.className) {
            e.currentTarget.className += " btn-active";
        }
        this.props.onTabClick && this.props.onTabClick(index);
    }

    render() {
        // breadCrumb= [{name:'', path: ''}]
        // dashboardText = [{ name: '', className: '' }]
        // hasShowBreadcrumb : true || false
        // tabsText = ['tab name','tab name']
        const { dashboardText, tabsText, headerClass, hasShowBreadcrumb, breadCrumb, activeTabIndex } = this.props;
        return (
            <div id="dashboard" className="dashboard-bg dashbrd">
                <div className={`dashboard flex-content ${headerClass}`}>
                    {
                        Array.isArray(dashboardText) && dashboardText.map((item, index) => {
                            if (index === 0 && hasShowBreadcrumb) {
                                return <div key={index} className={item.className} id={item.id ? item.id : null}>
                                    {item.name}
                                    {
                                        Array.isArray(breadCrumb) && breadCrumb.map((item, index) =>
                                            <span key={item.name} className={`fs-1 ${index === 0 ? 'ml-4' : ''}`}>{`${index === 0 ? '<<' : '/'}`} {item.path ?
                                                <NavLink to={item.path}>{item.name}</NavLink> : item.name}</span>
                                        )
                                    }
                                </div>
                            }
                            return <div key={index} className={item.className} id={item.id ? item.id : null}>{item.name}</div>
                        })
                    }
                </div>
                <div className="tabs">
                    {
                        Array.isArray(tabsText) && tabsText.map((tab, index) => {
                            const isActiveTab = isNaN(activeTabIndex) ? (index === 0) : Number(activeTabIndex) === index;
                            return <button id={tab} key={tab} className={`tab ${isActiveTab ? "btn-active" : ""}`}
                                style={{ outline: "none" }} onClick={this.onTabClick.bind(this, index)}>{tab}</button>
                        })
                    }
                </div>
            </div>
        );
    }
}

export default ComponentHeader;
