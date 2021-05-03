import React, { useState } from 'react';

export default function SearchBar(props) {
    const { onSearchSubmit, resetSearch,
        getSearchResults, onSidePanelClick } = props;

    const [searchtext, setSearchtext] = useState('');
    const [showClose, setShowClose] = useState(false);

    const onResetClick = (e) => {
        e.stopPropagation();
        setSearchtext('');
        setShowClose(false);
        setTimeout(() => { resetSearch() }, 500);
    }
    const onTextChange = (e) => {
        setSearchtext(e.target.value);
        getSearchResults(e.target.value);
    }

    const onSearchClick = () => {
        setShowClose(true);
        onSearchSubmit();

    }
    return (
        <>
            <div className="flex-content">
                <div className="left-sec">
                </div>
                <div className="right-sec flex-content">
                    <div className="search-sec search-wrapper" style={{ marginRight: '1.5rem', padding: '10px' }}>
                        <input type="text" className="search-input"
                            value={searchtext}
                            placeholder="Search"
                            onChange={onTextChange} />

                        <div className="search-icon" onClick={onSearchClick}>
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
                            <button style={{ display: showClose ? 'block' : 'none' }} class="close-icon" type="reset" onClick={onResetClick}></button>
                        </div>
                    </div>
                    <div className="filter" style={{ paddingTop: '10px' }}>
                        <button className="btn btn-link p-0" onClick={onSidePanelClick}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                fill="#5C3EB0"
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
        </>
    )
}