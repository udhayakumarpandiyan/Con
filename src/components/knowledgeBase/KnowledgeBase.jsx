import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import axios from "axios";
import { knowledgeBaseUrls } from "./../../util/apiManager";

/* actions */
import { failureToast, successToast } from "../../actions/commons/toaster";
import { generateToken } from './../../actions/commons/commonActions';
import { setArticleStatus, setActivePage } from './../../actions/knowledgeBase/kbMain.js';
import ComponentHeader from "../resources/DashboardHeader";
import './resources/page.css';
import KnowledgeBaseList from './resources/KnowledgeBaseList';
import AddArticle from './resources/AddArticle';
import $ from "jquery";
import EditArticle from './resources/EditArticle';
/* CONSTANTS */
const DRAFT_KEY = 1;
const PUBLISH_KEY = 2;
const ARTICLE_COUNT_PER_PAGE = 30;
const DEFAULT_PAGE_NUMBER = 1;
const PAGE_RANGE_DISPLAYED = 5;

class KnowledgeBase extends Component {
    constructor(props) {
        super(props);

        let { articleStatus, lastAccessedPage } = this.props;
        this.state = {
            articles: [],
            isLoading: true,
            modal: false,
            currentStatus: articleStatus ? articleStatus : PUBLISH_KEY,
            totalArticleCount: 0,
            activePage: lastAccessedPage ? lastAccessedPage : DEFAULT_PAGE_NUMBER,
            itemsPerPage: 30,
            articleCountPerPage: ARTICLE_COUNT_PER_PAGE,
            articleStatusList: [
                { value: PUBLISH_KEY, label: 'Published' },
                { value: DRAFT_KEY, label: 'Draft' }
            ],
            tagOptions: [],
            selectedArticle: null,
            editArticleId: null,
            hasShowEdit: false
        };
        this.searchText = null;
        this.movedToDraft = this.movedToDraft.bind(this);
    }

    async componentDidMount() {
        await this.getArticlesWithSearchAndPagination(this.state.activePage);
    }

    getTags = async () => {
        let { failureToast, successToast, userId, generateToken } = this.props;
        const { generateToken: apiToken } = await generateToken();
        axios.get(`${knowledgeBaseUrls.getTags}?userId=${userId}&apiToken=${apiToken}`).then(res => {
            if (res.data.status === 200) {
                let tags = res.data.data;
                let formattedTags = tags.map(x => {
                    return {
                        'value': x.name,
                        'label': x.name
                    };
                });
                this.setState({ tagOptions: formattedTags, isLoading: false });
            } else {
                this.setState({ isLoading: false }, () => {
                    let message = res.data.message ? res.data.message : "Something went wrong! Please try again.";
                    return failureToast(message);
                })
            }

        }).catch(ex => {
            this.setState({ isLoading: false }, () => {
                let message = ex.message ? ex.message : "Some error happened! Please try again.";
                return failureToast(message);
            })
        })
    }

