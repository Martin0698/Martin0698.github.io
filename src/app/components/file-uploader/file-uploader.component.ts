import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {

  @Input() mode: any;

  files: File[] = [];
  files2: File[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(event: any, mode: any) {
    if (mode == 1) {
      console.log(mode, this.files);
      this.files.push(...event.addedFiles);
    } else {
      console.log(mode, this.files2);
      this.files2.push(...event.addedFiles);
    }
  }

  parseBase64(base64: string) {
    return base64.split(/;base64,/)[1];
  }

  onRemove(event: any, mode: any) {
    if (mode == 1) {
      console.log(mode, this.files);
      this.files.splice(this.files.indexOf(event), 1);
    } else {
      console.log(mode, this.files2);
      this.files2.splice(this.files2.indexOf(event), 1);
    }
  }

}
