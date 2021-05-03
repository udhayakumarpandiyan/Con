import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, Link } from 'react-router-dom';
import { PageSection, Card, Button } from '@patternfly/react-core';

import { OrganizationsAPI } from '../../../api';
import { CardBody } from '../../../components/Card';
import OrganizationForm from '../shared/OrganizationForm';
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

function OrganizationAdd() {
  const history = useHistory();
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values, groupsToAssociate) => {
    try {
      const { data: response } = await OrganizationsAPI.create(values);
      await Promise.all(
        groupsToAssociate
          .map(id => OrganizationsAPI.associateInstanceGroup(response.id, id))
          .concat(
            values.galaxy_credentials.map(({ id: credId }) =>
              OrganizationsAPI.associateGalaxyCredential(response.id, credId)
            )
          )
      );
      history.push(`/organizations/${response.id}`);
    } catch (error) {
      setFormError(error);
    }
  };

  const handleCancel = () => {
    history.push('/organizations');
  };

  return (
    <div>
      <TitleBottomSection>
        <label>Create New Organizations</label>
        <Link to="/organizations"><Button style={OrchestrationPrimaryButton}>Back</Button></Link>   
    </TitleBottomSection>
    <PageSection>
      <Card>
        <CardBody>
          <OrganizationForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitError={formError}
          />
        </CardBody>
      </Card>
    </PageSection>
    </div>
  );
}

OrganizationAdd.contextTypes = {
  custom_virtualenvs: PropTypes.arrayOf(PropTypes.string),
};

export { OrganizationAdd as _OrganizationAdd };
export default OrganizationAdd;
