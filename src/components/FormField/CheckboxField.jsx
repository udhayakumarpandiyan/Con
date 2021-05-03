import React from 'react';
import { string, func, node } from 'prop-types';
import { useField } from 'formik';
import { Checkbox as OrchestrationCheckbox } from '@patternfly/react-core';
import Popover from '../Popover';
import styled from 'styled-components';

const Checkbox = styled(OrchestrationCheckbox)`
  input{
    width: 1rem;
    height: 1rem;
  }
  & label{
    font-size: 1rem;
    color: #000000;
  }
`;

function CheckboxField({
  id,
  name,
  label,
  tooltip,
  validate,
  isDisabled,
  ...rest
}) {
  const [field] = useField({ name, validate });
  return (
    <Checkbox
      isDisabled={isDisabled}
      aria-label={label}
      label={
        <span>
          {label}
          &nbsp;
          {tooltip && <Popover content={tooltip} />}
        </span>
      }
      id={id}
      {...rest}
      isChecked={field.value}
      {...field}
      onChange={(value, event) => {
        field.onChange(event);
      }}
    />
  );
}
CheckboxField.propTypes = {
  id: string.isRequired,
  name: string.isRequired,
  label: string.isRequired,
  validate: func,
  tooltip: node,
};
CheckboxField.defaultProps = {
  validate: () => {},
  tooltip: '',
};

export default CheckboxField;
