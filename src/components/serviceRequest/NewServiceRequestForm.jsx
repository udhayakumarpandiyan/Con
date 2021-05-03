import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { masterApiUrls } from '../../util/apiManager';
import { generateToken } from '../../actions/commons/commonActions';
import { failureToast, successToast, infoToast } from "../../actions/commons/toaster";
import Loader from '../resources/Loader';
import { getSelectedClientUsers } from "../../actions/admin/groups";


export default function NewServiceRequestForm({ onSubmitServiceRequest }) {
  const dispatch = useDispatch();

  const [requestBy, setRequestBy] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priorityId, setPriority] = useState('');
  const [addAttachments, setAddAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  const { userId, clientId, featureId, createdBy, emailId, usersList, getAllMasterData: { priorityList } } = useSelector(state => {
    return {
      userId: state.current_user.payload ? state.current_user.payload.userId : "",
      clientId: state.current_client.payload ? state.current_client?.payload?.client : "",
      featureId: state.clientUserFeatures?.featureIds?.RequestForm,
      createdBy: state.current_user.payload.userName,
      emailId: state.current_user.payload.email,
      usersList: state.getSelectedClientUsers && Array.isArray(state.getSelectedClientUsers.mappedUsers) ? state.getSelectedClientUsers.mappedUsers : [],
      getAllMasterData: state?.getAllMasterData && Array.isArray(state.getAllMasterData) && state.getAllMasterData.length ? state.getAllMasterData[0] : {}
    }
  })

  useEffect(async () => {
    const { generateToken: apiToken } = await dispatch(generateToken());
    // send internalCall as 1, we are calling user module from admin module;
    dispatch(getSelectedClientUsers({ clientId, featureId, apiToken }, 1));
  }, [clientId])

  const onFileChange = async (e) => {
    e.preventDefault();
    const { files } = e.target;
    files && Object.values(files).forEach((file) => fileUpload(file));
  }

  const fileUpload = async (file) => {
    var formData = new FormData();
    formData.append('clientId', clientId);
    formData.append('userId', userId);
    formData.append('files', file);
    let headers = {
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
    };
    dispatch(generateToken()).then(res => {
      formData.append('apiToken', res.generateToken);
      setLoading(true);
      axios.post(masterApiUrls.uploadFile, formData, headers)
        .then((res) => {
          setLoading(false);
          const { status, message, data } = res.data
          if (status !== 200) {
            const text = typeof message === "string" ? message : "Something went wrong while uploading document!";
            return failureToast(text);
          }
          const { link, key } = data;
          setAddAttachments([...addAttachments, {
            "fileUrl": link,
            "fileName": file.name,
            key
          }]);
        }).catch((err) => {
          setLoading(false);
          typeof err.message === "string" ?
            failureToast(err.message) : failureToast("Something went wrong. Please try again!");
        });
    });
  }


  const removeAttachment = (index) => {
    if (Array.isArray(addAttachments)) {
      const newAttachements = index === 0 ? [...addAttachments.slice(index + 1)] : [...addAttachments.slice(0, index), ...addAttachments.slice(index + 1)];
      setAddAttachments(newAttachements);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let payload = { createdBy, subject, requestBy, userId, clientId, featureId, emailId, description, priorityId };
    dispatch(generateToken()).then(async (data) => {
      payload['apiToken'] = data.generateToken;
      payload['dueDate'] = new Date(dueDate) ? new Date(dueDate).toISOString() : '';
      payload['attachments'] = Array.isArray(addAttachments) && addAttachments.length ? addAttachments : undefined;
      await onSubmitServiceRequest(payload, setInitialState);
      setInitialState();
    });
  }

  const setInitialState = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      input => (input.value = "")
    );
    Array.from(document.querySelectorAll("select")).forEach(
      select => (select.value = "")
    );
    Array.from(document.querySelectorAll("textarea")).forEach(
      textarea => (textarea.value = "")
    );
    setRequestBy('');
    setSubject('');
    setAddAttachments([]);
    setDescription('');
    setPriority('');
    setDueDate('');
    setLoading(false);
  }

  return (
    <>
      <div class="modal" id="newServiceRequestFormModal" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
          <div class="modal-content new-service-request-custom">
            <div class="modal-header">
              <h4 class="modal-title new-service-request-title">Service Request</h4>
              <button type="button" class="close close-btn" data-dismiss="modal" onClick={setInitialState}>&times;</button>
            </div>
            <Loader loading={loading} />
            <div class="modal-body">
              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <text class="text-label new-service-request-label-style">Requested By</text>
                  </div>
                  <div class="col">
                    <text class="text-label new-service-request-label-style">Due Date</text>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <select name='requestBy' onChange={({ target: { value } }) => setRequestBy(value)}>
                      <option value={''}>Select User</option>
                      {
                        Array.isArray(usersList) && usersList.map((item) =>
                          <option key={item.userId} value={item.userId}>{item.name}</option>)
                      }
                    </select>
                  </div>
                  <div class="col">
                    <input class="text-label new-service-request-input " type="date" name="dueDate" onChange={({ target: { value } }) => setDueDate(value)} />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <text class="text-label new-service-request-label-style">Subject</text>
                  </div>
                  <div class="col">
                    <text class="text-label new-service-request-label-style">Priority</text>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <input class="new-service-request-input" type="text" name="subject" value={subject} onChange={({ target: { value } }) => setSubject(value)} />
                  </div>
                  <div class="col">
                    <select class="new-service-request-select" name='priorityId' onChange={({ target: { value } }) => setPriority(value)}>
                      <option class="new-service-request-option" value='' >Select Priority</option>
                      {
                        Array.isArray(priorityList) && priorityList.map(priorityOptions =>
                          <option key={priorityOptions.id} value={priorityOptions.id}> {priorityOptions.name} </option>)
                      }
                    </select>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label class="text-label new-service-request-label-style" for="sel1">Description</label>
                <textarea class="form-control" rows="3" name='description' onChange={({ target: { value } }) => setDescription(value)}></textarea>
              </div>
              <div class="form-group">
                <span> <label class="new-service-request-label-style" for="name">Upload Documents </label>
                  <input type="file" onChange={onFileChange} name="addAttachments" multiple style={{ direction: "ltr" }} />
                </span>
              </div>
              {
                Array.isArray(addAttachments) && addAttachments.map((attachment, index) => {
                  return <div key={index} style={{ width: "max-content", border: "1px solid #e8e5e5" }} >
                    <div style={{ margin: '.5rem' }}>
                      <span>{attachment.fileName}</span>
                      <span style={{ marginLeft: "20px", color: "#ff0000", cursor: 'pointer' }} onClick={(e) => {
                        e.preventDefault();
                        removeAttachment(index);
                      }}>X</span>
                    </div>
                  </div>
                })
              }

            </div>
            <div class="modal-footer" style={{ border: "none" }}>
              <button type="button" class="btn btn-outline-primary save-btn" onClick={handleSubmit}>Submit</button>
              <button type="button" class="btn btn-cancel mr-auto cancel-btn" data-dismiss="modal" onClick={setInitialState}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}