
let gameOptions = {
  gemSize: 100,
  fallSpeed: 100,
  destroySpeed: 200,
  items: 4,
  cols: 7,
  rows: 8,
  boardOffset: {
    x: 100,
    y: 250
  }
}
let wildValue = 24
let goldenValue = 25

let gameSettings;
var defaultValues = {
  mostDotsMoves: 0,
  mostDotsTime: 0,
  levelStatus: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  totalSquares: 0,
  group: 0,
  currentLevel: 0
}