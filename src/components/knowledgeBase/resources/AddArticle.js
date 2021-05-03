import React, { useState } from 'react';
import MultiSelect from "react-multi-select-component";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './page.css';

const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['link', 'image', 'video'],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
};

const formats = [
    'header', 'font', 'size',
    'link', 'image', 'attachment', 'video'
];

export default function AddArticle({ createArticle, tagOptions, article }) {
    const inputStyle = {
        "padding": "16px 14px 16px 9px",
        "fontSize": "14px",
        "lineHeight": "100%",
        "height": "1.7em",
        "width": "100%",
        "outline": "0",
        "margin": "0 0 15px",
        "backgroundColor": "rgb(241, 241, 241)"
    };


    const [title, setTitle] = useState(article ? article.title : '');
    const [selectedTags, setSelectedTags] = useState(article ? article.tags : []);
    const [text, setText] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const handleTagChange = (newValues) => {
        setSelectedTags(newValues);
    };

    const handleChange = (value) => {
        setText(value);
    }

    const onSave = () => {
        let article = { title, selectedTags, text };
        createArticle(article);
    }


    return (
        <div className="modal" id="AddArticleModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div class="modal-header">
                        <h4 className="modal-title add-article-title">{`Add New Article`} </h4>
                        <button type="button" class="close close-btn" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="container">

                            <div style={{ "margin": "10px" }}>
                                <label className="label-text-style" for="label">Enter Title here</label>
                                <input className="add-article-input"
                                    type="text"
                                    value={article ? article.title : title}
                                    onChange={(e) => handleTitleChange(e)}></input>
                            </div>
                            <div style={{ "marginBottom": "15px" , margin: "10px"}}>
                                <label className="label-text-style" for="label">Select Tags here</label>
                                <MultiSelect className="add-article-select" style={{ "border": "0px" }}
                                    options={article ? [...article.tags,tagOptions] :tagOptions}
                                    value={ selectedTags}
                                    onChange={handleTagChange}
                                    labelledBy={"Enter Tags here"}
                                />
                            </div>
                            <div style={{ "margin": "10px" }}>
                                <label className="label-text-style" for="label">Write your new article here</label>
                                <ReactQuill
                                    theme={'snow'}
                                    value={text}
                                    onChange={handleChange}
                                    modules={modules}
                                    formats={formats}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer" style={{"border": "none", "marginLeft":"31.5px" , padding : '0px' }}>
                    <div className = "row">
                        <button type="button" className="save-btnn" style = {{ marginRight : '10px' ,padding : '4px 20px'}} onClick={onSave}>Save</button>
                        <button type="button" className="btn btn-cancel cancel-btnt float-right" style= {{marginRight : '35px' ,  border: '1px solid rgb(222, 225, 228)'}} data-dismiss="modal">Cancel</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

