import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Form,
  FormGroup,
  TextInput as PFTextInput,
  ActionGroup as PFActionGroup,
  Button
} from '@patternfly/react-core';

import styled from 'styled-components';
import DeleteButton from '../../../components/DeleteButton';
import EditButton from '../../../components/EditButton';

const Container = styled.div`
width: 66%;
display: flex;
flex-direction: column;
`;

const Header = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
height: 47px;
padding: 20px;
background: #FFFFFF;
box-shadow: 0px 3px 6px #00000029;
& label{
  font-size: 17px;
  letter-spacing: 0px;
  color: #007BFF;
}
`;

const Controls = styled.div`
float: right;
`;

const DetailsSection = styled.div`
padding: 20px;
`;

const Horizontal = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
`;

const ActionGroup = styled(PFActionGroup)`
display: flex;
justify-content: center;
`;

const TextInput = styled(PFTextInput)`
 background-color: #EEEEEE;
 height: 39px;
 border: none;
 border-radius: 2px;
 `;


function IntegrationAdd({ onClose }) {
  const history = useHistory();
  const [submitError, setSubmitError] = useState(null);

  // const handleSubmit = async ({ ...values }) => {
  //   values.organization = values.organization.id;
  //   try {
  //     const {
  //       data: { id },
  //     } = await IntegrationsAPI.create(values);
  //     history.push(`/integrations/${id}/details`);
  //   } catch (err) {
  //     setSubmitError(err);
  //   }
  // };


  // useEffect(() => {
  //   fetchOptions();
  // }, [fetchOptions]);

  // if (error) {
  //   return <ContentError error={error} />;
  // }
  return (
    <Container>
      <Header>
        <label>
          Add New Integration
        </label>
        <Controls>
          <EditButton />
          <DeleteButton />
        </Controls>
      </Header>
      <DetailsSection>
        <Form>
          <Horizontal>
            <FormGroup
              style={{ width: "50%" }}
              label="Name"
              isRequired
              fieldId="simple-form-name-02">
              <TextInput
                isRequired
                type="text"
                id="simple-form-name-02"
                name="simple-form-name-02"
                aria-describedby="simple-form-name-02-helper" />
            </FormGroup>
            <FormGroup label="Description"
              style={{ width: "40%" }}
              fieldId="simple-form-email-02">
              <TextInput
                type="text"
                id="simple-form-name-02"
                name="simple-form-name-02"
                aria-describedby="simple-form-name-02-helper"
              />
            </FormGroup>
          </Horizontal>
          <Horizontal>
            <FormGroup label="Organization" isRequired style={{ width: "50%" }}
              fieldId="simple-form-email-02">
              <TextInput
                isRequired
                type="text"
                id="simple-form-name-02"
                name="simple-form-name-02"
                aria-describedby="simple-form-name-02-helper"
              />
            </FormGroup>
            <FormGroup style={{ width: "40%" }}
              label="Tool"
              fieldId="simple-form-name-02">
              <TextInput
                type="text"
                id="simple-form-name-02"
                name="simple-form-name-02"
                aria-describedby="simple-form-name-02-helper"
              />
            </FormGroup>
          </Horizontal>
          <Horizontal>
            <FormGroup style={{ width: "50%" }}
              label="URL"
              fieldId="simple-form-name-02" >
              <TextInput
                type="text"
                id="simple-form-name-02"
                name="simple-form-name-02"
                aria-describedby="simple-form-name-02-helper"
              />
            </FormGroup>
            <FormGroup style={{ width: "40%" }}
              label="Username"
              fieldId="simple-form-name-02">
              <TextInput
                type="text"
                id="simple-form-name-02"
                name="simple-form-name-02"
                aria-describedby="simple-form-name-02-helper" />
            </FormGroup>
          </Horizontal>
          <Horizontal>
            <FormGroup style={{ width: "50%" }}
              label="Password"
              fieldId="simple-form-name-02">
              <TextInput
                type="text"
                id="simple-form-name-02"
                name="simple-form-name-02"
                aria-describedby="simple-form-name-02-helper"
              />
            </FormGroup>
            <FormGroup style={{ width: "40%" }}
              label="Authentication Token"
              fieldId="simple-form-name-02">
              <TextInput
                type="text"
                id="simple-form-name-02"
                name="simple-form-name-02"
                aria-describedby="simple-form-name-02-helper"
              />
            </FormGroup>
          </Horizontal>

          <ActionGroup>
            <Button variant="tertiary" onClick={onClose}>Cancel</Button>
            <Button variant="primary">Submit</Button>
          </ActionGroup>
        </Form>
      </DetailsSection>
    </Container>


  );
}
export default IntegrationAdd;
