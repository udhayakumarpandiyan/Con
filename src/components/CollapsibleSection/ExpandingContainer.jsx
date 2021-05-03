import 'styled-components/macro';
import React, { useState, useEffect, useRef } from 'react';
import { bool } from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  margin: 0px;
  transition: height 0.2s ease-out;
  background-color: #ffffff;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  ${props => props.hideOverflow && `overflow: hidden;`}
`;

function ExpandingContainer({ isExpanded, children }) {
  const [contentHeight, setContentHeight] = useState(0);
  const [hideOverflow, setHideOverflow] = useState(!isExpanded);
  const ref = useRef(null);
  useEffect(() => {
    ref.current.addEventListener('transitionend', () => {
      setHideOverflow(!isExpanded);
    });
  });
  useEffect(() => {
    setContentHeight(ref.current.scrollHeight);
  }, [setContentHeight, children]);
  const height = isExpanded ? contentHeight : '0';
  return (
    <Container
      ref={ref}
      css={`
        height: ${height}px;
      `}
      hideOverflow={!isExpanded || hideOverflow}
    >
      {children}
    </Container>
  );
}
ExpandingContainer.propTypes = {
  isExpanded: bool,
};
ExpandingContainer.defaultProps = {
  isExpanded: false,
};

export default ExpandingContainer;
