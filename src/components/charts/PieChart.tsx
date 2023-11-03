import { Chart } from "react-chartjs-2";
import "chart.js/auto";

interface IPieChart {
    chartData: any;
    options: any;
}

function PieChart(props: IPieChart) {
    return <Chart type="pie" data={props.chartData} options={props.options} />;
}

export default PieChart;
