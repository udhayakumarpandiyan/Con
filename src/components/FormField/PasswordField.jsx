import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import { FormGroup, InputGroup } from '@patternfly/react-core';
import Popover from '../Popover';
import PasswordInput from './PasswordInput';
import styled from 'styled-components';

const OrchestrationPasswordInput = styled.div`
  .pf-c-form-control{    
    --pf-global--BackgroundColor--100: #eeeeee;
    --pf-c-form-control--BorderBottomColor: #eeeeee;
  }
  & .pf-c-button{    
    --pf-global--BackgroundColor--100: #646972;
  }
  & svg{
    fill: #ffffff;
  }
`;


function PasswordField(props) {
  const { id, name, label, validate, isRequired, helperText } = props;
  const [, meta] = useField({ name, validate });
  const isValid = !(meta.touched && meta.error);

  return (
    <FormGroup
      fieldId={id}
      helperTextInvalid={meta.error}
      isRequired={isRequired}
      validated={isValid ? 'default' : 'error'}
      label={label}
      labelIcon={helperText && <Popover content={helperText} />}
    >
      <OrchestrationPasswordInput>
      <InputGroup>
        <PasswordInput {...props} />
      </InputGroup>
      </OrchestrationPasswordInput>
    </FormGroup>
  );
}

PasswordField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  validate: PropTypes.func,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

PasswordField.defaultProps = {
  validate: () => {},
  isRequired: false,
  isDisabled: false,
};

export default PasswordField;
