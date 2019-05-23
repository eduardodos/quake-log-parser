# QuakeLogParser

Este projeto é um analisador de logs do jogo Quake 3 feito em Angular. Um arquivo de log é gerado pelo servidor do jogo, registrando o inicio, fim de jogo, as mortes, etc.

Este programa lê um arquivo .log e organiza os dados do mesmo em formato de JSON, mostrando o numero do jogo, total de kills, lista de players, quantas kills possue cada jogador e os meios de kill. O resultado do parse será algo assim:

```javascript
"game_3": {
    "total_kills": 4,
    "players": [
      "Dono da Bola",
      "Mocinha",
      "Isgalamido",
      "Zeh"
    ],
    "kills": {
      "Dono da Bola": -1,
      "Mocinha": 0,
      "Isgalamido": 1,
      "Zeh": -2
    },
    "means_of_death": {
      "MOD_ROCKET": 1,
      "MOD_TRIGGER_HURT": 2,
      "MOD_FALLING": 1
    }
  }
```

## Como executar

- git clone https://github.com/EduardoDos/quake-log-parser.git
- cd quake-log-parser
- npm install
- npm start
- Abra o navegador em: localhost:4200