    getArticlesWithSearchAndPagination = async (pageNum = this.state.activePage, filter = { "status": this.state.currentStatus }) => {
        let { failureToast, generateToken, userId } = this.props;
        let { isLoading, modal } = this.state;

        if (!isLoading) {
            this.setState({ isLoading: true });
        }
        if (modal) {
            this.setState({ modal: false });
        }
        let token = await generateToken();
        let payload = {
            "pageNum": pageNum,
            "apiToken": token.generateToken,
            "userId": userId,
            "searchText": this.searchText ? this.searchText : undefined,
            "filter": filter
        }
        axios.post(knowledgeBaseUrls.getArticles, payload).then(res => {
            if (res.data.status === 200) {
                let { docs, totalArticleCount } = res.data.data;
                this.setState({ articles: docs, totalArticleCount, isLoading: false });
            } else {
                this.setState({ isLoading: false }, () => {
                    let message = res.data.message ? res.data.message : "Something went wrong! Please try again.";
                    return failureToast(message);
                })

            }
        }).catch(ex => {
            this.setState({ isLoading: false }, () => {
                let message = ex.message ? ex.message : "Some error happened! Please try again.";
                return failureToast(message);
            })

        })
    }
    createArticle = async (article) => {
        let { failureToast, successToast, payloadClientId, userId, generateToken } = this.props;
        let { title, isLoading, selectedTags, text } = article;

        if (!isLoading) {
            this.setState({ isLoading: true });
        }
        const { generateToken: apiToken } = await generateToken();
        let payload = {
            "title": title,
            "content": text,
            "clientId": payloadClientId,
            "userId": userId,
            "tags": selectedTags.map(x => x.value),
            apiToken
        };

        axios.post(knowledgeBaseUrls.createArticle, payload).then(res => {
            if (res.data.status === 200) {
                this.setState({ isLoading: false });
                $('#AddArticleModal').modal('hide');
                this.getArticlesWithSearchAndPagination(this.state.activePage);
                return successToast('Successfully Draft Article Created!');
            }
            else {
                this.setState({ isLoading: false }, () => {
                    let message = res.data.message ? res.data.message : "Something went wrong! Please try again.";
                    return failureToast(message);
                })

            }
        }).catch(ex => {
            this.setState({ isLoading: false }, () => {
                let message = ex.message ? ex.message : "Some error happened! Please try again.";
                return failureToast(message);
            })
        })
    }


    deleteAndPublishArticle = async (articleId, status) => {
        let { isLoading, activePage } = this.state;
        let { userId, failureToast, successToast, generateToken } = this.props;
        if (!isLoading) {
            this.setState({ isLoading: true });
        }
        const { generateToken: apiToken } = await generateToken();
        let payload = {
            "articleId": articleId,
            "userId": userId,
            apiToken,
            "updateKeys": {
                "status": status
            }
        };
        axios.put(knowledgeBaseUrls.editDeletePublishArticle, payload).then(res => {
            if (res.data.status === 200) {
                this.getArticlesWithSearchAndPagination(activePage);
                let message = status === 3 ? "Article Deleted Successfully!" : "Article Published Successfully!";
                return successToast(message);
            }
            else {
                this.setState({ isLoading: false }, () => {
                    let message = res.data.message ? res.data.message : "Something went wrong! Please try again.";
                    return failureToast(message);
                })
            }
        }).catch(ex => {
            this.setState({ isLoading: false }, () => {
                let message = ex.message ? ex.message : "Some error happened! Please try again.";
                return failureToast(message);
            })

        })
    }

    handlePageChange = async (e, pageNumber) => {
        let { setActivePage } = this.props;
        setActivePage(pageNumber);
        this.setState({ activePage: pageNumber });
        await this.getArticlesWithSearchAndPagination(pageNumber);
    }

    handleStatusChange = (e) => {
        this.setState({ currentStatus: Number(e.target.value) });
        this.filter(Number(e.target.value));
    }

    toggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    showAddPage = () => {
        this.props.showAddPage();
    }

    showEditPage = (articleId) => {
        this.getTags();
        this.setState({ hasShowEdit: true, editArticleId: articleId }, () => {
            $('#editArticleModal').modal('show');
        });
    }

    filter = (currentStatus) => {
        let { activePage } = this.state;
        let { setArticleStatus } = this.props;
        let filter = {
            "status": currentStatus
        };
        this.getArticlesWithSearchAndPagination(activePage, filter);
        setArticleStatus(currentStatus);
    }

    componentDidUpdate() {
        if (this.props.hasNewArticleAdded) {
            this.props.hasArticleAdded();
            // this.state.currentStatus ===  draft;
            if (Number(this.state.currentStatus) === DRAFT_KEY) {
                this.getArticlesWithSearchAndPagination(this.state.activePage)
            }
        }

    }

