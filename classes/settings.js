
let gameOptions = {
  gemSize: 100,
  fallSpeed: 100,
  destroySpeed: 200,
  boardOffset: {
    x: 100,
    y: 250
  },

  defaultTime: 15,

}
let gameMode = 'moves'
let bgColors = [
  0x000000,
  0x36454F,
  0x023020,
  0x28282B,
  0x353935,
  0x483248,
  0x51414F,
  0x253E28,
  0x17162F,
  0x340237,
]
let levelSettings
let defaultLevel = {
  items: 6,
  cols: 7,
  rows: 8,
  movesGoal: 20,
  allowWild: false, //make more
  wildStartCount: 4,
  allowGems: false, //make more
  gemsStartCount: 3,
  allowGolden: false, //make more
  goldenStartCount: 5,
  allowSquareBomb: false,
  allowFire: false, //just once
  fireStartCount: 5,
  allowIce: false, //just once
  iceStartCount: 4,
  allowBomb: false, //make more
  bombStartCount: 4,

  blocks: []
  //"blocks": [{ "row": 1, "col": 1 }, { "row": 1, "col": 3 }, { "row": 2, "col": 1 }, { "row": 2, "col": 3 }, { "row": 3, "col": 1 }, { "row": 3, "col": 3 }, { "row": 4, "col": 1 }, { "row": 4, "col": 3 }]

}

//win: { green: 10, ice: 5 },
let wildValue = 24
let goldenValue = 25
let gemValues = [6, 7, 8, 9, 10, 11]
let squareBombValues = [12, 13, 14, 15, 16, 17]
let fireValue = 26;
let iceValues = [18, 19, 20];
let bombValues = [21, 22, 23];
let blockValue = 27
let tally;
let roverSelected = [];
let backs = ['back_00', 'back_01', 'back_02', 'back_03', 'back_04', 'back_05', 'back_06', 'back_07', 'back_07', 'back_08', 'back_09', 'back_10', 'back_11', 'back_12', 'back_13', 'back_14', 'back_15', 'back_16']


let gameData;
var defaultValues = {
  mostDotsMoves: 0,
  mostDotsTime: 0,
  levelStatus: [0, -1],

  onGroup: 0,
  onLevel: 0
}
