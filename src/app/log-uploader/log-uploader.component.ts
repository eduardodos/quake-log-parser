import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LineToLineMappedSource } from 'webpack-sources';

@Component({
  selector: 'app-log-uploader',
  templateUrl: './log-uploader.component.html',
  styleUrls: ['./log-uploader.component.css']
})
export class LogUploaderComponent implements OnInit {
  @ViewChild('logInput') logInput: ElementRef;
  lines: string[];

  constructor() {}

  ngOnInit() {}

  onLogChange(event) {
    const reader = new FileReader();

    reader.readAsText(event.target.files[0]);

    reader.onload = () => this.logResolver(reader.result);
  }

  logResolver(log) {
    this.lines = log.split(/[0-9]?[0-9]?[0-9]:[0-9][0-9]/);
    let gameNumber = 0;
    let currentGame = [];

    this.lines.forEach(line => {
      if (line.includes('InitGame:')) {
        if (gameNumber > 0) {
          this.createGame(gameNumber, currentGame);
        }
        gameNumber++;
        currentGame = [];
      }

      currentGame.push(line);
    });

    // Cria o último jogo que o loop não pega
    this.createGame(gameNumber, currentGame);
  }

  createGame(gameNumber: number, game: string[]) {
    console.log(`GameNumber: ${gameNumber}`);
    console.log('----');
    console.log(game);
  }
}
