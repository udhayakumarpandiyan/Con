import React, { useCallback, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Card, PageSection, Button } from '@patternfly/react-core';
import { CardBody } from '../../../components/Card';
import SmartInventoryForm from '../shared/SmartInventoryForm';
import useRequest from '../../../util/useRequest';
import { InventoriesAPI } from '../../../api';
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


function SmartInventoryAdd() {
  const history = useHistory();

  const {
    error: submitError,
    request: submitRequest,
    result: inventoryId,
  } = useRequest(
    useCallback(async (values, groupsToAssociate) => {
      const {
        data: { id: invId },
      } = await InventoriesAPI.create(values);

      await Promise.all(
        groupsToAssociate.map(({ id }) =>
          InventoriesAPI.associateInstanceGroup(invId, id)
        )
      );
      return invId;
    }, [])
  );

  const handleSubmit = async form => {
    const { instance_groups, organization, ...remainingForm } = form;

    await submitRequest(
      {
        organization: organization?.id,
        ...remainingForm,
      },
      instance_groups
    );
  };

  const handleCancel = () => {
    history.push({
      pathname: '/inventories',
      search: '',
    });
  };

  useEffect(() => {
    if (inventoryId) {
      history.push({
        pathname: `/inventories/smart_inventory/${inventoryId}/details`,
        search: '',
      });
    }
  }, [inventoryId, history]);

  return (
    <div>
      <TitleBottomSection>
        <label>Create New Smart Inventory</label>
        <Link to="/inventories"><Button style={OrchestrationPrimaryButton}>Back</Button></Link>   
    </TitleBottomSection>
    <PageSection>
      <Card>
        <CardBody>
          <SmartInventoryForm
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            submitError={submitError}
          />
        </CardBody>
      </Card>
    </PageSection>
    </div>
  );
}

export default SmartInventoryAdd;
