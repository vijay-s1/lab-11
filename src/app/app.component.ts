import { Component } from "@angular/core";
import * as io from "socket.io-client";
import { ChartType, ChartOptions, ChartDataSets} from 'chart.js';
import 
{ SingleDataSet, 
  Label, 
  monkeyPatchChartJsLegend, 
  monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})

export class AppComponent {
  // Pie chart attributes
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  // Bar chart attributes
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];

  // All charts attributes
  public chartOptions: ChartOptions = { responsive: true };
  public chartLabels: Label[] = [];
  public chartData: SingleDataSet = [];
  public chartColors: Array<any> = [{backgroundColor: []}]

  // Poll data
  public pollQuestion: string;
  public voteValueSelected: number = -1;

  // Socket
  socket: SocketIOClient.Socket;

  constructor() {
    // Connect this client to server via socket.io
    this.socket = io.connect();
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.listen2Events();
  }

  // Listen to poll updates from server
  listen2Events() {
    // Only updates pie numerical data (labels and colours are set when "initVoteUpdate" is emitted from server)
    this.socket.on("voteUpdate", poll => {
      this.chartData = []
      for (let i = 0; i < poll.options.length; i++) {
        this.chartData.push(poll.options[i]['count'])
      }
    });

    // Initialises question, labels, data and colours for pie chart (only executed when client initially connects to server)
    this.socket.on("initVoteUpdate", poll => {
      this.pollQuestion = poll.question

      this.chartLabels = []
      this.chartData = []
      for (let i = 0; i < poll.options.length; i++) {
        this.chartLabels.push(poll.options[i].text)
        this.chartData.push(poll.options[i].count)

        this.chartColors[0].backgroundColor.push(poll.options[i].colour)
      }
    });
  }

  // Send the index of the selected voting option to server
  sendVote() {
    this.socket.emit("newVote", this.voteValueSelected);
  }

  


  
}