import React, { PureComponent } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

class LineGraph extends PureComponent {

    renderLegend = () => {
        const { data, multiple } = this.props;

        if (!multiple) {
            return
        }
        return (
            <ul>
                {
                    Array.isArray(data) && data.map((entry, index) => (
                        <li key={`item-${index}`} style={{ display: "inline" }}>uv</li>
                    ))
                }
            </ul>
        );
    }

    render() {
        const { data, multiple, x_datakey, dataKey, height } = this.props;
        let dataArray = Array.isArray(data) && data.length ? data : [];
        let subscribedTools = dataArray.length ? Object.keys(dataArray[0]) : [];
        const colors = ['#82ca9d', '#D91E27', '#21A6A6', '#CC2970', '#4BC6B9', '#593CAB', '#F1C21B', '#F08943'];
        const singleLine = multiple ?
            <ResponsiveContainer width="100%" height={height || '100%'} aspect={height ? '' : 4.0 / 3.0}>
                <LineChart data={dataArray}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey={x_datakey} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={x_datakey} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {
                        subscribedTools.map((tool, index) => !tool.toLocaleLowerCase().includes('date') &&
                            <Line type="monotone" dataKey={tool} stackId="a" stroke={colors[index]} />
                        )
                    }
                </LineChart>
            </ResponsiveContainer> :
            <ResponsiveContainer width="100%" height={height || '100%'}>
                <LineChart data={dataArray}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    {/* <CartesianGrid strokeDasharray="0" axisLine={false} tickLine={false} horizontal={true} vertical={true} /> */}
                    <XAxis dataKey={x_datakey} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={x_datakey} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line dataKey={dataKey} stackId="a" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>

        return (
            <>
                {singleLine}
            </>

        );
    }
}

export default LineGraph;