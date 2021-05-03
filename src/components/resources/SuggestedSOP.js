import React, { Fragment } from 'react';
import { routesPath } from '../../constants/routesPath';
import './sop.css';


export default function SuggestedSOP(props) {
    const { suggestionArticlesTags, suggestionArticles } = props;

    return < div
        id="suggestion"
        className="modal suggestion"
        tabIndex="-1"
        role="dialog"
        data-backdrop="static" data-keyboard="false"
    >
        <div className="modal-dialog " role="document">
            <div className="modal-content">
                <div className="modal-header" style={{ borderBottom: "0" }}>
                    <h3>
                        Relevant Knowledge Article - Auto Suggestion
            </h3>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        &times;
                    </button>
                </div>
                <div className="title-below-modal-title" style={{ marginTop: "20px", marginLeft: "20px" }}>
                    <div className="float-left ml-1">
                        {Array.isArray(suggestionArticles) &&
                            suggestionArticles.length
                            ? suggestionArticles[0].title
                            : "Header"}
                    </div>
                    <div className="float-right mr-5">
                        Author:
              {Array.isArray(suggestionArticles) &&
                            suggestionArticles.length
                            ? ` ${suggestionArticles[0].author}`
                            : ""}
                    </div>
                </div>
                <div className="modal-body">
                    {Array.isArray(suggestionArticlesTags) && suggestionArticlesTags.length > 0 && (
                        <Fragment>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-8 col-sm-8">
                                        {suggestionArticles.map((value, i) => {
                                            return (
                                                <div
                                                    style={{
                                                        background: "white",
                                                        margin: "0px -15px",
                                                        position: "relative",
                                                        top: "-13px",
                                                        right: "12px",
                                                    }}
                                                    key={i}
                                                >
                                                    <p style={{ borderBottom: "1px groove" }}>
                                                        <a
                                                            className="pl-4 font-weight-bold"
                                                            style={{
                                                                color: "#484848",
                                                                fontSize: "12px",
                                                            }}
                                                            rel="noopener noreferrer"
                                                            href={`${window.origin}${routesPath.knowledgeBasePage}/${value.articleId}`}
                                                            target="_blank"
                                                        >
                                                            {value.title}
                                                        </a>
                                                    </p>
                                                    <p
                                                        className="ml-2 p-3 mb-2"
                                                        dangerouslySetInnerHTML={{
                                                            __html: value.content,
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div
                                        className="col-md-4 col-sm-4"
                                        style={{
                                            background: "white",
                                            margin: "-13px -15px 21px 14px",
                                            position: "relative",
                                        }}
                                    >
                                        <p
                                            className="font-weight-bold"
                                            style={{ color: "#484848" }}
                                        >
                                            Last Updated:
                      </p>
                                        {suggestionArticles.map((value, i) => {
                                            return <p key={i}>{value.publishedDate}</p>;
                                        })}
                                        <p
                                            className="font-weight-bold"
                                            style={{
                                                color: "#484848",
                                                marginTop: "100px",
                                                position:
                                                    suggestionArticles.length > 1
                                                        ? "absolute"
                                                        : "static",
                                                bottom:
                                                    suggestionArticles.length > 1
                                                        ? "200px"
                                                        : "",
                                            }}
                                        >
                                            Tags
                      </p>
                                        <div
                                            className="flex-container"
                                            style={{
                                                position:
                                                    suggestionArticles.length > 1
                                                        ? "absolute"
                                                        : "static",
                                                bottom:
                                                    suggestionArticles.length > 1
                                                        ? "0"
                                                        : "",
                                                flexDirection: 'column'
                                            }}
                                        >
                                            {Array.isArray(suggestionArticlesTags) && suggestionArticlesTags.map(
                                                (data, i) => {
                                                    return (
                                                        <div key={i} className='sop-tags'>
                                                            {data}
                                                            <i className="fa fa-times-circle float-right mt-1"></i>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p
                                className="font-weight-bold pl-2"
                                style={{ color: "#484848" }}
                            >
                                References:
                </p>
                            <div className="ml-2">
                                <a href="#" style={{ display: "block" }}></a>
                            </div>
                        </Fragment>
                    )}
                    {(!Array.isArray(suggestionArticlesTags) || suggestionArticlesTags.length === 0) && (
                        <Fragment>No article is available</Fragment>
                    )}
                </div>
            </div>
        </div>
    </div >
    {/* suggestion modal end */ }
}