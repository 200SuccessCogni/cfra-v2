import { Chart } from "react-chartjs-2";
import "chart.js/auto";

interface IChart {
    chartData: any;
    options: any;
}

function LineChart(props: IChart) {
    return <Chart type="line" data={props.chartData} options={props.options} />;
}

export default LineChart;
