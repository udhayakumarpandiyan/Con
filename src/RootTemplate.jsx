import React, { Component } from 'react';
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { Switch } from "react-router-dom";


class RootTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        return (
            <div>
                <Switch>
                    {
                        ROUTES.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)
                    }
                    <Route path="*" component={NotFound} />
                </Switch>
            </div>
        );
    }
}


function mapStateToProps() {
    return {
        userId: localStorage.getItem('userId')
    }
}

export default connect(mapStateToProps, null)(RootTemplate);