import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import {Menu, MenuItem} from 'material-ui/Menu'
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import _ from 'lodash'
import verge from 'verge';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
const BarChart = require("react-chartjs").Bar;

const styles = {
  paper:{
  height: 500,
  width: 500,
  margin: 10,
  textAlign: 'center',
  display: 'inline-block',
  padding:5
  },
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 0,
  },
};

class Dashboard extends React.Component {
  constructor( props ){
        super( props );
    }
    componentWillMount(){

    } 
    render(){
      let tagChart = []
      if(this.props.dashboardData.tagList.length>0){
        let dataset = []
        let colorSet = ["#E91E63","#673AB7","#8BC34A","#EF9A9A"]

        let chartOptions = {
            title: {
               display: true,
               text: 'Emails in tags'
            },
            legend: {
            display: true,
            labels: {
                fontColor: 'rgb(255, 99, 132)'
            },
            position:'bottom'
            },
            multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>",
            scales: {
            xAxes: [{
                stacked: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Date'
                }
            }],
            yAxes: [{
                stacked: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Emails'
                }
            }]
        }
        }
        _.map(this.props.dashboardData.tagList, (tagg,key) => {
          dataset.push({
            label:tagg.tag_name,
            fillColor:colorSet[key],
            borderWidth: 2,
            data:tagg.countList
          })
        })
        let chartData = {
          labels: this.props.dashboardData.tagList[0].yLabel,
          datasets: dataset
        };
        tagChart.push(<Paper style={styles.paper} zDepth={3}>
          <div style={{'marginBottom':5}}>Automatic tag Email</div>
                <BarChart 
                type='bar'
                width={400}
                height={400}
                data={chartData} 
                options = {chartOptions}
                />
                </Paper>)
      }

      return(
               <div>
               {tagChart}
               </div>     
        )
    }
}
export default withRouter(Dashboard)

/*const styles = {
  paper:{
  height: 350,
  width: 350,
  margin: 10,
  textAlign: 'left',
  display: 'inline-block',
  padding:1
  },
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 0,
  },
};

const chartOptions = {
        scales: {
                xAxes: [{
                        stacked: true
                }],
                yAxes: [{
                        stacked: true
                }]
            }
        }
class Dashboard extends React.Component {
    constructor( props ){
        super( props );
        this.state = {
           slideIndex: 0,
        };
    }
    componentWillMount(){

    } 
    handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };
    render(){
        let tagChart = []
        if(this.props.dashboardData.tagList.length>0){
          let chart = []
          let xLabels = []
          let yesterdayData = []
          let lastSevenDayData = []
          _.map(this.props.dashboardData.tagList, (tagg,key) => {
            xLabels.push(tagg.tag_name)
            yesterdayData.push(tagg.yestCount)
            lastSevenDayData.push(tagg.lastSevendayCount)
          })
          let dataset = [
        {
            label: "My First dataset",
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            fillColor: ["rgba(0,10,220,0.5)","rgba(220,0,10,0.5)","rgba(220,0,0,0.5)","rgba(120,250,120,0.5)" ],
            strokeColor: "rgba(220,220,220,0.8)", 
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            borderWidth: 2,
            data:[]
        }
                ]

        dataset[0].data = yesterdayData
        let yesterdayChart = {
          labels:xLabels,
          datasets:dataset
        }
        chart.push(
            <div style={{'padding':5}}>
            <BarChart 
                  ylabel="emails"
                  width={270}
                  height={270}
                  marginTop={10}
                  marginBottom={5}
                  marginLeft={5}
                  type = 'bar' 
                  data={yesterdayChart} 
                  options={chartOptions} />
            </div>
            )

        dataset[0].data = lastSevenDayData
        let lastSevenDayChart = {
          labels:xLabels,
          datasets:dataset
        }
        chart.push(
            <div>
            <BarChart 
                  ylabel="emails"
                  width={270}
                  height={270}
                  marginTop={10}
                  marginBottom={5}
                  marginLeft={5}
                  type = 'bar' 
                  data={lastSevenDayChart} 
                  options={chartOptions}
                  colorByLabel={false}/>
            </div>
            )
          tagChart.push(
          <Paper style={styles.paper} zDepth={3}>
               <Tabs
                onChange={this.handleChange}
                value={this.state.slideIndex}
               >
               <Tab label="yesterday" value={0}  />
               <Tab label="Last 7 days" value={1}  />
               </Tabs>
               <SwipeableViews
                index={this.state.slideIndex}
                onChangeIndex={this.handleChange}
               >
              {chart}
               </SwipeableViews>
               </Paper>
          )
        }
        return(
               <div>
               {tagChart}
               
               </div>     
        )
    }
}
export default withRouter(Dashboard)*/
