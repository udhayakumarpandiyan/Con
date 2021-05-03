import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput as PFTextInput } from '@patternfly/react-core';
import { SearchIcon as PFSearchIcon } from '@patternfly/react-icons';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
`;

const TextInput = styled(PFTextInput)`
  width: 260px;
  height: 38px;
  border: 1px solid #989898 !important;
  border-radius: 0px;
  padding: 0px 32px 0px 20px;
  outline: none;
  background-color: #ffffff !important;
  --pf-c-form-control--BorderBottomColor: #eeeeee;
`;

const SearchIcon = styled(PFSearchIcon)`
 top : 0px; 
 left: 0px;
 padding: 8px;
 width: 50px;
 height: 35px;
 fill: #FFFFFF;
 background-color: #646972;
 cursor: pointer;

`;
class SearchBox extends Component {
  render() {
    const {
      placeholder, onSearch, onChange
    } = this.props;

    return (
      <Container>
        <TextInput placeholder={placeholder} onChange={(e) => onChange(e)} />
        <SearchIcon onClick={onSearch} />
      </Container>
    );
  }
}

SearchBox.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
  onChange: PropTypes.func
};

SearchBox.defaultProps = {
  placeholder: 'Search',
  onChange: () => {

  }
  ,
  onSearch: () => {

  }
};

export default SearchBox;
