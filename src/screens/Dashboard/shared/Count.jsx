import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Card } from '@patternfly/react-core';

const CountCard = styled(Card)`
  padding: var(--pf-global--spacer--md);
  padding-bottom: 0px;
  display: flex;
  align-items: center;
  padding-top: var(--pf-global--spacer--sm);
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 0px;
  color: #484848;

  & h2 {
    font-size: var(--pf-global--FontSize--4xl);
    color: var(--pf-global--palette--blue-400);
    text-decoration: none;
  }

  & h2.failed {
    color: var(--pf-global--palette--red-200);
  }
`;

const CountLink = styled(Link)`
  display: contents;
  &:hover {
    text-decoration: none;
  }
`;

function Count({ failed, link, data, label }) {
  return (
    <CountLink to={link}>
      <CountCard isHoverable>
        {label}
        <h2 className={failed && 'failed'}>{data || 0}</h2>
      </CountCard>
    </CountLink>
  );
}

export default Count;
