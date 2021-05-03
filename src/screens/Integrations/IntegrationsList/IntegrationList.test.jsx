import React from 'react';
import { act } from 'react-dom/test-utils';

import {
  mountWithContexts,
  waitForElement,
} from '../../../../testUtils/enzymeHelpers';
import { IntegrationsAPI } from '../../../api';
import IntegrationsList from './IntegrationsList';

jest.mock('../../../api/models/Integrations');

const integrations = {
  data: {
    results: [
      {
        id: 1,
        name: 'Foo',
        summary_fields: {
          organization: { name: 'Org 1', id: 10 },
          user_capabilities: { edit: true, delete: true },
        },
        url: '',
        organization: 10,
      },
      {
        id: 2,
        name: 'Bar',
        summary_fields: {
          organization: { name: 'Org 2', id: 20 },
          user_capabilities: { edit: true, delete: true },
        },
        url: '',
        organization: 20,
      },
    ],
    count: 2,
  },
};
const options = { data: { actions: { POST: true } } };
describe('<IntegrationsList/>', () => {
  let wrapper;
  test('should mount properly', async () => {
    IntegrationsAPI.read.mockResolvedValue(integrations);
    IntegrationsAPI.readOptions.mockResolvedValue(options);
    await act(async () => {
      wrapper = mountWithContexts(<IntegrationsList />);
    });
    await waitForElement(wrapper, 'IntegrationsList', el => el.length > 0);
  });
  test('should have data fetched and render 2 rows', async () => {
    IntegrationsAPI.read.mockResolvedValue(integrations);
    IntegrationsAPI.readOptions.mockResolvedValue(options);
    await act(async () => {
      wrapper = mountWithContexts(<IntegrationsList />);
    });
    await waitForElement(wrapper, 'IntegrationsList', el => el.length > 0);
    expect(wrapper.find('IntegrationListItem').length).toBe(2);
    expect(IntegrationsAPI.read).toBeCalled();
    expect(IntegrationsAPI.readOptions).toBeCalled();
  });

  test('should delete item successfully', async () => {
    IntegrationsAPI.read.mockResolvedValue(integrations);
    IntegrationsAPI.readOptions.mockResolvedValue(options);
    await act(async () => {
      wrapper = mountWithContexts(<IntegrationsList />);
    });
    waitForElement(wrapper, 'IntegrationsList', el => el.length > 0);

    wrapper
      .find('input#select-integration-1')
      .simulate('change', integrations.data.results[0]);

    wrapper.update();

    expect(wrapper.find('input#select-integration-1').prop('checked')).toBe(
      true
    );
    await act(async () =>
      wrapper.find('Button[aria-label="Delete"]').prop('onClick')()
    );

    wrapper.update();

    await act(async () =>
      wrapper.find('Button[aria-label="confirm delete"]').prop('onClick')()
    );
    expect(IntegrationsAPI.destroy).toBeCalledWith(
      integrations.data.results[0].id
    );
  });

  test('should throw content error', async () => {
    IntegrationsAPI.read.mockRejectedValue(
      new Error({
        response: {
          config: {
            method: 'get',
            url: '/api/v2/integrations/',
          },
          data: 'An error occurred',
        },
      })
    );
    IntegrationsAPI.readOptions.mockResolvedValue(options);
    await act(async () => {
      wrapper = mountWithContexts(<IntegrationsList />);
    });

    await waitForElement(wrapper, 'IntegrationsList', el => el.length > 0);
    expect(wrapper.find('ContentError').length).toBe(1);
  });

  test('should render deletion error modal', async () => {
    IntegrationsAPI.destroy.mockRejectedValue(
      new Error({
        response: {
          config: {
            method: 'delete',
            url: '/api/v2/integrations/',
          },
          data: 'An error occurred',
        },
      })
    );
    IntegrationsAPI.read.mockResolvedValue(integrations);
    IntegrationsAPI.readOptions.mockResolvedValue(options);
    await act(async () => {
      wrapper = mountWithContexts(<IntegrationsList />);
    });
    waitForElement(wrapper, 'IntegrationsList', el => el.length > 0);

    wrapper.find('input#select-integration-1').simulate('change', 'a');

    wrapper.update();

    expect(wrapper.find('input#select-integration-1').prop('checked')).toBe(
      true
    );
    await act(async () =>
      wrapper.find('Button[aria-label="Delete"]').prop('onClick')()
    );

    wrapper.update();

    await act(async () =>
      wrapper.find('Button[aria-label="confirm delete"]').prop('onClick')()
    );
    wrapper.update();

    expect(wrapper.find('ErrorDetail').length).toBe(1);
  });

  test('should not render add button', async () => {
    IntegrationsAPI.read.mockResolvedValue(integrations);
    IntegrationsAPI.readOptions.mockResolvedValue({
      data: { actions: { POST: false } },
    });
    await act(async () => {
      wrapper = mountWithContexts(<IntegrationsList />);
    });
    waitForElement(wrapper, 'IntegrationsList', el => el.length > 0);
    expect(wrapper.find('ToolbarAddButton').length).toBe(0);
  });
  test('should not render edit button for first list item', async () => {
    integrations.data.results[0].summary_fields.user_capabilities.edit = false;
    IntegrationsAPI.read.mockResolvedValue(integrations);
    IntegrationsAPI.readOptions.mockResolvedValue({
      data: { actions: { POST: false } },
    });
    await act(async () => {
      wrapper = mountWithContexts(<IntegrationsList />);
    });
    waitForElement(wrapper, 'IntegrationsList', el => el.length > 0);
    expect(
      wrapper
        .find('IntegrationListItem')
        .at(0)
        .find('PencilAltIcon').length
    ).toBe(0);
    expect(
      wrapper
        .find('IntegrationListItem')
        .at(1)
        .find('PencilAltIcon').length
    ).toBe(1);
  });
});
