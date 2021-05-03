import React, { useCallback, useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { PageSection, Card, Button } from '@patternfly/react-core';
import { CardBody } from '../../../components/Card';
import ContentError from '../../../components/ContentError';
import ContentLoading from '../../../components/ContentLoading';

import {
  CredentialInputSourcesAPI,
  CredentialTypesAPI,
  CredentialsAPI,
} from '../../../api';
import CredentialForm from '../shared/CredentialForm';
import useRequest from '../../../util/useRequest';
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
function CredentialAdd({ me }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [credentialTypes, setCredentialTypes] = useState(null);
  const history = useHistory();

  const {
    error: submitError,
    request: submitRequest,
    result: credentialId,
  } = useRequest(
    useCallback(
      async (values, credentialTypesMap) => {
        const { inputs: credentialTypeInputs } = credentialTypesMap[
          values.credential_type
        ];

        const {
          inputs,
          organization,
          passwordPrompts,
          ...remainingValues
        } = values;

        const nonPluginInputs = {};
        const pluginInputs = {};
        const possibleFields = credentialTypeInputs.fields || [];

        possibleFields.forEach(field => {
          const input = inputs[field.id];
          if (input.credential && input.inputs) {
            pluginInputs[field.id] = input;
          } else if (passwordPrompts[field.id]) {
            nonPluginInputs[field.id] = 'ASK';
          } else {
            nonPluginInputs[field.id] = input;
          }
        });

        const modifiedData = { inputs: nonPluginInputs, ...remainingValues };
        // can send only one of org, user, team
        if (organization?.id) {
          modifiedData.organization = organization.id;
        } else if (me?.id) {
          modifiedData.user = me.id;
        }
        const {
          data: { id: newCredentialId },
        } = await CredentialsAPI.create(modifiedData);

        await Promise.all(
          Object.entries(pluginInputs).map(([key, value]) =>
            CredentialInputSourcesAPI.create({
              input_field_name: key,
              metadata: value.inputs,
              source_credential: value.credential.id,
              target_credential: newCredentialId,
            })
          )
        );

        return newCredentialId;
      },
      [me]
    )
  );

  useEffect(() => {
    if (credentialId) {
      history.push(`/credentials/${credentialId}/details`);
    }
  }, [credentialId, history]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { results: loadedCredentialTypes },
        } = await CredentialTypesAPI.read();
        setCredentialTypes(
          loadedCredentialTypes.reduce((credentialTypesMap, credentialType) => {
            credentialTypesMap[credentialType.id] = credentialType;
            return credentialTypesMap;
          }, {})
        );
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCancel = () => {
    history.push('/credentials');
  };

  const handleSubmit = async values => {
    await submitRequest(values, credentialTypes);
  };

  if (error) {
    return (
      <PageSection>
        <Card>
          <CardBody>
            <ContentError error={error} />
          </CardBody>
        </Card>
      </PageSection>
    );
  }
  if (isLoading) {
    return (
      <PageSection>
        <Card>
          <CardBody>
            <ContentLoading />
          </CardBody>
        </Card>
      </PageSection>
    );
  }
  return (
    <div>
      <TitleBottomSection>
        <label>Create New Credential</label>
        <Link to="/credentials"><Button style={OrchestrationPrimaryButton}>Back</Button></Link>   
    </TitleBottomSection>
    <PageSection>
      <Card>
        <CardBody>
          <CredentialForm
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            credentialTypes={credentialTypes}
            submitError={submitError}
          />
        </CardBody>
      </Card>
    </PageSection>
    </div>
  );
}

export { CredentialAdd as _CredentialAdd };
export default CredentialAdd;
