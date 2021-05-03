import { OptionsMenu } from '@patternfly/react-core';
import React, { useState } from 'react';
const MultiSelect = (props) => {

    let tagOptions = props.options;
    if (props.options) {
        props.options.forEach(option => {
            option.selected = false;
        });
    }

    const [selectedOptions, setSelectedOptions] = useState(tagOptions);

    console.log("sadsad", tagOptions);
    // const handleChange = (event) => {
    //     this.setState({ value: Array.from(event.target.selectedOptions, (item) => item.value) });
    // }
    const onSelect = (e) => {
        let value = e.target.value;
        let options = selectedOptions;
        options.forEach(option => {
            if (option.value === value) {
                option.selected = !option.selected;
            }
        });
        options.push({ value: e.target.value, name: e.target.label });
        setSelectedOptions(options);
    }


    return (

        <select value={tagOptions[0] && tagOptions[0].name} >
            {tagOptions && tagOptions.map((option, index) => {
             
                return (<option key={index} value={option.value}
                 onClick={(e) => onSelect(e)}>
                    {/* <label for={`check${index}`} >
                        <input id={`check${index}`} type="checkbox" checked={option.selected} value={option.value} /> */}
                        {option.label}
                    {/* </label> */}

                </option>)
            })
            }
        </select>


    );

}
export default MultiSelect;