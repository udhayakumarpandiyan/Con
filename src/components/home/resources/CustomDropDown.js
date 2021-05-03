import React from 'react';
// import $ from "jquery";
import { Dropdown } from 'reactjs-dropdown-component';

export function CustomDropDown({ list = [
    { value: 1, label: 'Past 1 day' },
    { value: 7, label: 'Past 1 week' }, { label: 'Past 1 month', value: 30 }],
    onChange = () => { }, defaultSelected = 'Past 1 week', textnIconColor = '#000', fontFamily = 'Open Sans' }) {
    return <Dropdown
        title={defaultSelected}
        list={list}
        onChange={onChange}
        styles={{
            headerTitle: { color: textnIconColor, fontSize: '1rem', fontFamily, height: '30px', overflowY: 'hidden' }
        }}
        arrowUpIcon={<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill={textnIconColor} class='bi bi-chevron-down' viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
        </svg>}
        arrowDownIcon={<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill={textnIconColor} class='bi bi-chevron-down' viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
        </svg>}
    />
}
