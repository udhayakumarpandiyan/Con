import React, { useState } from 'react';
import { savePermission, updatePermission } from "../../../actions/admin/permissions";
import { generateToken } from "../../../actions/commons/commonActions";
import { failureToast, successToast, infoToast } from "../../../actions/commons/toaster";
import Loader from '../../resources/Loader';

export default function AddPermission({ permission = { _id: undefined }, dispatch, featureId, clientId, fetchPermissions, onCloseModal }) {
    const { _id } = permission || {};
    const [name, setName] = useState(permission.name || '');
    const [displayName, setDisplayName] = useState(permission.displayName || '');
    const [version, setVarsion] = useState(permission.version || '');
    const [status, setStatus] = useState(permission.status || '');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!name || !name.trim() || !displayName || !displayName.trim() || !version || !version.trim()) {
            return infoToast('Please add required fields!');
        }
        const fetchMethod = _id ? updatePermission : savePermission;
        const { generateToken: apiToken } = await dispatch(generateToken());
        const payload = {
            _id: _id ? _id : undefined, name, displayName, version, status: status ? status : undefined
        };
        setLoading(true);
        dispatch(fetchMethod(payload, { apiToken, featureId, clientId }))
            .then((res) => {
                setLoading(false);
                if (res && res.status === 200) {
                    onCloseModal();
                    successToast("Success!");
                    return fetchPermissions();
                }
                const message = typeof res.message === "string" ? res.message : "Something went wrong!";
                failureToast(message);
            }).catch(() => setLoading(false));
    }

    return (
        <>
            <Loader loading={loading} />
            <form>
                <div class="form-group">
                    <div class="row">
                        <div class="col-md-6">
                            <label><span className='text-danger'>*</span>Name</label>
                            <input type="text" value={name} onChange={({ target: { value } }) => setName(value)} />
                        </div>
                        <div class="col-md-6">
                            <label ><span className='text-danger'>*</span>Display Name</label>
                            <input type="text" value={displayName} onChange={({ target: { value } }) => setDisplayName(value)} />
                        </div>
                    </div>
                    <br />
                    <div class="row">
                        <div class="col-md-6">
                            <label><span className='text-danger'>*</span>Version</label>
                            <input type="text" value={version} onChange={({ target: { value } }) => setVarsion(value)} />
                        </div>
                        <div class="col-md-6">
                            {_id ?
                                (<div>
                                    <label htmlFor="status">Status</label>
                                    <select name="status" onChange={({ target: { value } }) => setStatus(value)} value={status} >
                                        <option value="active">Active</option>
                                        <option value="inactive">In-Active</option>
                                        <option value="deleted">Deleted</option>
                                    </select>
                                </div>) : ""}
                        </div>
                    </div>
                    <div className="mt-5">
                        <button className="save-btn-all" onClick={onSubmit}>Save</button>
                        <button className="cancel-btn" style={{ margin: '0px 0.9rem' }} onClick={() => onCloseModal()}>Cancel</button>
                    </div>
                </div>
            </form>
        </>
    )
}