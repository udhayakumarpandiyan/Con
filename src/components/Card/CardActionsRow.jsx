import React from 'react';
import { CardActions as OrchestrationCardActions } from '@patternfly/react-core';
import styled from 'styled-components';

const CardActionsWrapper = styled.div`
  margin-top: 20px;
  --pf-c-card__actions--PaddingLeft: 0;
`;

const CardActions = styled(OrchestrationCardActions)`
  display: flex;
  justify-content: center;
`;

function CardActionsRow({ children }) {
  return (
    <CardActionsWrapper>
      <CardActions>{children}</CardActions>
    </CardActionsWrapper>
  );
}

export default CardActionsRow;
