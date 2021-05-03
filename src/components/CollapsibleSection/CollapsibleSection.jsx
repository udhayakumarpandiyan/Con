import React, { useState } from 'react';
import { bool, string } from 'prop-types';
import styled from 'styled-components';
import { Button } from '@patternfly/react-core';
import { AngleDownIcon } from '@patternfly/react-icons';
import omitProps from '../../util/omitProps';
import ExpandingContainer from './ExpandingContainer';

// Make button findable by tests
Button.displayName = 'Button';

const Toggle = styled.div`
  display: flex;
  width:  100%;
  justify-content: space-between;
  align-items: center;
  height: 42px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  ${props => !props.isExpanded && `border-bottom-right-radius : 4px;`};
  ${props => !props.isExpanded && `border-bottom-left-radius : 4px;`};
  background-color: ${props => props.isExpanded? '#7D7F7D' :'#ffffff'};
  color: ${props => props.isExpanded? '#fff' :'#000000'};
  button {
    width: 90%;
    text-align: left;
    padding-left : 10px;
    border: none;
    outline: none;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    color: ${props => props.isExpanded? '#fff' :'#000000'} !important;
    background-color: transparent !important;
  }

`;

const Arrow = styled(omitProps(AngleDownIcon, 'isExpanded'))`
  margin-right : 10px;
  transition: transform 0.1s ease-out;
  fill: ${props => props.isExpanded? '#fff' : '#000000'}; 
  transform-origin: 50% 50%;
 
  ${props => props.isExpanded && `transform: rotate(180deg);`}
`;

function CollapsibleSection({ label, startExpanded, children }) {
  const [isExpanded, setIsExpanded] = useState(startExpanded);
  const toggle = () => setIsExpanded(!isExpanded);

  return (
    <div style={{margin:"12px 0px", border:"1px solid #cacaca", borderRadius:"4px"}}>
      <Toggle onClick={toggle} isExpanded={isExpanded}>
        <Button type="button" onClick={toggle}>
          {label} 
        </Button>    
        <Arrow isExpanded={isExpanded} />
        
      </Toggle>
      <ExpandingContainer isExpanded={isExpanded}>
        {children}
      </ExpandingContainer>
    </div>
  );
}
CollapsibleSection.propTypes = {
  label: string.isRequired,
  startExpanded: bool,
};
CollapsibleSection.defaultProps = {
  startExpanded: false,
};

export default CollapsibleSection;
