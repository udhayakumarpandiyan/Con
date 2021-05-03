import React from 'react';

function Widgets(props) {
    const { history = () => { }, items } = props;
    return (
        <div className='flex-wrap'>
            {
                items.map(tile => <div className="res-widgets">
                    <div className="card-body">
                        <div className="text-center">
                            <img src={tile.icon ? tile.icon : null} style={{ width: tile.width ? tile.width : '' }} ></img>
                        </div>
                        <p id={tile.modalId ? tile.modalId : null} className="card-text text-center" onClick={() => tile.path && history.push(tile.path)}>
                            <button type="button" className="btn btn-link" style={{
                                fontSize: "18px", whiteSpace: "normal"
                            }}>{tile.display}</button>
                        </p>
                    </div>
                </div>)
            }
        </div>
    )
}

export default Widgets;