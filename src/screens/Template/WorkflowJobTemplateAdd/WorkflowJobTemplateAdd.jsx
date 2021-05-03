import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import { Card, PageSection, Button } from '@patternfly/react-core';
import { CardBody } from '../../../components/Card';

import { WorkflowJobTemplatesAPI, OrganizationsAPI } from '../../../api';
import WorkflowJobTemplateForm from '../shared/WorkflowJobTemplateForm';
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

function WorkflowJobTemplateAdd() {
  const history = useHistory();
  const [formSubmitError, setFormSubmitError] = useState(null);

  const handleSubmit = async values => {
    const {
      labels,
      inventory,
      organization,
      webhook_credential,
      webhook_key,
      ...templatePayload
    } = values;
    templatePayload.inventory = inventory?.id;
    templatePayload.organization = organization?.id;
    templatePayload.webhook_credential = webhook_credential?.id;
    const organizationId =
      organization?.id || inventory?.summary_fields?.organization.id;
    try {
      const {
        data: { id },
      } = await WorkflowJobTemplatesAPI.create(templatePayload);
      await Promise.all(await submitLabels(id, labels, organizationId));
      history.push(`/templates/workflow_job_template/${id}/visualizer`);
    } catch (err) {
      setFormSubmitError(err);
    }
  };

  const submitLabels = async (templateId, labels = [], organizationId) => {
    if (!organizationId) {
      try {
        const {
          data: { results },
        } = await OrganizationsAPI.read();
        organizationId = results[0].id;
      } catch (err) {
        throw err;
      }
    }
    const associatePromises = labels.map(label =>
      WorkflowJobTemplatesAPI.associateLabel(templateId, label, organizationId)
    );
    return [...associatePromises];
  };

  const handleCancel = () => {
    history.push(`/templates`);
  };

  return (
    <div>
      <TitleBottomSection>
        <label>Create New Workflow Template</label>
        <Link to="/templates"><Button style={OrchestrationPrimaryButton}>Back</Button></Link>   
    </TitleBottomSection>
    <PageSection>
      <Card>
        <CardBody>
          <WorkflowJobTemplateForm
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

export default WorkflowJobTemplateAdd;
