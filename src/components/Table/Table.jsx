
import React from 'react';
import PropTypes from 'prop-types';
import { withI18n } from '@lingui/react';
import { withRouter } from 'react-router-dom';

import {
    Table as PFTable,
    TableHeader,
    SortByDirection,
    TableBody,
} from '@patternfly/react-table';
import Pagination from '../Pagination';
import {
    encodeNonDefaultQueryString,
    parseQueryString,
    replaceParams,
} from '../../util/qs';

import { QSConfig } from '../../types';

import styled from 'styled-components';
import { Button } from '@patternfly/react-core';

const Container = styled.div`
display: flex;
flex-direction: column;
position: relative;
`;
const TableContainer = styled.div`
 background: transparent;
 padding: 16px;
`;
const SelectableTable = styled(PFTable)`
& tbody{
    & tr{
        
         cursor: pointer;
        .pf-c-table__check{
            visibility: ${props => props.selectable ? 'visible' : 'hidden'};
            display: ${props => props.isFromConcierto ? 'none' : 'hidden'};
        }
        & td{
            padding-top: 0px;
            padding-bottom: 10px;
            & a{
                color:#1362A8;
                cursor: pointer;
            }
        }
    }
    & tr: hover{
        background: #E7DFFE;
    }
}
`;

const Controls = styled.div`
display: flex;
position: absolute;
top: -85px; 
right: 0px;
padding-top: 16px;
justify-content: flex-end;
`;


class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canSelectAll: true, rows: null, sortBy: null, pageSize: 20, totalPages: 0
        };
        this.onSelect = this.onSelect.bind(this);
        this.handleSetPage = this.handleSetPage.bind(this);
        this.handleSetPageSize = this.handleSetPageSize.bind(this);
        this.handleListItemSelect = this.handleListItemSelect.bind(this);
        this.onSort = this.onSort.bind(this);
    }
    handleListItemSelect = (id = 0) => {
        const { items, onRowClick } = this.props;
        const match = items.find(item => item.id === Number(id));
        onRowClick(match);
    };

    handleSetPage(event, pageNumber) {
        const { history, qsConfig } = this.props;
        const { search } = history.location;
        const oldParams = parseQueryString(qsConfig, search);
        this.pushHistoryState(replaceParams(oldParams, { page: pageNumber }));
    }

    handleSetPageSize(event, pageSize, page) {
        const { history, qsConfig } = this.props;
        const { search } = history.location;
        const oldParams = parseQueryString(qsConfig, search);
        this.pushHistoryState(
            replaceParams(oldParams, { page_size: pageSize, page })
        );
        this.setState({ pageSize });
    }
    pushHistoryState(params) {
        const { history, qsConfig } = this.props;
        const { pathname } = history.location;
        const encodedParams = encodeNonDefaultQueryString(qsConfig, params);
        history.push(encodedParams ? `${pathname}?${encodedParams}` : pathname);
    }

    onSelect(event, isSelected, rowId) {
        let rows;
        if (rowId === -1) {
            rows = this.props.rows.map(oneRow => {
                oneRow.selected = isSelected;
                return oneRow;
            });
            this.props.handleSelectAll(isSelected);
        } else {
            rows = [...this.props.rows];
            if (rows[rowId]) {
                rows[rowId].selected = isSelected;
            }
            this.props.handleSelect(rows[rowId], isSelected);
        }
        this.setState({
            rows
        });
    }

    onRowClick = (event, item) => {
        this.props.onRowClick(event, item);
    }

    onSort(_event, index, direction) {
        const tableRows = this.state.rows ? this.state.rows : this.props.rows;
        const sortedRows = tableRows.sort((a, b) => (a[index] < b[index] ? -1 : a[index] > b[index] ? 1 : 0));
        this.setState({
            sortBy: {
                index,
                direction
            },
            rows: direction === SortByDirection.asc ? sortedRows : sortedRows.reverse()
        });
    }


    render() {
        const { canSelectAll, selectable, showPageSizeOptions,
            itemCount, columns, controls, rows,
            qsConfig, isFromConcierto } = this.props;
        const { sortBy } = this.state;

        const queryParams = parseQueryString(qsConfig, this.props.location.search);

        return (
            <Container>
                <Controls>
                    {controls}
                </Controls>
                <TableContainer>
                    <SelectableTable
                        onSelect={this.onSelect}
                        selectable={selectable}
                        canSelectAll={isFromConcierto ? false : canSelectAll}
                        aria-label={isFromConcierto ? 'Simple Table' : "Selectable Table"}
                        cells={columns}
                        isFromConcierto={isFromConcierto}
                        rows={this.state.rows ? this.state.rows : rows}
                        sortBy={sortBy}
                        onSort={this.onSort}
                    >
                        <TableHeader />
                        <TableBody onRowClick={isFromConcierto ? () => { } : this.onRowClick} />
                    </SelectableTable>
                </TableContainer>
                {itemCount > 0 ? (
                    <Pagination
                        variant="bottom"
                        itemCount={itemCount}
                        page={queryParams.page || 1}
                        perPage={queryParams.page_size || 20}
                        perPageOptions={
                            showPageSizeOptions
                                ? [
                                    { title: '5', value: 5 },
                                    { title: '10', value: 10 },
                                    { title: '20', value: 20 },
                                    { title: '50', value: 50 },
                                ]
                                : []
                        }
                        onSetPage={this.handleSetPage}
                        onPerPageSelect={this.handleSetPageSize}
                    />
                ) : null}
            </Container>
        );
    }

}
const Item = PropTypes.shape({
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    name: PropTypes.string,
});


Table.propTypes = {
    showPageSizeOptions: PropTypes.bool,
    hasContentLoading: PropTypes.bool,
    contentError: PropTypes.shape(),
    onRowClick: PropTypes.func,
    columns: PropTypes.array,
    rows: PropTypes.array,
    location: PropTypes.object,
    items: PropTypes.arrayOf(Item).isRequired,
    itemCount: PropTypes.number,
    pluralizedItemName: PropTypes.string,
    qsConfig: QSConfig.isRequired,
    canSelectAll: PropTypes.bool,
    selectable: PropTypes.bool,
    handleSelectAll: PropTypes.func
};

Table.defaultProps = {
    items: null,
    hasContentLoading: false,
    contentError: null,
    showPageSizeOptions: true,
    onRowClick: () => null,
    handleSelectAll: () => null,
    columns: null,
    rows: null,
    location: null,
    items: [],
    itemCount: 0,
    canSelectAll: true,
    selectable: true

};


export default withI18n()(withRouter(Table));