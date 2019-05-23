import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-uploader',
  templateUrl: './log-uploader.component.html',
  styleUrls: ['./log-uploader.component.css']
})
export class LogUploaderComponent implements OnInit {
  lines: string[];
  gamesLog = {};
  gamesJson: object;

  constructor() {}

  ngOnInit() {}

  onLogChange(event) {
    const reader = new FileReader();

    reader.readAsText(event.target.files[0]);

    reader.onload = () => this.logResolver(reader.result);
  }

  logResolver(log) {
    // transforma o arquivo de log em linhas para facilitar o trabalho
    this.lines = log.split(/[0-9]?[0-9]?[0-9]:[0-9][0-9]/);

    this.createGamesLog();

    this.createGamesObject();
  }

  createGamesObject(): void {
    this.gamesJson = {};

    for (const key in this.gamesLog) {
      this.gamesJson[key] = this.generateGameObject(this.gamesLog[key]);
    }
  }

  createGamesLog(): void {
    let gameNumber = 0;
    let currentGame = [];

    this.lines.forEach(line => {
      if (line.includes('InitGame:')) {
        if (gameNumber > 0) {
          this.gamesLog[`game_${gameNumber}`] = currentGame;
        }
        gameNumber++;
        currentGame = [];
      }

      currentGame.push(line);
    });

    // Cria o último jogo que o loop não pega
    this.gamesLog[`game_${gameNumber}`] = currentGame;
  }

  generateGameObject(game): object {
    let meanOfDeath = {};
    let gameKills = game.filter(gameLine => gameLine.includes('Kill: '));
    let clientsUserInfo = game.filter(gameLine =>
      gameLine.includes('ClientUserinfoChanged')
    );

    // pega a lista de players
    let players = clientsUserInfo.map(clientInfo => clientInfo.split('\\')[1]);

    // filtra em caso de nomes repetidos
    players = players.filter(this.onlyUnique);

    let meanOfDeathList = this.meanOfDeathListCreator(gameKills)
    meanOfDeathList.forEach(element => {
      meanOfDeath[element] = 0
    });

    // retira da frase tudo aquilo qeu não é necessário para contabilizar as kills
    let gameKillLog = gameKills.map(gameKill => {
      meanOfDeath[this.getMeanOfDeath(gameKill)] += 1;
      return gameKill.substring(
        gameKill.indexOf(':', 6) + 2,
        gameKill.indexOf('by') - 1
      )
    }
    );

    // transforma o array de string em um array de array, onde cara um tem duas string, o player que matou e na segunda o player que morreu
    gameKillLog = gameKillLog.map(log => log.split(' killed '));

    const kills = {};

    for (const key of players) {
      kills[key] = 0;
    }

    // o primeiro item do array recebe a kill
    // caso o primeiro seja o <world> o segundo elemento perde uma kill
    gameKillLog.forEach(log => {
      if (log[0] === '<world>') {
        kills[log[1]] -= 1;
      } else {
        kills[log[0]] += 1;
      }
    });

    const gameObject = {
      total_kills: gameKills.length,
      players,
      kills,
      means_of_death: meanOfDeath
    };

    return gameObject;
  }

  onlyUnique(value, index, self): boolean {
    return self.indexOf(value) === index;
  }

  meanOfDeathListCreator(kills) {
    kills = kills.map(element => this.getMeanOfDeath(element));
    return kills.filter(this.onlyUnique)
  }

  getMeanOfDeath(killLog): string {
    killLog = killLog.substring(killLog.indexOf('by ') + 3);
    return killLog.replace(/\r?\n|\r/, '').trim();
  }
}
