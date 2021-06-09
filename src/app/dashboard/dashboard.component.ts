import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  ApexFill,
  ApexLegend
} from "ng-apexcharts";
import { MatDialog } from '@angular/material/dialog';
import { AddFileComponent } from '../components/add-file/add-file.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HelpComponent } from '../components/help/help.component';
import { LoginService } from '../services/login/login.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  fill: ApexFill;
  legend: ApexLegend;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  chartOptions: any = {
    chart: {
      id: "Log_Chart_1",
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      selection: {
        enabled: true,
        type: 'x',
        fill: {
          color: '#24292e',
          opacity: 0.1
        },
        stroke: {
          width: 1,
          dashArray: 3,
          color: '#24292e',
          opacity: 0.4
        },
      },
      toolbar: {
        show: true,
        tools: {
          download: '<img src="assets/static/icons/download.png" class="ico-download" width="20">',
          selection: false,
          zoom: true,
          // '<img src="assets/static/icons/crop_canvas.png" class="ico-download" width="20">'
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: '<img src="assets/static/icons/reset.png" class="ico-download" width="20">',
        },
        export: {
          svg: {
            filename: "Log_Chart",
          },
          png: {
            filename: "Log_Chart",
          }
        },
        autoSelected: 'zoom' 
      },
      height: 820,
      width: 1900,
      type: "rangeBar"
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "80%"
      }
    },
    colors: [
      "#00E396",
      "#008FFB",
      "#E2C044",
      "#F46036",
      "#546E7A",
      "#FEB019",
      "#FF4560",
      "#775DD0",
      "#3F51B5",
      "#546E7A",
    ],
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
        datetimeFormatter: {
          day: 'dd MMM',
          hour: 'HH:mm:ss.fff tt'
        }
      },
    },
    yaxis: {
      show: true,
      tickAmount: 6,
      labels: {
          show: true,
          align: 'right',
          maxWidth: 500,
          style: {
            fontSize: '16px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-yaxis-label',
          },
          offsetX: 10,
      },
      tooltip: {
        enabled: true,
        offsetX: 0,
      },
      axisBorder: {
        show: true,
        color: '#78909C',
        offsetX: 0,
        offsetY: 0
      },
      axisTicks: {
          show: true,
          borderType: 'solid',
          color: '#78909C',
          width: 6,
          offsetX: 0,
          offsetY: 0
      },
    },
    legend: {
      fontSize: '16px',
      fontFamily: 'Helvetica, Arial',
      fontWeight: 400,
      position: "top",
      horizontalAlign: "center",
      onItemClick: {
        toggleDataSeries: true
      },
      onItemHover: {
        highlightDataSeries: true
      },
    },
    dataLabels: {
      enabled: true
    },
    series: [],
    labels: [],
    states: {
      normal: {
          filter: {
              type: 'none',
              value: 0,
          }
      },
      hover: {
          filter: {
              type: 'lighten',
              value: 0.15,
          }
      },
      active: {
          allowMultipleDataPointsSelection: false,
          filter: {
              type: 'darken',
              value: 0.35,
          }
      },
    },
    title: {
      text: 'Results table',
      align: 'left',
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize:  '18px',
        fontWeight:  'bold',
        fontFamily:  undefined,
        color:  '#263238'
    },
    },
    noData: {
      text: 'Loading...'
    },
    tooltip: {
      enabled: true,
      enabledOnSeries: undefined,
      shared: true,
      followCursor: false,
      intersect: false,
      inverseOrder: false,
      custom: undefined,
      fillSeriesColor: false,
      theme: false,
      style: {
        fontSize: '12px',
        fontFamily: undefined
      },
      onDatasetHover: {
          highlightDataSeries: false,
      },
      x: {
          show: true,
          format: 'dd MMM',
          formatter: undefined,
      },
      marker: {
        show: true,
      },
  }
  };

  configFile: boolean = false;
  logFile: boolean = false;

  configList: any[] = [];

  userName: any;
  team: any;
  email: any;

  dataTest: any[] = [];

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private auth: LoginService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params.email) {
        this.email = params.email;
        if(params.series) {
          this.chartOptions.series = JSON.parse(params.series);
          this.logFile = true;
        }
      }
    //   if(params.series) {
    //     // this.configList = JSON.parse(params.configList); params.configList
    //     this.chartOptions.series = JSON.parse(params.series);
    //     // this.configFile = true;
    //     this.logFile = true;
    //   }
    });
  }

  ngAfterViewInit() {
    // this.getUserInfo();
  }

  getUserInfo() {
    console.log(this.email);
    this.auth.getUserData(this.email).pipe(takeUntil(this.destroy$)).subscribe(res => {
      console.log(res);
      this.userName = res.user;
      this.auth.getTeams().pipe(takeUntil(this.destroy$)).subscribe(team => {
        this.team = team.find((e: any) => e.id == res.team).tname
      });
    });
  }

  ngOnInit() {
    this.getUserInfo();
  }

  addLogConfig(event: any) {
    var dialogRef;
    if (event == 1) {
      dialogRef = this.dialog.open(AddFileComponent, {
        width: '700px',
        height: '440px',
        data: {mode: 1, form: event}
      });
    } else {
      dialogRef = this.dialog.open(AddFileComponent, {
        width: '900px',
        height: '900px',
        data: {mode: 1, form: event}
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        // this.configFile = true;
        // this.configList = result.data[0];
        this.chartOptions.series = result.data;
        this.logFile = true;
        let navigationExtras: NavigationExtras = {
          queryParams: {
            email: this.email,
            // configList: JSON.stringify(this.configList),
            series: JSON.stringify(this.chartOptions.series)
          }
        };
        this.router.navigate(['home'], navigationExtras);
      }
    });
  }

  helpOption() {
    const dialogRef = this.dialog.open(HelpComponent, {
      width: '900px',
      height: '900px',
    });
  }

  singOut() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

}