import React, { useState } from 'react';
import Loader from '../../resources/Loader';

export default function AutomationTemplates({ templates, hasShowTemplates, updateAPI = () => { }, loading, existingTemplate = '' }) {

    const [selectedTemplate, setSelectedTemplate] = useState(existingTemplate);

    const onSave = (selectedTemplate) => {
        if (selectedTemplate) {
            updateAPI(selectedTemplate);
            setSelectedTemplate('');
        }
    }

    const onTemplateSelect = (template) => {
        setSelectedTemplate(template);
        onSave(template);
    }

    let selectTemplate = existingTemplate && !selectedTemplate ? Number(existingTemplate) : selectedTemplate;
    return (
        <div className="modal" id="AutomationTemplatesModal" data-backdrop="static" data-keyboard="false" >
            <div className="modal-dialog">
                <div className="modal-content custom">
                    <div className="modal-body">
                        <Loader loading={loading} />
                        <div className="container">
                            <div className="row">
                                <h4 className="modal-title title">Select Automation</h4>
                                <button type="button" className="close clos" data-dismiss="modal" style={{ marginRight: "30px" }}>&times;</button>
                            </div>
                        </div>
                        <div className="form-group" style={{ padding: "10px 30px" }}>
                            <div className="row">
                                <div className="col">
                                    Select automation template from below
                                </div>
                            </div>
                        </div>
                        {
                            hasShowTemplates &&
                            <div style={{
                                width: '93%', margin: "0px 30px", display: 'flex', flexDirection: 'column',
                                border: '1px solid #e0e0e0', borderBottom: 'none'
                            }}>
                                {Array.isArray(templates) ? templates.map((template, i) => {
                                    return (<div style={{
                                        width: '100%', display: 'flex', padding: '10px',
                                        flexDirection: 'row', justifyContent: 'space-between',
                                        borderBottom: '1px solid #e0e0e0', alignItems: 'center'
                                    }}><div style={{
                                        width: "100%", display: 'flex', flexDirection: 'column',
                                    }}>
                                            <label style={{ fontWeight: 600 }}>{template.name}</label>
                                            <label>{template.description}</label>
                                        </div>
                                        <button className="select-btn" style={{ background: (selectTemplate === template.id) ? '#8ecaca' : '' }} onClick={() => onTemplateSelect(template.id)}> <i className="fa fa-check" style={{ color: "#4BC6B9", padding: '0px 15px 0px 0px' }}> </i>Select </button>
                                    </div>)
                                }) : <div style={{ width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>No templates found</div>}
                            </div>
                        }
                        <div className="edit-details-footer" style={{ textAlign: 'center' }}>
                            <button type="button" className="btn btn-outline-primary save-btn" disabled={selectedTemplate === null} onClick={onSave}>Save</button>
                            <button type="button" className="btn btn-cancel mr-auto cancel-btn" data-dismiss="modal">Cancel</button>
                        </div>
                    </div >
                </div>
            </div>
        </div>
    )
}