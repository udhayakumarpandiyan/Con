import React from 'react';

import { mountWithContexts } from '../../../testUtils/enzymeHelpers';

import Integrations from './Integrations';

describe('<Integrations />', () => {
  let pageWrapper;
  let pageSections;

  beforeEach(() => {
    pageWrapper = mountWithContexts(<Integrations />);
    pageSections = pageWrapper.find('PageSection');
  });

  afterEach(() => {
    pageWrapper.unmount();
  });

  test('initially renders without crashing', () => {
    expect(pageWrapper.length).toBe(1);
    expect(pageSections.length).toBe(1);
    expect(pageSections.first().props().variant).toBe('light');
  });
});
