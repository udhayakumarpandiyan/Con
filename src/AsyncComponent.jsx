import React, { Component } from "react";
import Loader from './components/resources/Loader';

export default function asyncComponent(getComponent) {
  class AsyncComponent extends Component {
    static Component = null;
    state = { Component: AsyncComponent.Component };

    UNSAFE_componentWillMount() {
      if (!this.state.Component) {
        getComponent && getComponent().then(Component => {
          AsyncComponent.Component = Component;
          this.setState({ Component });
        });
      }
    }

    render() {
      const { Component } = this.state;
      if (Component) {
        return <Component {...this.props} />
      }
      return <div className="container" style={{ textAlign: "center" }}>
        <Loader loading />
      </div>
    }
  }
  return AsyncComponent;
}