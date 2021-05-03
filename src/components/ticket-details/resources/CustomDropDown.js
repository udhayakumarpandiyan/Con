import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function SimpleSelect(props) {

    const classes = useStyles();
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
        const ids = typeof event.target.value === "string" ? event.target.value.split('||') : []
        props?.onSelectedChannel && props.onSelectedChannel(event, ids[0], ids[1]);
    };

    const channelList = Array.isArray(props.channelList) && props.channelList.flat();
    return (
        <div>
            <FormControl className={classes.formControl}>
                <Select
                    value={age}
                    onChange={handleChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem value="" disabled>
                        Select Channel
          </MenuItem>
                    {
                        Array.isArray(channelList) && channelList.map((channel, index) =>
                            channel && <MenuItem key={index} value={channel.value}>{channel.span}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
        </div>
    );
}
