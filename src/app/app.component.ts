import { Component } from "@angular/core";
import * as io from "socket.io-client";
import { ChartType, ChartOptions } from 'chart.js';
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
  public pieChartOptions: ChartOptions = { responsive: true };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public chartColors: Array<any> = [{backgroundColor: []}]

  public pollQuestion: string;
  public voteValueSelected: number = -1;

  socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io.connect();
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.listen2Events();
  }

  listen2Events() {
    this.socket.on("voteUpdate", poll => {
      this.pieChartData = []
      for (let i = 0; i < poll.options.length; i++) {
        this.pieChartData.push(poll.options[i]['count'])
      }
    });

    this.socket.on("initVoteUpdate", poll => {
      this.pollQuestion = poll.question
      this.pieChartLabels = []
      this.pieChartData = []
      for (let i = 0; i < poll.options.length; i++) {
        this.pieChartLabels.push(poll.options[i].text)
        this.pieChartData.push(poll.options[i].count)
        this.chartColors[0].backgroundColor.push(poll.options[i].colour)
      }
    });
  }

  sendVote() {
    this.socket.emit("newVote", this.voteValueSelected);
  }

  


  
}