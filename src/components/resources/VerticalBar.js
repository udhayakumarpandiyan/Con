import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import $ from "jquery";

// const data = [
//     { "AWS": 4, name: "AWS", fill: "#593CAB", interval: "" },
//     { "Azure": 6, name: "Azure", fill: "#2E9EE8", interval: "" },
//     { "DataDog": 1, name: "DataDog", fill: "#21A6A6", interval: "" },
//     { "Dynatrace": 1, name: "Dynatrace", fill: "#CC2970", interval: "" },
//     { "ZABBIX": 2, name: "ZABBIX", fill: "#D91E27", interval: "" }
// ];

const fill = ['#593CAB', '#2E9EE8', '#21A6A6', '#CC2970', '#F1C21B', '#F08943', '#593CAB', '#D91E27'];
class BarGraph extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    $('.recharts-label').addClass('graph-lable');
  }

  render() {
    const { Ylabel, Xlabel, Yposition, data } = this.props;
    const layout = this.props.layout || "horizontal";
    // const dataset = typeof data === "object" ? Object.keys(data) : [];
    const finalData = typeof data === "object" && Object.keys(data).reduce((arr, item) => {
      const obj = { name: item, [item]: data[item] };
      arr.push(obj);
      return arr;
    }, []);

    return (
      <ResponsiveContainer width='100%' aspect={4.0 / 3.0}>
        <BarChart data={finalData} layout="vertical">
          <XAxis type="number" hide />
          <YAxis dataKey="name" hide reversed type="category" />
          <Tooltip />
          <Legend />
          {
            Array.isArray(finalData) && finalData.map((item, index) =>
              <Bar key={item.name} barSize={35} dataKey={item.name} fill={fill[index]} />)
          }
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default BarGraph;