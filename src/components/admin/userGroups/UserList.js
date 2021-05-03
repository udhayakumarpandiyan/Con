import React, { useEffect, useState, Fragment } from 'react';
import $ from 'jquery';

function UserList({ userList: users, groupUsers, clientId }) {

    const [userList, setUserList] = useState([]);
    const [existUsers, setExistUsers] = useState([]);
    const [checkedValues, setCheckedValues] = useState([]);
    const [uncheckedValues, setUncheckedValues] = useState([]);

    useEffect(() => {
        let selectedUserIds = Array.isArray(groupUsers) ? groupUsers.map(item => item.userId) : [];
        setExistUsers(selectedUserIds);
        setUserList(users);
    }, [])

    const onCheckChange = (e) => {
        e.preventDefault();
        var value = e.target.value;
        if ($(`#${e.target.id}`).is(':checked')) {
            $(this).prop('checked', true);
            var i = uncheckedValues.indexOf(value);
            if (i !== -1) uncheckedValues.splice(i, 1);
            setCheckedValues(checkedValues.concat([value]));
            setUncheckedValues(uncheckedValues);
        } else {
            var i = checkedValues.indexOf(value);
            if (i !== -1) checkedValues.splice(i, 1);
            $(this).prop('checked', false);
            setCheckedValues(checkedValues);
            setUncheckedValues(uncheckedValues.concat([value]));
        }
    }

    const tableBody = () => {
        return <tbody>
            {
                Array.isArray(userList) && userList.map((item, i) => {
                    return (
                        Array.isArray(existUsers) && existUsers.includes(item.userId) ?
                            <tr key={`${item.userId}_${i}`}>
                                <td width="30%">
                                    <input type="checkbox" name={item.userId} id={`${item.userId}_${i + 1}`} className="checked" value={item.userId} onChange={(e) => {
                                        onCheckChange(e);
                                    }}
                                        checked={checkedValues.indexOf(item.userId) === -1 ? false : true}
                                        style={{ width: "13px", height: "13px", padding: 0, margin: 0, verticalAlign: "bottom", position: "relative", top: "-1px", overflow: "hidden" }} />
                                    &nbsp; {item.name}
                                </td>
                            </tr>
                            :
                            <tr key={`${item.userId}_${i}`}>
                                <td>
                                    <input type="checkbox" name={item.userId} id={`${item.userId}_${i + 1}`} className="unchecked" value={item.userId} onChange={onCheckChange}
                                        style={{ width: "13px", height: "13px", padding: 0, margin: 0, verticalAlign: "bottom", position: "relative", top: "-1px", overflow: "hidden" }} />
                                    &nbsp; {item.name}</td>
                            </tr>
                    )
                })
            }
        </tbody>
    }

    return (
        <Fragment>
            <table className="table">
                {tableBody()}
            </table>
        </Fragment>
    )
}

export default UserList;