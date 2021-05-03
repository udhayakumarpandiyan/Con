import React from 'react';
import Pagination from '@material-ui/lab/Pagination';

export default function Table(props) {
    const { totalItemsCount, onSearchSubmit, onSearchInput, onSidePanelClick, handlePageChange, activePage,
        searchPlaceHolder, TableColumns, tbody, itemsPerPage, searchEventId, resetSearch } = props;
    let noOfPages = Math.ceil(Number(totalItemsCount) / itemsPerPage);
    return (
        <>
            <div className="page">
                <div className="bg-wh" >
                    <div className="flex-content">
                        <div className="left-sec">
                        </div>
                        <div className="right-sec">
                            <div className="search-sec search-wrapper">
                                <input
                                    id='eventSearch'
                                    className="search-input"
                                    type="text"
                                    placeholder={searchPlaceHolder || "Event Id"}
                                    name="searchEventId"
                                    onChange={onSearchInput}
                                    value={searchEventId}
                                >
                                </input>

                                <div className="search-icon" onClick={onSearchSubmit} id='searchIcon'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-search"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                                        />
                                    </svg>
                                    <button style={{ display: searchEventId ? 'block' : 'none' }} class="close-icon" type="reset" onClick={resetSearch}></button>
                                </div>
                            </div>
                            <div className="filter">
                                <button className="btn btn-link p-0" onClick={onSidePanelClick}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-funnel-fill"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* table */}
                    <div className="mt-3">
                        <table className="table table-hover my-table">
                            <thead>
                                <tr>
                                    {
                                        Array.isArray(TableColumns) && TableColumns.map(column =>
                                            <th key={column.displayName} className={column.className}><span className="th-text">{column.displayName}</span></th>)
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {tbody}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* pagination */}
                {
                    totalItemsCount > itemsPerPage && <>
                        <div className="text-center" style={{ marginTop: '1rem' }}>
                            <p>
                                Showing {1 + (itemsPerPage * (activePage - 1))}-{(activePage !== noOfPages) ? (activePage * itemsPerPage) : totalItemsCount}/{totalItemsCount}
                            </p>
                        </div>
                        <div className="pagination-center">
                            <Pagination count={noOfPages} page={activePage} onChange={handlePageChange} />
                        </div>
                    </>
                }
            </div>
        </>
    )
}

