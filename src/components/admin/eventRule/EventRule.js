import React, { Component } from 'react';
// import ComponentHeader from '../../resources/DashboardHeader';
import AsyncComponent from '../../../AsyncComponent';
const Plugins = AsyncComponent(() => import('../Plugins').then(module => module.default));
const MuteTab = AsyncComponent(() => import('./Mute').then(module => module.default));
const ConfigTab = AsyncComponent(() => import('./Config').then(module => module.default));


class EventRuleSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTabIndex: 0,
            activeTools: []
        }
    }

    onTabClick = (index) => {
        this.setState({ activeTabIndex: index });
    }

    onSetActiveTools = (activeTools = []) => this.setState({ activeTools })

    render() {
        const { activeTabIndex, activeTools } = this.state;
        return (
            <>
                {
                    Number(activeTabIndex) === 0 &&
                    <Plugins
                        hasShowOnlyEnabledTools
                        onTabClick={this.onTabClick}
                        onSetActiveTools={this.onSetActiveTools}
                    />
                }
                {
                    Number(activeTabIndex) === 1 &&
                    <MuteTab
                        onTabClick={this.onTabClick}
                        toolsDetails={activeTools}
                    />
                }
                {
                    Number(activeTabIndex) === 2 &&
                    <ConfigTab
                        onTabClick={this.onTabClick}
                        toolsDetails={activeTools}
                    />
                }
            </>
        )
    }
}


export default EventRuleSetup;