import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { arrayOf, object, string } from 'prop-types';
import { Button } from '@patternfly/react-core';

const TitleBottomSection = styled.div`
 display: flex;
 justify-content: space-between;
 background: transparent;
 padding: 0px 20px 10px 25px;
 margin-top: -46px;
`;

const Label = styled.label`
   text-align: left; 
   font: 1.25rem;
   letter-spacing: 0px;
   color: #593CAB;
   text-transform: capitalize;
   opacity: 1;
   margin-top: 14px;
`;
const OrchestrationPrimaryButton = {
    width: "7.65rem",
    height: "2.37rem",
    background: "#593CAB 0% 0% no-repeat padding-box",
}


const TitleBarBottomSection = ({ label, url }) => {
    return (
        <TitleBottomSection>
            <Label>{label}</Label>
            <Link to={url}><Button style={OrchestrationPrimaryButton}>Back</Button></Link>   
        </TitleBottomSection>
    );
}
TitleBarBottomSection.propTypes = {
    label: string,
    url: string
};
TitleBarBottomSection.defaultProps = {
    label: '',
    url: '',
};

export default TitleBarBottomSection;

