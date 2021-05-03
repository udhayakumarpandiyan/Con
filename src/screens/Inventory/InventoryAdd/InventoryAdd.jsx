import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { PageSection, Card, Button } from '@patternfly/react-core';
import { CardBody } from '../../../components/Card';
import ContentLoading from '../../../components/ContentLoading';

import { InventoriesAPI, CredentialTypesAPI } from '../../../api';
import InventoryForm from '../shared/InventoryForm';
import styled from 'styled-components';

const TitleBottomSection = styled.div`
 display: flex;
 justify-content: space-between;
 background: transparent;
 padding: 0px 20px 10px 25px;
 margin-top: -46px;
 & label{
   text-align: left; 
   font: 1.25rem;
   letter-spacing: 0px;
   color: #593CAB;
   text-transform: capitalize;
   opacity: 1;
   margin-top: 14px;
 }
`;
const OrchestrationPrimaryButton = {
    width: "7.65rem",
    height: "2.37rem",
    background: "#593CAB 0% 0% no-repeat padding-box",
}

function InventoryAdd() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [credentialTypeId, setCredentialTypeId] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { results: loadedCredentialTypeId },
        } = await CredentialTypesAPI.read({ kind: 'insights' });
        setCredentialTypeId(loadedCredentialTypeId[0].id);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [isLoading, credentialTypeId]);

  const handleCancel = () => {
    history.push('/inventories');
  };

  const handleSubmit = async values => {
    const {
      instanceGroups,
      organization,
      insights_credential,
      ...remainingValues
    } = values;
    try {
      const {
        data: { id: inventoryId },
      } = await InventoriesAPI.create({
        organization: organization.id,
        insights_credential: insights_credential
          ? insights_credential.id
          : null,
        ...remainingValues,
      });
      if (instanceGroups) {
        const associatePromises = instanceGroups.map(async ig =>
          InventoriesAPI.associateInstanceGroup(inventoryId, ig.id)
        );
        await Promise.all(associatePromises);
      }
      const url = history.location.pathname.startsWith(
        '/inventories/smart_inventory'
      )
        ? `/inventories/smart_inventory/${inventoryId}/details`
        : `/inventories/inventory/${inventoryId}/details`;

      history.push(`${url}`);
    } catch (err) {
      setError(err);
    }
  };

  if (isLoading) {
    return <ContentLoading />;
  }
  return (
    <div>
      <TitleBottomSection>
        <label>Create New Inventory</label>
        <Link to="/inventories"><Button style={OrchestrationPrimaryButton}>Back</Button></Link>   
    </TitleBottomSection>
    <PageSection>
      <Card>
        <CardBody>
          <InventoryForm
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            credentialTypeId={credentialTypeId}
            submitError={error}
          />
        </CardBody>
      </Card>
    </PageSection>
    </div>
  );
}

export { InventoryAdd as _InventoryAdd };
export default InventoryAdd;
