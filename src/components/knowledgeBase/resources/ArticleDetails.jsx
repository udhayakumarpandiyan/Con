import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { generateToken } from '../../../actions/commons/commonActions';
import { failureToast, successToast, infoToast } from '../../../actions/commons/toaster';
import { useDispatch, useSelector } from "react-redux";
import { knowledgeBaseUrls } from '../../../util/apiManager';
import Loader from '../../resources/Loader';
import { NavLink } from 'react-router-dom';

export default function ArticleDetails(props) {
    // let article = props.location.state;
    const { match: { params: { id } } } = props;

    const [loading, setLoading] = useState(false);
    const [article, setArticle] = useState({});
    const dispatch = useDispatch();
    const { userId } = useSelector(state => {
        return {
            userId: state.current_user.payload ? state.current_user.payload.userId : "",
        }
    })

    useEffect(() => {
        getArticlesById();
    }, [id])

    const getArticlesById = async () => {
        const { generateToken: apiToken } = await dispatch(generateToken());
        let payload = {
            "articleId": id,
            apiToken,
            userId
        }
        setLoading(true);
        axios.post(knowledgeBaseUrls.getArticlesById, payload).then(res => {
            setLoading(false);
            if (res.data.status === 200) {
                return setArticle(res.data.data);
            }
            const { message } = res.data;
            return failureToast(message);
        }).catch((err) => {
            setLoading(false);
        })
    }

    const formatDateString = (dateString) => {
        if (dateString) {
            let date = new Date(dateString);
            let month = date.getMonth() + 1;
            month = month < 10 ? `0${month}` : month;
            return `${date.getDate()}/${month}/${date.getFullYear()}`;
        }
    }


    return (
        <div className="card" style={{ margin: "12px", background: "#FFFFFF" }}>
            <Loader loading={loading} />
            <div className='flex-content' style={{ flexDirection: 'row-reverse', margin: '10px' }}>
                <button type="button" style={{ border: '1px solid #b7b2b2', backgroundColor: '#fff' }}>
                    <NavLink style={{ padding: '5px 1rem', color:'#000' }} exact to="/knowledge-base">Back</NavLink>
                </button>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group" style={{ padding: "50px" }}>
                        <label className="label-style" for="date">Published Date:</label>
                        <input type="text" id="date" name="date" value={formatDateString(article?.publishedDate)} style={{ width: "100%" }} />
                    </div>
                </div>
                <div className="col">
                    <div className="form-group" style={{ padding: "50px" }}>
                        <label className="label-style" for="date">last Updated:</label>
                        <input type="text" id="date" name="date" value={formatDateString(article?.lastUpdated)} style={{ width: "100%" }} />
                    </div>
                </div>
                <div className="col">
                    <div className="form-group" style={{ padding: "50px" }}>
                        <label className="label-style" for="name">Owner:</label>
                        <input type="text" id="name" name="name" value={article?.ownerName} style={{ width: "100%" }} />
                    </div>
                </div>
                <div className="col">
                    <div className="form-group" style={{ padding: "50px" }}>
                        <label className="label-style" for="tags">Tags:</label>
                        <input type="text" id="tags" name="tags" value={article ? article.tags : ''} style={{ width: "100%" }} />
                    </div>
                </div>
            </div>
            <div className='row'>
                <div>
                    <div className="form-group" style={{ padding: "5px 50px" }}>
                        <h2>{article.title}</h2>
                    </div>
                </div>
                <div>
                    <div className="form-group" style={{ padding: "5px 50px" }} dangerouslySetInnerHTML={{ __html: article.content }} ></div>
                </div>
            </div>
        </div>
    )
}