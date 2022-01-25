import React,{ useEffect, useState } from 'react';
import axios from 'axios';
import Boxes from './centered_grid';
import { useSelector } from "react-redux";
import { Line,Doughnut,Chart } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import TopCustomers from "../../components/dashboard-main/top-customers";
import ProductStocks from "../../components/dashboard-main/product-stocks";
import Deliveries from "../../components/dashboard-main/deliveries";
var originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
  draw: function() {
    originalDoughnutDraw.apply(this, arguments);
    
    var chart = this.chart;
    var width = chart.chart.width,
        height = chart.chart.height,
        ctx = chart.chart.ctx;

    var fontSize = (height / 200).toFixed(2);
    ctx.font = fontSize + "em sans-serif";
    ctx.textBaseline = "middle";

    var text = chart.config.data.text,
        textX = Math.round((width - ctx.measureText(text).width) / 2),
        textY = height / 2;

    ctx.fillText(text, textX, textY);
  }
});
//class App extends React.Component {
export default function PaymentPages() {
  const [dataLine, setdataLine] = useState({
    labels: '',
    datasets: [
      {
        label: "Last 7 Days",
        fill: true,
        lineTension: 0.3,
        backgroundColor: "rgba(184, 185, 210, .3)",
        borderColor: "rgb(35, 26, 136)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgb(35, 26, 136)",
        pointBackgroundColor: "rgb(255, 255, 255)",
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#ff0000",
        pointHoverBorderColor: "rgba(220, 220, 220, 1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: ''
      }
    ]
  });
  const [dataDoughnut] = useState({
    labels: ["Red", "Green"],
    text: "Current Balance",
    datasets: [
      {
        data: [300, 50],
        backgroundColor: ["#f71ea8", "#faf5f8"],
        borderWidth:"4px",
        circumference:"10",
        hoverBackgroundColor: [
          "#FF5A5E",
          "#f00295"
        ],
        //borderWidth: 5,
      }
    ]
  });
  const [Box_1, setBox_1] = useState('');
  const [Box_2, setBox_2] = useState('');
  const [Box_3, setBox_3] = useState('');
  const [Box_4, setBox_4] = useState('');
  const [totalAmount, settotalAmount] = useState('');
  const [pendingAmount, setpendingAmount] = useState('');
  const [successAmount, setsuccessAmount] = useState('');
  const [failedAmount, setfailedAmount] = useState('');
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if(userData === null) return;
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);
  const getData = async () => {
      
    await axios.get(`/mylapay/dashboard`)
    .then(res => {
      if(res.data.status === 1){
        let chart_date = res.data.data[0].chart_data.map((data)=> 
        {
          if(data.TransTime){
            return data.TransTime
          }
          else{
            return null;
          }
        })
        let chart_data = res.data.data[0].chart_data.map((data)=> 
        {
          if(data.amount_sum){
            return data.amount_sum
          }
          else{
            return null;
          }
        })
        let dataLines = {};
        dataLines = {...dataLine};
        dataLines.labels = chart_date;
        dataLines.datasets[0].data = chart_data;
        setBox_1(res.data.data[0].totalTxns);
        setBox_2(res.data.data[0].pendingTxns);
        setBox_3(res.data.data[0].successTxns);
        setBox_4(res.data.data[0].failedTxns);
        settotalAmount(res.data.data[0].totalAmount);
        setpendingAmount(res.data.data[0].pendingAmount);
        setsuccessAmount(res.data.data[0].successAmount);
        setfailedAmount(res.data.data[0].failedAmount);
        setdataLine(dataLines)
      }
      
    }).catch((err) => {
      console.log(err)
    })
  }
 
  let box_data = {
    Box_1 : Box_1,
    Box_2 : Box_2,
    Box_3 : Box_3,
    Box_4 : Box_4,
    totalAmount : totalAmount,
    pendingAmount : pendingAmount,
    failedAmount : failedAmount,
    successAmount : successAmount
  }
  return (
    <div style={{paddingLeft :'5px',paddingRight:'5px'}}>
      <div className="">
        <h2>Merchant Dashboard</h2>
        <Boxes Box_data = {box_data}/>
      </div>
      <div className="chart-outer">
        <div className="line_chart">
          <MDBContainer>
            <h3 className="mt-5">Revenue for 2021</h3>
            <Line data={dataLine} options={{ responsive: true,
              tooltips: {
                backgroundColor: "rgba(0,0,0,0.8)",
                bodyAlign: "right",
                bodyFontColor: "#fff",
                bodySpacing: 2,
                borderColor: "#4e56f2",
                borderWidth: 2,
                caretPadding: 2,
                caretSize: 5,
                cornerRadius: 6,
                custom: null,
                displayColors: true,
                enabled: true,
                footerAlign: "left",
                footerFontColor: "#fff",
                footerFontStyle: "bold",
                footerMarginTop: 10,
                footerSpacing: 2,
                intersect: false,
                mode: "nearest",
                multiKeyBackground: "#fff",
                position: "average",
                titleAlign: "right",
                titleFontColor: "#fff",
                titleFontStyle: "bold",
                titleMarginBottom: 6,
                titleSpacing: 2,
                xPadding: 6,
                yPadding: 6,
              },
              legend: {
                labels: {
                  usePointStyle: false,
                  boxWidth : 50
                }
            },
            scales: {xAxes: [
                {
                  ticks:{
                    beginAtZero : false
                  },
                  gridLines: {
                    color: '#fff',
                    borderDash: [1, 3],
                  },
                  display: true, // this will hide vertical lines
                },
              ],
            yAxes:[
              {
                ticks:{
                  beginAtZero : false
                }
              }
            ]}}} 
            />
          </MDBContainer>
        </div>
        <div className="doughnut_chart">
          <h3 className="mt-5">Current Balance</h3>
          <div className="current_balance">
            <Doughnut data={dataDoughnut} width={200} options={{ responsive: true,cutoutPercentage:85,
            maintainAspectRatio: true,tooltips:{
              callbacks:{
                label:()=>{
                  return "Test";
                }
              }
            } }}>
            </Doughnut>
          </div>
        </div>
        <div>
          <TopCustomers/>
        </div>
        <div>
          <ProductStocks/>
        </div>
        <div>
          <Deliveries/>
        </div>
      </div>
    </div>
  );
}