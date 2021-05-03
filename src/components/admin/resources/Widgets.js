import React from 'react';
import "./adminWidgets.css";

export default function Widgets({ display, path, history, iconPath, svg = '', enableHooks, onChange = () => { }, checked, toolId, width }) {
    return (
        <div className="item" style={{/* , height: enableHooks ? '12.0625rem' : '90%' */ }}>
            <div className="card-body">
                {enableHooks ? <div className="pmm" style={{
                    float: 'right',
                    marginTop: '-1rem',
                    marginRight: '-1rem'
                }}>
                    <label className="switch">
                        <input type="checkbox" checked={checked} onChange={(e) => {
                            onChange(e, toolId);
                        }} />
                        <span className="slider round">
                        </span>
                    </label>
                </div> : null}
                <div className="text-center" style={{
                    marginTop: enableHooks ? '2rem' : ''
                }}>
                    <img src={iconPath ? require(`../../assets/adminWidgets/${iconPath}`) : svg} style={{ width: width ? width : '' }} ></img>
                </div>
                <p className="card-text" onClick={() => path && history.push(path)} style={{ textAlign: "center" }}>
                    <button type="button" className="btn btn-link" style={{
                        fontSize: "18px", whiteSpace: "normal"
                    }}>{display}</button>
                </p>
            </div>
        </div>
    )
}