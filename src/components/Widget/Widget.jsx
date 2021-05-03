import React, { useState } from 'react';
import { string, number } from 'prop-types';
import styled from 'styled-components';

// Make button findable by tests

const Header = styled.div`
  display: flex;
  width:  100%;
  align-items: center;
  height: 42px;
  padding: 0px 20px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: #483672;
  color: #fff;
`;


const WidgetContainer = styled.div`
margin: 0px 20px;
border: 1px solid #CACACA;
border-radius: 4px;
`;

const Container = styled.div`
  margin: 0px;
  background-color: #ffffff;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`;

const Count = styled.span`
margin-left: 20px;
width: 24px;
height: 24px;
background-color: #FFFFFF;
border-radius: 4px;
text-align: center;
color: #000000;
`;

function Widget({ label, children, count }) {

  return (
    <WidgetContainer>
      <Header>
        <label>{label}</label>
        {count>= 0 && <Count>{count}</Count>}
      </Header>
      <Container>
        {children}
      </Container>
    </WidgetContainer>
  );
}
Widget.propTypes = {
  label: string.isRequired,
  count: number
};
Widget.defaultProps = {
  label: '',
  count: -1
};

export default Widget;
