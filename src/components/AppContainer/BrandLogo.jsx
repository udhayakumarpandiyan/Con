import React from 'react';

import styled from 'styled-components';

const BrandImg = styled.img`
  flex: initial;
  width: initial;
  padding-left: 0px;
  margin: 0px 0px 0px 0px;
  pointer-events: none;
`;

const BrandLogo = () => <BrandImg src="/static/media/logo.png" />;

export default BrandLogo;
