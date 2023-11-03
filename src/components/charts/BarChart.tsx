import { Chart } from "react-chartjs-2";
import "chart.js/auto";

interface IChart {
    chartData: any;
    options: any;
}

function BarChart(props: IChart) {
    return <Chart type="bar" data={props.chartData} options={props.options} />;
}

export default BarChart;
