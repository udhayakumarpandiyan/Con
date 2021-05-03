

import React from "react";
import PropTypes from "prop-types";

const defaultButton = props => <button {...props}>{props.children}</button>;

const ArrowLeftIcon = <>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
    </svg>
</>;

const ArrowRight = <>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
    </svg>
</>;

export default class Pagination extends React.Component {
    constructor(props) {
        super();
        this.changePage = this.changePage.bind(this);
        this.state = {
            visiblePages: this.getVisiblePages(null, props.pages)
        };
    }

    static propTypes = {
        pages: PropTypes.number,  // total pages
        activePage: PropTypes.number,
        PageButtonComponent: PropTypes.any, // this component only
        onPageChange: PropTypes.func,
    };



    filterPages = (visiblePages, totalPages) => {
        return visiblePages.filter(page => page <= totalPages);
    };

    getVisiblePages = (page, total) => {
        if (total < 3) {
            return this.filterPages([1, 2], total);
        } else {
            if (page === total) {
                return [page - 1, page];
            } else if (page % 2 >= 0 && page > 1 && page + 1 <= total) {
                return [page, page + 1];
            } else {
                return [1, 2];
            }
        }
    };

    changePage(page) {
        const activePage = this.props.activePage;
        if (page === activePage) {
            return;
        }
        const visiblePages = this.getVisiblePages(page, this.props.pages);
        this.setState({
            visiblePages: this.filterPages(visiblePages, this.props.pages)
        });
        this.props.onPageChange(page);
    }

    render() {
        const { PageButtonComponent = defaultButton } = this.props;
        const { visiblePages } = this.state;
        const activePage = this.props.activePage;

        return (
            <div className="Table__pagination">
                {
                    activePage !== 1 &&
                    <div className="Table__prevPageWrapper">
                        <PageButtonComponent
                            className="Table__pageButton"
                            onClick={() => {
                                if (activePage === 1) return;
                                this.changePage(activePage - 1);
                            }}
                            disabled={activePage === 1}
                        >
                            <a >{ArrowLeftIcon}</a>
                        </PageButtonComponent>
                    </div>
                }
                <div className="Table__visiblePagesWrapper">
                    {visiblePages.map((page, index, array) => {
                        return (
                            <PageButtonComponent
                                key={page}
                                className={
                                    activePage === page
                                        ? "Table__pageButton Table__pageButton--active"
                                        : "Table__pageButton"
                                }
                                onClick={this.changePage.bind(null, page)}
                            >
                                {array[index - 1] + 2 < page ? `...${page}` : page}
                            </PageButtonComponent>
                        );
                    })}
                </div>
                {
                    activePage !== this.props.pages &&
                    <div className="Table__nextPageWrapper">
                        <PageButtonComponent
                            className="Table__pageButton"
                            onClick={() => {
                                if (activePage === this.props.pages) return;
                                this.changePage(activePage + 1);
                            }}
                            disabled={activePage === this.props.pages}
                        >
                            <a >{ArrowRight}</a>
                        </PageButtonComponent>
                    </div>
                }
            </div>
        );
    }
}
