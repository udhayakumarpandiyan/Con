import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Card, PageSection, Button } from '@patternfly/react-core';
import { CardBody } from '../../../components/Card';
import JobTemplateForm from '../shared/JobTemplateForm';
import { JobTemplatesAPI, OrganizationsAPI } from '../../../api';
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


function JobTemplateAdd() {
  const [formSubmitError, setFormSubmitError] = useState(null);
  const history = useHistory();

  async function handleSubmit(values) {
    const {
      labels,
      instanceGroups,
      initialInstanceGroups,
      credentials,
      webhook_credential,
      webhook_key,
      webhook_url,
      ...remainingValues
    } = values;

    setFormSubmitError(null);
    remainingValues.project = remainingValues.project.id;
    remainingValues.webhook_credential = webhook_credential?.id;
    try {
      const {
        data: { id, type },
      } = await JobTemplatesAPI.create(remainingValues);
      await Promise.all([
        submitLabels(id, labels, values.project.summary_fields.organization.id),
        submitInstanceGroups(id, instanceGroups),
        submitCredentials(id, credentials),
      ]);
      history.push(`/templates/${type}/${id}/details`);
    } catch (error) {
      setFormSubmitError(error);
    }
  }

  async function submitLabels(templateId, labels = [], orgId) {
    if (!orgId) {
      try {
        const {
          data: { results },
        } = await OrganizationsAPI.read();
        orgId = results[0].id;
      } catch (err) {
        throw err;
      }
    }
    const associationPromises = labels.map(label =>
      JobTemplatesAPI.associateLabel(templateId, label, orgId)
    );

    return Promise.all([...associationPromises]);
  }

  function submitInstanceGroups(templateId, addedGroups = []) {
    const associatePromises = addedGroups.map(group =>
      JobTemplatesAPI.associateInstanceGroup(templateId, group.id)
    );
    return Promise.all(associatePromises);
  }

  function submitCredentials(templateId, credentials = []) {
    const associateCredentials = credentials.map(cred =>
      JobTemplatesAPI.associateCredentials(templateId, cred.id)
    );
    return Promise.all(associateCredentials);
  }

  function handleCancel() {
    history.push(`/templates`);
  }

  return (
    <div>
      <TitleBottomSection>
        <label>Create New Job Template</label>
        <Link to="/templates"><Button style={OrchestrationPrimaryButton}>Back</Button></Link>   
    </TitleBottomSection>
    <PageSection>
      <Card>
        <CardBody>
          <JobTemplateForm
            handleCancel={handleCancel}
            handleSubmit={handleSubmit}
            submitError={formSubmitError}
          />
        </CardBody>
      </Card>
    </PageSection>
    </div>
  );
}

export default JobTemplateAdd;
