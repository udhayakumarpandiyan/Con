import React, { useState } from 'react';
import IntegrationList from '../IntegrationsList/IntegrationList';
import IntegrationDetails from '../IntegrationDetails/IntegrationDetails';
import styled from 'styled-components';
import IntegrationAdd from '../IntegrationAdd/IntegrationAdd';

const Container = styled.div`
display: flex;

`;
function Integration({ integrations, selectedIntegration,
  showAddNewView, onClose }) {

  const [currentIntegration, setSelectedIntegraion] = useState(selectedIntegration);
  const onIntegrationChange = (integration) => {
    setSelectedIntegraion(integration);
  }
  return (
    <Container>
      <IntegrationList integrations={integrations} onIntegrationChange={onIntegrationChange}
        integration={currentIntegration} />
      { showAddNewView ? <IntegrationAdd onClose={onClose} /> : <IntegrationDetails integration={currentIntegration} onClose={onClose} />}
    </Container>
  );
}
export default Integration;
