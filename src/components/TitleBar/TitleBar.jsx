import React from 'react';
import { Link as _Link } from 'react-router-dom';
import styled from 'styled-components';
import { arrayOf, object, string } from 'prop-types';


const TitleBarContainer = styled.div`
background-color: #FFFFFF;
padding: 10px 10px 40px 20px;
`;
const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
const Controls = styled.div`
float: right;
`;

const Button = styled.button`
margin: 0px 10px;
width: 128px;
height:39px;
border: 0.5px solid #484848;
border-radius: 5px;
background-color: #FFFFFF;
font-weight: bold;
font-size: 14px;
letter-spacing: 0px;
color: #000000;
text-transform: capitalize;
`;

const Label = styled.label`
font-size: 36px;
letter-spacing: 0px;
color: #0E1B2A;
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

const TitleBar = ({ title, controls, count }) => {
    return (
        <TitleBarContainer>
            <Title>
                <h2>{title}</h2>
                {count>= 0 && <Count>{count}</Count>}
            </Title>

            <Controls>
                {controls && controls.map((control) => {
                    return (
                        <Button onClick={control.onClick}>{control.label}</Button>
                    )
                })}
            </Controls>

        </TitleBarContainer>
    );
}
TitleBar.propTypes = {
    title: string,
    controls: arrayOf(object)
};
TitleBar.defaultProps = {
    title: '',
    controls: [],
};

export default TitleBar;

