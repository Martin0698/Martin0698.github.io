import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddFilesService } from 'src/app/services/add-files/add-files.service';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.css']
})
export class AddFileComponent implements OnInit {

  files: File[] = [];
  show: boolean = false;
  files2: File[] = [];
  logfile: boolean = false;
  show2: boolean = false;
  loading: boolean = false;

  fileName = new FormControl('', [Validators.required]);
  resourceName = new FormControl('', [Validators.required]);
  status = new FormControl('');
  timeStart = new FormControl('', [Validators.required]);
  timeEnd = new FormControl('', [Validators.required]);
  range = new FormGroup({
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required])
  });
  searchLine = new FormControl('');

  typeConfig: number = 0;
  typelog: number = 0;

  destroy$: Subject<boolean> = new Subject<boolean>();

  params: any;

  constructor(
    public dialogRef: MatDialogRef<AddFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private addFile: AddFilesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {}

  onSelect(event: any, mode: any) {
    if (mode != 2) {
      this.files.push(...event.addedFiles);
      if (this.files.length > 0) {
        for (let i = 0; i < this.files.length; i++) {
          if (this.files[i].type == "application/json") {
            this.typeConfig = +1;
          }
          else {
            this.typelog = +1;
          }
        }
        if (this.typeConfig > 0  && this.typelog > 0 ) {
          this.show = true; 
        }
      }
    }
    else {
      this.files2.push(...event.addedFiles);
      if (this.files2.length > 0) {
        for (let i = 0; i < this.files2.length; i++) {
          if (this.files2[i].type == "application/json") {
            const dialogRef = this.dialog.open(AlertComponent, {
              width: '600px',
              height: '200px',
              data: {message: "Please do not add JSON Files!!"}
            });
          }
        }
      }
      if (this.files2.length > 0) {
        this.logfile = true; 
      }
    }
  }

  onRemove(event: any, mode: any) {
    if (mode != 2) {
      this.files.splice(this.files.indexOf(event), 1);
      if (event.type == "application/json") {
        this.typeConfig = -1;
      }
      else if (event.type == "") {
        this.typelog = -1;
      }
      if (this.typeConfig == 0  || this.typelog == 0 || this.files.length == 0) {
        this.show = false;
      }
    }
    else {
      this.files2.splice(this.files2.indexOf(event), 1);
      if (this.files2.length == 0) {
        this.logfile = false; 
      }
    }
  }

  addFiles(event: any) {
    this.loading = true;
    if (event == 1) {
      const files: FormData = new FormData();
      for (let i = 0; i < this.files.length; i++) {
        files.append('file', this.files[i]); 
      }
      this.addFile.addFile(files).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        let aux = res.result;
        if (aux.length > 0) {
          let result = [];
          let valuesAlreadySeen = [];
          for (let i = 0; i < aux.length; i++) {  
            let value = aux[i].name
            if (valuesAlreadySeen.indexOf(value) !== -1) {
              let l = valuesAlreadySeen.indexOf(value);
              aux[l].data.push(aux[i].data[0]);
              aux.splice(i, 1);
              i--;
            }
            valuesAlreadySeen.push(value);
            result = aux;
          }
          for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result[i].data.length; j++) {
              for (let k = 0; k < result[i].data[j].y.length; k++) {
                var parts = result[i].data[j].y[k].split(',');
                let date = new Date(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]).getTime();
                result[i].data[j].y[k] = date;
              }
            }
          }
          this.loading = false;
          this.dialogRef.close({ event: 'close', data: result});
        } else {
          const dialogRef = this.dialog.open(AlertComponent, {
            width: '600px',
            height: '200px',
            data: {message: "No data to show.", show: true}
          });
          dialogRef.afterClosed().subscribe(result => {
            this.loading = false;
          });
        }
      }, (error: any) => {
        console.log("error",error);
        const dialogRef = this.dialog.open(AlertComponent, {
          width: '600px',
          height: '200px',
          data: {message: "Error while uploading file."}
        });
        dialogRef.afterClosed().subscribe(result => {
          this.loading = false;
        });
      });
    } else {
      let config: any = {
        fileName: null,
        resourceName: null,
        status: null,
        timeStart: null,
        timeEnd: null,
        dateStart: null,
        dateEnd: null,
        searchLine: null,
      }
      if (!this.fileName.hasError('required') && !this.resourceName.hasError('required') && !this.timeStart.hasError('required')
        && !this.timeEnd.hasError('required') && !this.range.controls.start.hasError('required') && !this.range.controls.end.hasError('required')
      ) {
        config.fileName = [this.fileName.value];
        config.resourceName = this.resourceName.value;
        config.status = this.status.value ? [this.status.value] : "null";
        config.timeStart = this.timeStart.value ? this.timeStart.value : "null";
        config.timeEnd = this.timeEnd.value ? this.timeEnd.value : "null";
        config.dateStart = this.range.value.start ? this.range.value.start.toISOString().substring(0, 10) : "null";
        config.dateEnd = this.range.value.end ? this.range.value.end.toISOString().substring(0, 10) : "null";
        config.searchLine = this.searchLine.value ? [this.searchLine.value] : "null";
        const files2: FormData = new FormData();
        for (let i = 0; i < this.files2.length; i++) {
          files2.append('file', this.files2[i]);
        }
        files2.append('config', JSON.stringify(config));
        this.addFile.addFileManually(files2).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          let aux = res.result;
          if (aux.length > 0) {
            let result = [];
            let valuesAlreadySeen = [];
            for (let i = 0; i < aux.length; i++) {  
              let value = aux[i].name
              if (valuesAlreadySeen.indexOf(value) !== -1) {
                let l = valuesAlreadySeen.indexOf(value);
                aux[l].data.push(aux[i].data[0]);
                aux.splice(i, 1);
                i--;
              }
              valuesAlreadySeen.push(value);
              result = aux;
            }
            for (let i = 0; i < result.length; i++) {
              for (let j = 0; j < result[i].data.length; j++) {
                for (let k = 0; k < result[i].data[j].y.length; k++) {
                  var parts = result[i].data[j].y[k].split(',');
                  let date = new Date(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]).getTime();
                  result[i].data[j].y[k] = date;
                }
              }
            }
            this.loading = false;
            this.dialogRef.close({ event: 'close', data: result});
          } else {
            const dialogRef = this.dialog.open(AlertComponent, {
              width: '600px',
              height: '200px',
              data: {message: "No data to show.", show: true}
            });
            dialogRef.afterClosed().subscribe(result => {
              this.loading = false;
            });
          }
        }, (error: any) => {
          console.log("error",error);
          const dialogRef = this.dialog.open(AlertComponent, {
            width: '600px',
            height: '200px',
            data: {message: "Error while uploading file."}
          });
          dialogRef.afterClosed().subscribe(result => {
            this.loading = false;
          });
        });
      }
      else {
        const dialogRef = this.dialog.open(AlertComponent, {
          width: '600px',
          height: '200px',
          data: {message: "Please insert a file name, resource name, start hour, end hour, start date or end date!!"}
        });
        dialogRef.afterClosed().subscribe(result => {
          this.loading = false;
        });
      }
    }
  }

}
