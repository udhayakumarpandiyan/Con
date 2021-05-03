import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { matchPath, Link as RouteLink, withRouter } from 'react-router-dom';
import { NavExpandable, NavItem as PFNavItem } from '@patternfly/react-core';
import styled from 'styled-components';

const NavItem = styled(PFNavItem)`
  
   padding-left: 0px;
   width: 100%;
   .pf-c-nav__link{
    width: 100%;
    color: #000000 !important;
    text-transform: none;
    font-size: 14px;

    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    border-left: 4px solid #ffffff;
   }
  .pf-m-current{   
    border-left: 4px solid #593CAB;
    box-sizing: border-box;
    background: #f0e1fc;
    &: hover{
      background: #fff;
    }
    &: after{
      border: none;
    }
  }
  
}
`;

const Link = styled(RouteLink)`
width: 100%;
font-size: 13px;
text-decoration: none;
color: #593CAB;
font-weight: 600;
`;


const Icon = styled.img`
 padding: 0px 0px 2px 0px; 
`;

const Container = styled.div`
display: flex;
`;


class NavExpandableGroup extends Component {
  constructor(props) {
    super(props);
    const { routes } = this.props;

    // Extract a list of paths from the route params and store them for later. This creates
    // an array of url paths associated with any NavItem component rendered by this component.
    this.navItemPaths = routes.map(({ path }) => path);
    this.isActiveGroup = this.isActiveGroup.bind(this);
    this.isActivePath = this.isActivePath.bind(this);
  }

  isActiveGroup() {
    return this.navItemPaths.some(this.isActivePath);
  }

  isActivePath(path) {
    const { history } = this.props;
    return Boolean(matchPath(history.location.pathname, { path }));
  }

  render() {
    const { groupId, groupTitle, routes } = this.props;

    if (routes.length === 1) {
      const [{ path }] = routes;
      return (
        <NavItem itemId={groupId} isActive={this.isActivePath(path)} key={path}>
          <Link to={path}>{groupTitle}</Link>
        </NavItem>
      );
    }

    return (
      <NavExpandable
        isActive={this.isActiveGroup()}
        isExpanded
        groupId={groupId}
        title={groupTitle}
      >
        {routes.map(({ path, title, icon }) => (
          <NavItem
            groupId={groupId}
            isActive={this.isActivePath(path)}
            key={path}
          >
            <Link to={path}><Icon className={this.isActivePath(path) ? "sidebar_icon_selected" : "sidebar_icon"} src={icon} alt="" /></Link>
            <Link to={path}>{title}</Link>
          </NavItem>
        ))}
      </NavExpandable>
    );
  }
}

NavExpandableGroup.propTypes = {
  groupId: PropTypes.string.isRequired,
  groupTitle: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withRouter(NavExpandableGroup);
