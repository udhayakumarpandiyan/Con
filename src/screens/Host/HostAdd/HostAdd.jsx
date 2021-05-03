import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { PageSection, Card, Button } from '@patternfly/react-core';

import HostForm from '../../../components/HostForm';
import { CardBody } from '../../../components/Card';
import { HostsAPI } from '../../../api';
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

function HostAdd() {
  const [formError, setFormError] = useState(null);
  const history = useHistory();

  const handleSubmit = async formData => {
    try {
      const { data: response } = await HostsAPI.create(formData);
      history.push(`/hosts/${response.id}/details`);
    } catch (error) {
      setFormError(error);
    }
  };

  const handleCancel = () => {
    history.push(`/hosts`);
  };

  return (
    <div>
      <TitleBottomSection>
        <label>Create New Host</label>
        <Link to="/credentials"><Button style={OrchestrationPrimaryButton}>Back</Button></Link>   
    </TitleBottomSection>
    <PageSection>
      <Card>
        <CardBody>
          <HostForm
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            submitError={formError}
          />
        </CardBody>
      </Card>
    </PageSection>
    </div>
  );
}

export default HostAdd;
