import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-log-uploader',
  templateUrl: './log-uploader.component.html',
  styleUrls: ['./log-uploader.component.css']
})
export class LogUploaderComponent implements OnInit {
  @ViewChild('logInput') logInput: ElementRef;

  constructor() {}

  ngOnInit() {}

  onLogChange(event) {
    console.log(event.target.files[0]);
  }
}
