import React from 'react';
import { shallow } from 'enzyme';
import Container from './Container';

describe('<Container>', () => {
  it('should render contents', () => {
    const wrapper = shallow(
      <Container label="Advanced">foo</Container>
    );
  
    expect(wrapper.find('Container').prop('children')).toEqual('foo');
  });

  it('should toggle when clicked', () => {
    const wrapper = shallow(
      <Container label="Advanced">foo</Container>
    );
    wrapper.find('Button').simulate('click');
   
  });
});
