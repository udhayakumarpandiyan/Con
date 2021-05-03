import React, { useState } from 'react';
import { withI18n } from '@lingui/react';
import { Grid, GridItem } from '@patternfly/react-core';
import styled from 'styled-components';
import ImageIcon from '../../../assets/icons/image_icon.svg';

const Container = styled.div`
  width: 34%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #EEEEEE;
  border: 0.25px solid #dadada;
  border-top: none;
  border-left: none;
`;

const Tile = styled.div`
 padding: 10px;
 display: flex;
 height: 87px
 width: 100%;
 background-color: #FFFFFF;
 border: ${props => props.selected ? '2px solid #007BFF' : '#0.5px solid #989898'} ;
 ${props => props.selected && 'box-shadow: 0px 3px 6px #00000029'};
 border-radius: 5px;
 cursor: pointer;
`;

const InnerContainer = styled.div`
 display: flex;
 flex-direction: column;
 padding-left: 20px;

`;
const Icon = styled.img`
width: fit-content;
filter: ${props => props.selected ? 'invert(0)' : 'invert(0.5)'};

`;

const IntegrationName = styled.label`
font-size: 14px;
font-weight: bold;
letter-spacing: 0px;
color: ${props => props.selected ? '#007BFF' : '#343A40'};
pointer-events: none;
`;

const Label = styled.label`
font-size: 12px;
pointer-events: none;
`;

function IntegrationsList({ integrations, integration, onIntegrationChange }) {

  const [selectedIntegration, setSelectedIntegraion] = useState(integration);
  // const {
  //   isLoading: deleteLoading,
  //   deletionError,
  //   deleteItems: handleDeleteIntegrations,
  //   clearDeletionError,
  // } = useDeleteItems(
  //   useCallback(async () => {
  //     await Promise.all(selected.map(({ id }) => IntegrationsAPI.destroy(id)));
  //   }, [selected]),
  //   {
  //     qsConfig: QS_CONFIG,
  //     allItemsSelected: isAllSelected,
  //     fetchItems: fetchIntegrations,
  //   }
  // );

  // const handleDelete = async () => {
  //   await handleDeleteIntegrations();
  //   setSelected([]);
  // };

  const onIntegrationSelect = (integration) => {
    setSelectedIntegraion(integration);
    onIntegrationChange(integration);
  }
  return (
    <>
      <Container>    
        <Grid hasGutter={true}>
          {integrations && integrations.map((integration) => {
            return (<GridItem span={12}>
              <Tile selected={selectedIntegration && integration.name === selectedIntegration.name}
                onClick={() => onIntegrationSelect(integration)}>
                <Icon src={ImageIcon} alt="" selected={selectedIntegration && integration.name === selectedIntegration.name} />
                <InnerContainer>
                  <IntegrationName selected={selectedIntegration && integration.name === selectedIntegration.name}>{integration.name}</IntegrationName>
                  <Label> {integration.description}</Label>
                </InnerContainer>
              </Tile>
            </GridItem>)
          })
          }
        </Grid>
      </Container>
      {/* <AlertModal
        isOpen={deletionError}
        variant="error"
        title={i18n._(t`Error!`)}
        onClose={clearDeletionError}
      >
        {i18n._(t`Failed to delete one or more integrations.`)}
        <ErrorDetail error={deletionError} />
      </AlertModal> */}
    </>
  );
}
export default withI18n()(IntegrationsList);
