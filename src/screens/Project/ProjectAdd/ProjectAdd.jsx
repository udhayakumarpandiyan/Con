import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Card, PageSection, Button } from '@patternfly/react-core';
import { CardBody } from '../../../components/Card';
import ProjectForm from '../shared/ProjectForm';
import { ProjectsAPI } from '../../../api';
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

function ProjectAdd() {
  const [formSubmitError, setFormSubmitError] = useState(null);
  const history = useHistory();

  const handleSubmit = async values => {
    if (values.scm_type === 'manual') {
      values.scm_type = '';
    }
    if (!values.credential) {
      // Depending on the permissions of the user submitting the form,
      // the API might throw an unexpected error if our creation request
      // has a zero-length string as its credential field. As a work-around,
      // normalize falsey credential fields by deleting them.
      delete values.credential;
    }
    setFormSubmitError(null);
    try {
      const {
        data: { id },
      } = await ProjectsAPI.create({
        ...values,
        organization: values.organization.id,
      });
      history.push(`/projects/${id}/details`);
    } catch (error) {
      setFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    history.push(`/projects`);
  };

  return (
    <div>
      <TitleBottomSection>
        <label>Create New Project</label>
        <Link to="/projects"><Button style={OrchestrationPrimaryButton}>Back</Button></Link>   
    </TitleBottomSection>
    <PageSection>
      <Card>
        <CardBody>
          <ProjectForm
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

export default ProjectAdd;
