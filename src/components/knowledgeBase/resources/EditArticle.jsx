import React, { useState, useEffect } from 'react';
import MultiSelect from "react-multi-select-component";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './page.css';
import axios from 'axios';
import { generateToken } from '../../../actions/commons/commonActions';
import { failureToast, successToast } from '../../../actions/commons/toaster';
import { useDispatch, useSelector } from "react-redux";
import { knowledgeBaseUrls } from '../../../util/apiManager';
import Loader from '../../resources/Loader';
import $ from 'jquery';

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

export default function EditArticle({ articleId, tagOptions, onEditClose, getArticles }) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [content, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const { userId } = useSelector(state => {
        return {
            userId: state.current_user.payload ? state.current_user.payload.userId : "",
        }
    })

    useEffect(() => {
        getArticlesById();
    }, [])

    const getArticlesById = async () => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        let payload = {
            articleId,
            apiToken,
            userId
        }
        setLoading(true);
        axios.post(knowledgeBaseUrls.getArticlesById, payload).then(res => {
            setLoading(false);
            if (res.data.status === 200) {
                const { title, tags = [], content } = res.data.data || {};
                setText(content);
                setTitle(title);
                let formattedTags = tags.map(x => ({
                    'value': x,
                    'label': x
                }));
                setSelectedTags(formattedTags);
                return;
            }
            const { message } = res.data;
            return failureToast(message);
        }).catch((err) => {
            setLoading(false);
        })
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const handleTagChange = (newValues) => {
        setSelectedTags(newValues);
    };

    const handleChange = (value) => {
        setText(value);
    }

    const editArticleSubmit = async () => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        let payload = {
            "articleId": articleId,
            "userId": userId,
            apiToken,
            "updateKeys": {
                "title": title,
                "content": content,
                "tags": selectedTags.map(x => x.value)
            }
        };
        setLoading(true);
        axios.put(knowledgeBaseUrls.editDeletePublishArticle, payload).then(res => {
            setLoading(false);
            if (res.data.status === 200) {
                onEditClose();
                $(".modal-backdrop").remove();
                $('body').removeClass('modal-open');
                getArticles();
                return successToast("Article Edited Successfully");
            }
            let message = res.data.message ? res.data.message : "Something went wrong! Please try again.";
            return failureToast(message);
        }).catch(ex => {
            setLoading(false);
            let message = ex.message ? ex.message : "Some error happened! Please try again.";
            return failureToast(message);
        });
    }


    return (
        <div className="modal" id="editArticleModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div class="modal-header">
                        <h4 className="modal-title add-article-title">Edit Article</h4>
                        <button type="button" class="close close-btn" data-dismiss="modal" onClick={() => onEditClose()}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            <div style={{ "margin": "10px" }}>
                                <label className="label-text-style" for="label">Title</label>
                                <input className="add-article-input"
                                    type="text"
                                    value={title}
                                    onChange={(e) => handleTitleChange(e)}></input>
                            </div>
                            <div style={{ "marginBottom": "15px", margin: "10px" }}>
                                <label className="label-text-style" for="label">Tags</label>
                                <MultiSelect className="add-article-select" style={{ "border": "0px" }}
                                    options={tagOptions}
                                    value={selectedTags}
                                    onChange={handleTagChange}
                                    labelledBy={"Enter Tags here"}
                                />
                            </div>
                            <div style={{ "margin": "10px" }}>
                                <label className="label-text-style" for="label">Article</label>
                                <ReactQuill
                                    theme={'snow'}
                                    value={content}
                                    onChange={handleChange}
                                    modules={modules}
                                    formats={formats}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer" style={{ "border": "none", "marginLeft": "31.5px", padding: '0px' }}>
                        <div className="row">
                            <button type="button" className="save-btnn" style={{ marginRight: '10px', padding: '4px 20px' }} onClick={editArticleSubmit}>Save</button>
                            <button type="button" className="btn btn-cancel cancel-btnt float-right" style={{ marginRight: '35px', border: '1px solid rgb(222, 225, 228)' }} data-dismiss="modal" onClick={() => onEditClose()}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

