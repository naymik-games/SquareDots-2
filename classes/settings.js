
let gameOptions = {
  gemSize: 100,
  fallSpeed: 100,
  destroySpeed: 200,
  boardOffset: {
    x: 100,
    y: 250
  },


}
gameOptions.gameMode = 'moves'

let levelSettings = {
  items: 4,
  cols: 8,
  rows: 10,
  movesGoal: 20,
  allowWild: false, //make more
  allowGems: false, //make more
  allowGolden: true, //make more
  allowRover: false,
  allowFire: false, //just once
  allowIce: false, //just once
  allowBomb: false, //make more
  blocks: []
  //"blocks": [{ "row": 1, "col": 1 }, { "row": 1, "col": 3 }, { "row": 2, "col": 1 }, { "row": 2, "col": 3 }, { "row": 3, "col": 1 }, { "row": 3, "col": 3 }, { "row": 4, "col": 1 }, { "row": 4, "col": 3 }]

}
let wildValue = 24
let goldenValue = 25
let gemValues = [6, 7, 8, 9, 10, 11]
let roverValues = [12, 13, 14, 15, 16, 17]
let fireValue = 26;
let iceValues = [18, 19, 20];
let bombValues = [21, 22, 23];
let blockValue = 27
let tally;

let gameSettings;
var defaultValues = {
  mostDotsMoves: 0,
  mostDotsTime: 0,
  levelStatus: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  totalSquares: 0,
  group: 0,
  currentLevel: 0
}
