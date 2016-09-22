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
export default withRouter(Dashboard)
