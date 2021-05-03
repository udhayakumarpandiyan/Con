import React from 'react';
import { t } from '@lingui/macro';
import { withI18n } from '@lingui/react';
import {
  Title,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody as OrchestrationEmptyStateBody,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import styled from 'styled-components';

const EmptyStateBody = styled(OrchestrationEmptyStateBody)`
  color: #0E1B2A;
`;

const ContentEmpty = ({ i18n, title = '', message = '' }) => (
  <EmptyState variant="full">
    <Title size="lg" headingLevel="h3">
      {title || i18n._(t`No items found.`)}
    </Title>
    <EmptyStateBody>{message}</EmptyStateBody>
  </EmptyState>
);

export { ContentEmpty as _ContentEmpty };
export default withI18n()(ContentEmpty);