    onAddNewClick = () => {
        this.getTags();
        this.setState({ selectedArticle: null }, () => {
            $('#AddArticleModal').modal('show');
        });
    }

    async movedToDraft(articleId) {
        let { failureToast, successToast, userId, generateToken } = this.props;
        const { generateToken: apiToken } = await generateToken();
        let payload = {
            "articleId": articleId,
            "userId": userId,
            apiToken,
            "updateKeys": {
                status: 1
            }
        };
        try {
            axios.put(knowledgeBaseUrls.editDeletePublishArticle, payload)
                .then(res => {

                    if (res.data.status === 200) {
                        this.getArticlesWithSearchAndPagination(this.state.activePage);
                        return successToast("Article Moved Successfully");
                    }
                    let message = res.data.message ? res.data.message : "Something went wrong! Please try again.";
                    return failureToast(message);
                }).catch(ex => {

                    let message = ex.message ? ex.message : "Some error happened! Please try again.";
                    return failureToast(message);
                })
        } catch (ex) {

            let message = ex.message ? ex.message : "Some error happened! Please try again.";
            return failureToast(message);
        }
    }

    getSearchResults = (text) => {
        this.searchText = text;
        this.getArticlesWithSearchAndPagination(this.state.activePage);
    }

    getHeaderButtons = () => {
        const buttons = [

            { name: '+ Add New ', className: 'add-button', onClick: this.onAddNewClick }];

        return [{ name: 'Knowledge Base', className: "header-style" },
        {
            name:
                <div className="header-controls"
                    style={{ display: "flex", alignItems: "center" }}>

                    <select name="currentStatus" style={{ border: "1px solid #5C3EB0", color: "#5C3EB0", marginRight: "10px", width: "215px", height: "40px" }} value={this.state.currentStatus}
                        onChange={this.handleStatusChange}>
                        <option value={PUBLISH_KEY}>All Published Articles</option>
                        <option value={DRAFT_KEY}>All Draft Articles</option>
                    </select>
                    {
                        buttons.map((button, index) => <button key={index} onClick={button.onClick || null} {...button}>{button.name}</button>)
                    }
                </div>
        }];
    }

    onEditClose = () => {
        $('#editArticleModal').modal('hide');
        this.setState({ hasShowEdit: false, editArticleId: null });
    }

    render() {
        let { articles, itemsPerPage, totalArticleCount, activePage } = this.state;

        let noOfPages = Math.ceil(Number(totalArticleCount) / itemsPerPage);
        return (
            <>
                <ComponentHeader
                    dashboardText={this.getHeaderButtons()}
                    headerClass=""
                />
                <KnowledgeBaseList articles={this.state.searchResults ? this.state.searchResults : articles}
                    totalArticleCount={totalArticleCount}
                    activePage={activePage}
                    itemsPerPage={itemsPerPage}
                    noOfPages={noOfPages}
                    history={this.props.history}
                    movedToDraft={this.movedToDraft}
                    handlePageChange={this.handlePageChange}
                    getSearchResults={this.getSearchResults}
                    showEditPage={this.showEditPage}
                    deleteAndPublishArticle={this.deleteAndPublishArticle}
                />
                <AddArticle
                    tagOptions={this.state.tagOptions}
                    article={this.state.selectedArticle}
                    isEditArticle={this.state.selectedArticle ? true : false}
                    createArticle={this.createArticle}
                />
                {
                    this.state.hasShowEdit && <EditArticle
                        articleId={this.state.editArticleId}
                        tagOptions={this.state.tagOptions}
                        getArticles={this.getArticlesWithSearchAndPagination}
                        onEditClose={this.onEditClose}
                    />
                }
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        userId: state.current_user.payload.userId,
        payloadClientId: state.current_client ? state.current_client.payload.client : "",
        articleStatus: state.getArticleStatus.articleStatus,
        lastAccessedPage: state.getActivePage.activePage
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        successToast, failureToast, generateToken, setArticleStatus, setActivePage,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(KnowledgeBase);