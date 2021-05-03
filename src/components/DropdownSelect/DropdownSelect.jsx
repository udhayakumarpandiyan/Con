import React from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownItem
} from '@patternfly/react-core';
import CaretDownIcon from '@patternfly/react-icons/dist/js/icons/caret-down-icon';

import './index.css';

class DropdownSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      selected: null
    };
    this.onToggle = isOpen => {
      this.setState({
        isOpen
      });
    };
    this.onSelect = (event) => {
      this.setState({
        isOpen: !this.state.isOpen,
        selected: event.target.innerHTML
      }, () => {
        if (this.props.onSelect) {
          this.props.onSelect(this.state.selected);
        }
      }
      );
    };
   
  }

  render() {
    const { isOpen } = this.state;
    const dropdownItems = [
      <DropdownItem key="link">Link</DropdownItem>,
      <DropdownItem key="action" component="button">
        Action
      </DropdownItem>,
      <DropdownItem key="disabled link" isDisabled href="www.google.com">
        Disabled Link
      </DropdownItem>,
      <DropdownItem key="disabled action" isDisabled component="button">
        Disabled Action
      </DropdownItem>,
    ];
    return (
      <Dropdown className="dropdown"
        onSelect={this.onSelect}
        toggle={
          <DropdownToggle className="dropdown-toggle" id="toggle-id" onToggle={this.onToggle} toggleIndicator={CaretDownIcon}>
            {this.state.selected ? this.state.selected : 'Select'}
          </DropdownToggle>
        }
        isOpen={isOpen}
        value={this.state.selected}
        dropdownItems={this.props.dropdownItems ? this.props.dropdownItems : dropdownItems}
      />
    );
  }
}
export default DropdownSelect;