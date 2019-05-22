import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-log-uploader',
  templateUrl: './log-uploader.component.html',
  styleUrls: ['./log-uploader.component.css']
})
export class LogUploaderComponent implements OnInit {
  lines: string[];
  games = {};

  constructor() {}

  ngOnInit() {}

  onLogChange(event) {
    const reader = new FileReader();

    reader.readAsText(event.target.files[0]);

    reader.onload = () => this.logResolver(reader.result);
  }

  logResolver(log) {
    // transforma o arquivo de log em linhas
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

    for (const key in this.games) {
      this.games[key] = this.generateGameObject(this.games[key]);
    }

    console.log(this.games);
  }

  createGame(gameNumber: number, game: string[]) {
    this.games[`game_${gameNumber}`] = game;
  }

  generateGameObject(game) {
    let gameKills = game.filter(gameLine => gameLine.includes('Kill: '));
    let clientsUserInfo = game.filter(gameLine => gameLine.includes('ClientUserinfoChanged'));

    // pega a lista de players
    let players = clientsUserInfo.map(clientInfo => clientInfo.split('\\')[1]);
    // filtra em caso de nomes repetidos
    players = players.filter(this.onlyUnique);
    // retira da frase tudo aquilo qeu não é necessário para contabilizar as kills
    let gameKillLog = gameKills.map(gameKill =>
      gameKill.substring(gameKill.indexOf(':', 6) + 2, gameKill.indexOf('by') - 1)
    );

    // o primeiro item do array recebe a kill
    // caso o primeiro seja o <world> o segundo elemento perde uma kill
    gameKillLog = gameKillLog.map(log => log.split(' killed '));

    const kills = {};

    for (const key of players) {
      kills[key] = 0;
    }

    // console.log(gameKillLog);

    gameKillLog.forEach(log => {
      if (log[0] === '<world>') {
        kills[log[1]] -= 1;
      } else {
        kills[log[0]] += 1;
      }
    });

    // console.log(kills);

    const gameObject = {
      total_kills: gameKills.length,
      players,
      kills
    };

    // console.log(gameObject);

    return gameObject;
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
