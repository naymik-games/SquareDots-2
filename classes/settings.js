
let gameOptions = {
  gemSize: 100,
  fallSpeed: 100,
  destroySpeed: 200,
  boardOffset: {
    x: 100,
    y: 250
  },


}
let levelSettings;
let wildValue = 24
let goldenValue = 25
let gemValues = [6, 7, 8, 9, 10, 11]
let roverValues = [12, 13, 14, 15, 16, 17]
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
