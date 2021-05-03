import React from 'react';
import { shape, string, number, arrayOf, node, oneOfType } from 'prop-types';
import { Tab, Tabs as OrchestrationTabs, TabTitleText } from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const Tabs = styled(OrchestrationTabs)`
  padding-left: 8px;
  --pf-c-tabs__item--m-current__link--after--BorderColor: #4BC6B9;
 
  & .pf-c-tabs__item-text{
      font-size: 1.25rem;
      color: #000000;
    }
`;

function RoutedTabs(props) {
  const { tabsArray } = props;
  const history = useHistory();

  const getActiveTabId = () => {
    const match = tabsArray.find(tab => tab.link === history.location.pathname);
    if (match) {
      return match.id;
    }
    const subpathMatch = tabsArray.find(tab =>
      history.location.pathname.startsWith(tab.link)
    );
    if (subpathMatch) {
      return subpathMatch.id;
    }
    return 0;
  };

  function handleTabSelect(event, eventKey) {
    const match = tabsArray.find(tab => tab.id === eventKey);
    if (match) {
      history.push(match.link);
    }
  }

  return (
    <Tabs activeKey={getActiveTabId()} onSelect={handleTabSelect}>
      {tabsArray.map(tab => (
        <Tab
          aria-label={typeof tab.name === 'string' ? tab.name : ''}
          eventKey={tab.id}
          key={tab.id}
          link={tab.link}
          title={<TabTitleText>{tab.name}</TabTitleText>}
          role="tab"
        />
      ))}
    </Tabs>
  );
}

RoutedTabs.propTypes = {
  tabsArray: arrayOf(
    shape({
      id: number.isRequired,
      link: string.isRequired,
      name: oneOfType([string.isRequired, node.isRequired]),
    })
  ).isRequired,
};

export default RoutedTabs;
