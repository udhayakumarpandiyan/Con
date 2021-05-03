import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import $ from "jquery";

class BarGraph extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        $('.recharts-label').addClass('graph-lable');
    }

    render() {
        const { Ylabel, Xlabel, Yposition, verticalCartesianGrid, horizontalCartesianGrid, data, XDataKey, barDataKey, fill } = this.props;
        let keys = Array.isArray(data) && data.length ? Object.keys(data[0]) : [];
        let finalKeys = keys.filter(key => !key.toLocaleLowerCase().includes('date'));
        let barDataKeys = barDataKey ? barDataKey : finalKeys;
        const layout = this.props.layout || "horizontal";
        return (
            <ResponsiveContainer width={550} height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout={layout}>
                    <CartesianGrid
                        strokeDasharray="1 1"
                        axisLine={false}
                        vertical={verticalCartesianGrid}
                        horizontal={horizontalCartesianGrid}
                        height={500}
                    />
                    <XAxis dataKey={XDataKey} label={{ value: Xlabel, position: 'insideBottomRight', offset: -15 }} />
                    <YAxis label={{ value: Ylabel, angle: -90, position: Yposition }} tickCount={3} />
                    <Tooltip />
                    <Legend />
                    {
                        Array.isArray(barDataKeys) && barDataKeys.map((datakey, index) =>
                            <Bar barSize={15} key={index} dataKey={datakey} stackId="a" fill={Array.isArray(fill) && fill[index]} />
                        )
                    }
                </BarChart>
            </ResponsiveContainer>
        );
    }
}

BarGraph.defaultProps = {
    verticalCartesianGrid: true,
    horizontalCartesianGrid: true
}

export default BarGraph;