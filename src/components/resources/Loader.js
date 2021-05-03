import React from 'react';
import { Link as _Link } from 'react-router-dom';
// import './index.css';
import './css/loader.css';

const Loader = ({ loading }) => {
    if (loading) {
        return (
            <div className='loader' >
                <div className="cloud-spinner">
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                        width="75.000000pt" height="45.000000pt" viewBox="0 0 115.000000 72.000000"
                        preserveAspectRatio="xMidYMid meet">

                        <g transform="translate(0.000000,72.000000) scale(0.100000,-0.100000)" className="g1"
                            fill="#5c3eb0" stroke="none">
                            <path d="M532 670 c-23 -5 -65 -21 -92 -36 -47 -26 -98 -70 -89 -78 4 -4 323
-206 345 -219 6 -3 50 26 97 64 l87 71 -25 48 c-56 110 -197 175 -323 150z"/>
                        </g>
                        <g transform="translate(0.000000,72.000000) scale(0.100000,-0.100000)"
                            fill="#5c3eb0" stroke="none" className="g2">

                            <path d="M306 501 c-9 -16 -16 -37 -16 -46 0 -11 -10 -15 -35 -15 -74 0 -144
-46 -176 -115 -31 -67 -21 -136 30 -204 24 -32 27 -33 76 -28 54 6 187 48 248
78 l37 19 0 124 0 123 -47 30 c-27 16 -60 37 -75 47 -27 17 -27 17 -42 -13z"/>
                        </g>
                        <g transform="translate(0.000000,47.000000) scale(0.100000,-0.100000)"
                            fill="#5c3eb0" stroke="none" className="g3">
                            <path d="M800 124 c-93 -76 -206 -150 -310 -202 -72 -36 -229 -92 -256 -92
-11 0 -17 -4 -14 -10 8 -13 684 -13 739 0 22 5 51 17 65 28 28 21 71 79 71 96
0 6 -8 -2 -19 180z"/>
                        </g>
                    </svg>
                </div>
            </div>
        );
    }
    else {
        return '';
    }
}

Loader.defaultProps = {
    loading: false
}

export default Loader;

