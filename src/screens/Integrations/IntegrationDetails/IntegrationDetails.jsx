import React from 'react';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import {
  Form,
  FormGroup,
  Popover,
  ActionGroup as PFActionGroup,
  Button
} from '@patternfly/react-core';
import styled from 'styled-components';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';
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
padding: 0px 20px;
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

function IntegrationDetails({
  integration,
  onClose
}) {

  return (
    <Container>
      <Header>
        <label>
          {`${integration.name} Integration Details`}
        </label>
        <Controls>
          <EditButton />
          <DeleteButton />
        </Controls>
      </Header>
      <DetailsSection>
        <Form >
          <Horizontal>
            <FormGroup
              style={{ width: "60%" }}
              label="Name"
              isRequired
              fieldId="simple-form-name-02"
            >
              <label>{`XYZ name`}</label>
            </FormGroup>
            <FormGroup style={{ width: "40%" }}
              label="Description"
              fieldId="simple-form-email-02"
              labelIcon={
                <Popover
                  headerContent={
                    <div>
                      The{' '}<a href="https://schema.org/name" target="_blank">name</a>{' '}of a{' '}<a href="https://schema.org/Person" target="_blank">Person</a>
                    </div>
                  }
                  bodyContent={
                    <div>
                      Often composed of{' '}
                      <a href="https://schema.org/givenName" target="_blank">
                        givenName
                  </a>{' '}
                  and{' '}
                      <a href="https://schema.org/familyName" target="_blank">
                        familyName
                  </a>
                  .
                </div>
                  }
                >
                  <button
                    type="button"
                    aria-label="More info for name field"
                    onClick={e => e.preventDefault()}
                    aria-describedby="simple-form-name-02"
                    className="pf-c-form__group-label-help"
                  >
                    <HelpIcon noVerticalAlign />
                  </button>
                </Popover>
              }>
              <label>Description about the XYZ </label>
            </FormGroup>
          </Horizontal>
          <Horizontal>
            <FormGroup style={{ width: "60%" }} label="Organization"
              isRequired
              fieldId="simple-form-email-02"
              labelIcon={
                <Popover
                  headerContent={
                    <div>
                      The{' '}<a href="https://schema.org/name" target="_blank">name</a>{' '}of a{' '}<a href="https://schema.org/Person" target="_blank">Person</a>
                    </div>
                  }
                  bodyContent={
                    <div>
                      Often composed of{' '}
                      <a href="https://schema.org/givenName" target="_blank">
                        givenName
                  </a>{' '}
                  and{' '}
                      <a href="https://schema.org/familyName" target="_blank">
                        familyName
                  </a>
                  .
                </div>
                  }
                >
                  <button
                    type="button"
                    aria-label="More info for name field"
                    onClick={e => e.preventDefault()}
                    aria-describedby="simple-form-name-02"
                    className="pf-c-form__group-label-help"
                  >
                    <HelpIcon noVerticalAlign />
                  </button>
                </Popover>
              }>
              <label>Trianz</label>
            </FormGroup>
            <FormGroup style={{ width: "40%" }}
              label="Tool"
              fieldId="simple-form-name-02"
            >
              <label>Sample tool</label>
            </FormGroup>
          </Horizontal>
          <Horizontal>
            <FormGroup style={{ width: "60%" }}
              label="URL"
              fieldId="simple-form-name-02"
            >
              <label>https://testurl</label>
            </FormGroup>
            <FormGroup style={{ width: "40%" }}
              label="Username"
              fieldId="simple-form-name-02"
            >
              <label>XYZ</label>
            </FormGroup>
          </Horizontal>
          <Horizontal>
            <FormGroup style={{ width: "60%" }}
              label="Password"
              fieldId="simple-form-name-02"
            >
              <label>Pass@word123</label>
            </FormGroup>
            <FormGroup style={{ width: "40%" }}
              label="Authentication Token"
              fieldId="simple-form-name-02">
              <label>QWQE794502133sDSs323</label>
            </FormGroup>
          </Horizontal>

          <ActionGroup>
            <Button variant="primary" onClick={onClose}>Close</Button>
          </ActionGroup>
        </Form>
      </DetailsSection>
    </Container>
  );
}
export default withI18n()(IntegrationDetails);
