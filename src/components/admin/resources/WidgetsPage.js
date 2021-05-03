import React from 'react';
import Widgets from "./Widgets";
import ComponentHeader from '../../resources/DashboardHeader';

class WidgetsPage extends React.Component {

    onTabClick = () => { };
    render() {
        const { header, widgets, history } = this.props;
        return (
            <div>
                <ComponentHeader
                    dashboardText={header}
                    headerClass=""
                    tabsText={[]}
                    onTabClick={this.onTabClick}
                />
                <div className="page">
                    <div className="" >
                        <div className='admin-widgets'>
                            {Array.isArray(widgets) && widgets.map((card, i) => <Widgets key={i} {...card} history={history} />)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WidgetsPage;