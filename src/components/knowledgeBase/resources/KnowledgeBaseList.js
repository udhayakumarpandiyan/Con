import React, { useState } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import './page.css';
// import SearchBox from '../../SearchBox';
const DRAFT_KEY = 1;
const PUBLISH_KEY = 2;
const DELETE_KEY = 3;

export default function KnowledgeBaseList({ articles, totalArticleCount, noOfPages,
    activePage, itemsPerPage,
    history, movedToDraft, handlePageChange, getSearchResults,
    showEditPage, deleteAndPublishArticle }) {

    const onViewDetails = (article) => {
        let url = `/knowledge-base/${article.articleId}`;
        history.push(url, article);
    }
    const [searchText, setSearchText] = useState('');

    const getTableColumns = () => {
        return [
            {
                tag: <span className="checkbox-all">
                    <div className="form-check form-check-inline" style={{ width: "50px" }}>
                        <input className="form-check-input" type="checkbox" id="checkAll" onClick={onSelectAll} />
                        <label htmlFor="checkAll" className="form-check-label th-text ticket-table-th-label"> S.no </label>
                    </div>
                </span>,
                className: 'aws-col-sn'
            },
            { tag: <span className="th-text">Title</span> },
            { tag: <span className="th-text">Lables</span> },
            { tag: <span className="th-text">Owner</span> },
            { tag: <span className="th-text">Published Date</span> },
            { tag: <span className="th-text">Status</span> },
            { tag: <span className="th-text">Action</span> },

        ];
    }
    const getTableBody = (articles) => {
        return articles.map((article, index) =>
            <tr key={article.articleId} onClick={(e) => onRowClick(article.articleId, e)}>
                <td>
                    <div className="form-check form-check-inline" style={{ width: "50px" }}>
                        <input className="form-check-input" type="checkbox" id={`${article.articleId}`} value={article.articleId} onClick={onCheckChange} />
                        <label className="form-check-label" htmlFor={`${article.articleId}`}>{index + 1}</label>
                    </div>
                </td>
                <td style={{ maxWidth: "200px" }}>
                    <span>{article.title} </span>
                </td>
                <td style={{ maxWidth: "100px" }}>
                    <span>{article.tags.map((tag, index) => {
                        return (index === article.tags.length - 1 ? tag : `${tag} ,`)
                    })
                    } </span>
                </td>
                <td>
                    <span>{article.ownerName} </span>
                </td>
                <td>
                    <span>{window.DateTimeParser(article.publishedDate)} </span>
                </td>
                <td>
                    <span>{article.status === DRAFT_KEY ? "Draft" : "Published"} </span>
                </td>
                <td>
                    <span title="View" style={{ cursor: "pointer" }} onClick={() => onViewDetails(article)}>
                        <i className="fa fa-eye" style={{ marginRight: "5px", color: "#484848" }} aria-hidden="true"></i>
                    </span>
                    {
                        article.status === DRAFT_KEY &&
                        <>
                            <span title="Edit" style={{ width: "23%", padding: "5%", marginRight: "2%", cursor: "pointer" }} onClick={() => showEditPage(article.articleId)}>
                                <i className="fa fa-pencil-square-o" style={{ color: "#484848" }} aria-hidden="true"></i>
                            </span>
                            <span title="Publish" style={{ width: "25%", padding: "5%", marginRight: "2%", cursor: "pointer" }} onClick={() => deleteAndPublishArticle(article.articleId, PUBLISH_KEY)}>
                                <i className="fa fa-file-archive-o" style={{ color: "#484848" }} aria-hidden="true"></i>
                            </span>
                            <span title="Delete" style={{ width: "25%", padding: "5%", marginRight: "2%", cursor: "pointer" }} onClick={() => deleteAndPublishArticle(article.articleId, DELETE_KEY)}>
                                <i className="fa fa-trash" style={{ color: "#484848" }} aria-hidden="true"></i>
                            </span>
                        </>
                    }
                    {
                        article.status === PUBLISH_KEY &&
                        <span title="Move To Draft" style={{ width: "25%", padding: "5%", marginRight: "2%", cursor: "pointer" }}
                            onClick={() => movedToDraft(article.articleId)}>
                            <i className="fa fa-rocket float-sm-cente" style={{ color: "#484848" }} aria-hidden="true"></i>
                        </span>
                    }
                </td>

            </tr>
        )
    }
    let values = [];
    const onCheckChange = async (e) => {
        const value = e.target.value;
        // if ($(`#${e.target.id}`).is(':checked')) {
        //     $(e.target).prop('checked', true);
        //     values.push(value)
        // } else {
        //     var i = values.indexOf(value);
        //     if (i != -1) values.splice(i, 1);
        //     $(e.target).prop('checked', false);
        // }
    }
    const onSelectAll = (e) => {
        const { checked } = e.target;
        updateAllCheckboxes(checked);
    }

    const updateAllCheckboxes = (checked) => {
        values = [];
        // let availableApprovedHosts = isSearchTxtBtnClicked === "yes" ? awsSearchHostData : state.availableApprovedHosts;
        // if (Array.isArray(availableApprovedHosts)) {
        //     var hostInventories = availableApprovedHosts.map(awsData => {
        //         $(`#${awsData.hostInventoryId}`).prop('checked', checked);
        //         return awsData.hostInventoryId;
        //     });
        //     values = checked ? hostInventories : [];
        // }
    }
    const onRowClick = (event) => {
    }
    const getSearchText = (text) => {
        if (text.length === 0) {
            getSearchResults(text);
        }
        setSearchText(text);
    }

    return (<>
        <div className="card" style={{ marginTop: '15px', marginLeft: '15px', marginRight: '7px', alignItems: 'flex-end' }}>

            <input type="text" style={{
                float: 'right',
                width: "240px", height: "40px",
                padding: "0px 6px",
                fontSize: "16px",
                margin: "10px", marginRight: "20px",
                border: '1px solid',
                borderRadius: "2px"

            }} placeholder="Search Articles"
                onChange={(e) => getSearchResults(e.target.value)} />
            <table className="table table-hover aws-table" style={{ backgroundColor: "#fff" }}>
                <thead>
                    <tr>
                        {
                            getTableColumns().map((column, index) => <th className={column.className} key={index}>{column.tag}</th>)
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        getTableBody(articles)
                    }
                </tbody>
            </table>
        </div>
        {
            totalArticleCount > itemsPerPage && <>
                <div className="text-center" style={{ marginTop: '1rem' }}>
                    <p>
                        Showing {1 + (itemsPerPage * (activePage - 1))}-{activePage * itemsPerPage}/{totalArticleCount}
                    </p>
                </div>
                <div className="pagination-center">
                    <Pagination count={noOfPages} page={activePage} onChange={handlePageChange} />
                </div>
            </>
        }
    </>
    )
}