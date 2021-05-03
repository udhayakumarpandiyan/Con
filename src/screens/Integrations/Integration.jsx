import React, { useState } from 'react';
import { withI18n } from '@lingui/react';
import TitleBar from '../../components/TitleBar/TitleBar';
import IntegrationsIcon from '../../assets/icons/integrations.svg';
import Widget from '../../components/Widget';
import { Grid, GridItem } from '@patternfly/react-core';
import ImageIcon from '../../assets/icons/image_icon.svg';
import styled from 'styled-components';
import Integration from './Integration/Integration';

const Icon = styled.img`
width: fit-content;
filter: invert(0.5);
`;

const Tile = styled.div`
 padding: 10px;
 display: flex;
 height: 180px;
 width: 100%;
 flex-direction: column;
 border: 0.5px solid #989898;
 border-radius: 5px;
 cursor: pointer;
 &:hover{
  box-shadow: 0px 3px 6px #00000029;
  border: 0.5px solid #007BFF;
 }
  &:hover .img{
    filter: invert(0);
  }
}
`;

const IntegrationName = styled.label`
padding: 10px 0px 20px 0px;
font-size: 28px
letter-spacing: 0px;
color: #343A40;
text-transform: uppercase;
pointer-events: none;
`;


const integrations = [{ name: "snoint", description: "Lorem ipsum, or lipsum as it is sometimes known" },
{ name: "zabbiint", description: "Lorem ipsum, or lipsum as it is sometimes known" }]
function Integrations() {

  const [isIntegrationSelected, setIntegrationSelected] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [showAddNewView, setShowAddNewView] = useState(false);

  const onAddNewClick = () => {
    setIntegrationSelected(true);
    setSelectedIntegration(null);
    setShowAddNewView(true);
  }

  const onIntegrationSelect = (integration) => {
    setIntegrationSelected(true);
    setSelectedIntegration(integration);
  }

  const onClose = () => {
    setIntegrationSelected(false);
    setShowAddNewView(false);
  }

  // const {
  //   result: {
  //     integrations
  //   },
  //   request: fetchIntegrations
  // } = useRequest(
  //   useCallback(async () => {
  //     const response = await Promise.all([IntegrationsAPI.readOptions()]);
  //     console.log("fdgfdgfdgaDSADSAD", response);
  //     return {
  //       integrations: response,
  //     };
  //   }, []),
  //   {
  //     integrations: []
  //   }
  // );

  // useEffect(() => {
  //   
  //   //fetchIntegrations();
  // }, [fetchIntegrations]
  // );


  return (
    <>
      <TitleBar title={'Orchestration Engine / '+"Integrations"}
        icon={IntegrationsIcon}
        controls={[{ label: "+ Add New", onClick: onAddNewClick }]} />
      {isIntegrationSelected ? <Widget label="INTEGRATIONS">
        <Integration integrations={integrations} showAddNewView={showAddNewView}
          selectedIntegration={selectedIntegration} onClose={onClose} />
      </Widget>
        : <Widget label="No of Integrations" count={integrations.length}>
          <Grid hasGutter={true} style={{ padding: "20px" }}>
            {integrations && integrations.map((integration) => {
              return (<GridItem span={4}>
                <Tile onClick={() => onIntegrationSelect(integration)}>
                  <Icon src={ImageIcon} alt="" />
                  <IntegrationName>{integration.name}</IntegrationName>
                  <label style={{ fontSize: "12px" }}> {integration.description}</label>
                </Tile>
              </GridItem>)
            })
            }
          </Grid>
        </Widget>
      }
    </>
  );
}

export default withI18n()(Integrations);
