import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { generateToken } from '../../actions/commons/commonActions';
import Loader from '../resources/Loader';
import { failureToast, successToast, infoToast } from "../../actions/commons/toaster";
import { fetchRegionAWS } from '../../actions/hostInventory/awsHostInventoryMain'
import { fetchRegionAzure } from "../../actions/hostInventory/azureHostInventoryMain";


export default function NewServiceRequestForm({ onSubmitIPRequest, loading }) {

  const CLOUD_PLATFORM = ['AWS', 'AZURE'];

  const tableRow = { "vmType": "", "vmName": "", "osName": "" };
  const dispatch = useDispatch();

  const [cloudType, setCloudType] = useState('');
  const [region, setRegion] = useState('');
  const [description, setDescription] = useState('');
  const [serverDetails, setServerDetails] = useState([tableRow]);

  const { userId, clientId, featureId, createdBy, emailId, getRegionAWS, getRegionAzure } = useSelector(state => {
    return {
      userId: state.current_user.payload ? state.current_user.payload.userId : "",
      clientId: state.current_client.payload ? state.current_client?.payload?.client : "",
      featureId: state.clientUserFeatures?.featureIds?.RequestForm,
      createdBy: state.current_user.payload.userName,
      emailId: state.current_user.payload.email,
      getRegionAWS: state.getRegionAWS,
      getRegionAzure: state.getRegionAzure
    }
  })

  useEffect(async () => {
    const { generateToken: apiToken } = await dispatch(generateToken());
    if (!Array.isArray(getRegionAWS) || !getRegionAWS.length) {
      dispatch(fetchRegionAWS(userId, apiToken));
    }
    if (!Array.isArray(getRegionAzure) || !getRegionAzure.length) {
      dispatch(fetchRegionAzure(userId, apiToken));
    }
  }, [])


  const addRow = () => {
    const newFlow = [...serverDetails, tableRow];
    setServerDetails(newFlow);
  }

  const deleteRow = (index) => {
    const updatedData = index === 0 ? [...serverDetails.slice(index + 1)] : [...serverDetails.slice(0, index), ...serverDetails.slice(index + 1)];
    setServerDetails(updatedData);
  }

  const setUserData = ({ target: { name, value } }, index) => {
    let object = serverDetails[index];
    let modifiedObj = { ...object, [name]: value };
    const updatedData = index === 0 ? [modifiedObj, ...serverDetails.slice(index + 1)] : [...serverDetails.slice(0, index), modifiedObj, ...serverDetails.slice(index + 1)];
    setServerDetails(updatedData);
  }

  let regionsData = [], VMTypes = [];
  if (CLOUD_PLATFORM.indexOf(cloudType) === 0) {
    regionsData = getRegionAWS;
    VMTypes = ['t2.nano', 't2.micro', 't2.small', 't2.medium', 't2.large'];
  }

  if (CLOUD_PLATFORM.indexOf(cloudType) === 1) {
    regionsData = getRegionAzure;
    VMTypes = ['B', 'Dsv3', 'Dv3', 'Dasv4', 'Dav4', 'DSv2', 'Dv2', 'Av2', 'DC', 'DCv2', 'Dv4', 'Dsv4', 'Ddv4', 'Ddsv4'];
  }

  const onSubmit = async () => {
    const payload = { userId, clientId, featureId, createdBy, emailId, description, region, serverDetails, cloudType, requestBy: userId };
    const { generateToken: apiToken } = await dispatch(generateToken());
    payload['apiToken'] = apiToken;
    onSubmitIPRequest(payload, onReset);
  }

  const onReset = () => {
    setCloudType('');
    setRegion('');
    setDescription('');
    setServerDetails([tableRow]);
  }
  return (
    <>
      <div class="modal" id="IPRequestFormModal" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title new-service-request-title">Infrastructure Provisioning Request</h4>
              <button type="button" class="close close-btn" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <text class="text-label ipr-label-style"><span className='text-danger' >*</span>Cloud Platform</text>
                  </div>
                  <div class="col">
                    <text class="text-label ipr-label-style"><span className='text-danger' >*</span>Region</text>
                  </div>
                </div>
              </div>
              <Loader loading={loading} />
              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <select value={cloudType} onChange={({ target: { value } }) => {
                      setCloudType(value);
                      setRegion('');
                      setServerDetails([tableRow]);
                    }}>
                      <option value=''>Select Cloud</option>
                      {
                        CLOUD_PLATFORM.map(cloud => <option name='cloud' value={cloud}>{cloud}</option>)
                      }
                    </select>
                  </div>
                  <div class="col">
                    <select name='region' value={region} onChange={({ target: { value } }) => setRegion(value)} >
                      <option value={''}>Select Region</option>
                      {
                        Array.isArray(regionsData) &&
                        regionsData.map((data) =>
                          <option value={data.region} key={data.region}>{data.region}</option>)
                      }
                    </select>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label class="ipr-header-label-style " for="name">Virtual Machine Details </label>
              </div>
              <div class="">
                <div class="tableFixHead overflow-auto" style={{ margin: "10px 0px" }}>
                  <table class="table table-hover my-table">
                    <thead>
                      <tr>
                        <th ><span className='text-danger' >*</span>VM Type</th>
                        <th ><span className='text-danger' >*</span>VM Name</th>
                        <th><span className='text-danger' >*</span>Operating System</th>
                        <th> </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        Array.isArray(serverDetails) && serverDetails.map((item, index) =>
                          <tr key={index}>
                            <td>
                              <select name='vmType' value={item['vmType']} onChange={(e) => setUserData(e, index)}>
                                <option value=''>Select </option>
                                {
                                  Array.isArray(VMTypes) && VMTypes.map(item =>
                                    <option value={item}>{item}</option>)
                                }
                              </select>
                            </td>
                            <td><input name='vmName' value={item['vmName']} onChange={(e) => setUserData(e, index)} /></td>
                            <td>
                              <select name='osName' value={item['osName']} onChange={(e) => setUserData(e, index)}>
                                <option value=''>Select </option>
                                <option value={'Ubuntu'}>Ubuntu</option>
                                <option value='RHEL'>RHEL</option>
                                <option value='Windows'>Windows</option>
                              </select>
                            </td>
                            <td>
                              <button className='save-btn-all' onClick={addRow}>Add</button>
                              <a active="true" className="btn-sm btn" onClick={() => deleteRow(index)}><i className="fa fa-trash"></i></a>
                            </td>
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="form-group">
                <label class="text-label ipr-label-style" value={description}><span className='text-danger' >*</span>Description</label>
                <textarea class="form-control" rows="3" name='description' onChange={({ target: { value } }) => setDescription(value)}></textarea>
              </div>
            </div>
            <div class="modal-footer" style={{ border: "none" }}>
              <button type="button" class="btn btn-outline-primary save-btn" onClick={onSubmit}>Submit</button>
              <button type="button" class="btn btn-cancel mr-auto cancel-btn" data-dismiss="modal" onClick={onReset}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}