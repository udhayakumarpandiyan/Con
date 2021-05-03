import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Card, PageSection } from '@patternfly/react-core';
import IntegrationForm from '../shared/IntegrationForm';
import { IntegrationsAPI } from '../../../api';
import { CardBody } from '../../../components/Card';

function IntegrationEdit({
  integration,
  authorizationOptions,
  clientTypeOptions,
}) {
  const history = useHistory();
  const { id } = useParams();
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async ({ ...values }) => {
    values.organization = values.organization.id;
    try {
      await IntegrationsAPI.update(id, values);
      history.push(`/integrations/${id}/details`);
    } catch (err) {
      setSubmitError(err);
    }
  };

  const handleCancel = () => {
    history.push(`/integrations/${id}/details`);
  };
  return (
    <>
      <PageSection>
        <Card>
          <CardBody>
            <IntegrationForm
              onSubmit={handleSubmit}
              integration={integration}
              onCancel={handleCancel}
              authorizationOptions={authorizationOptions}
              clientTypeOptions={clientTypeOptions}
              submitError={submitError}
            />
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
}
export default IntegrationEdit;
