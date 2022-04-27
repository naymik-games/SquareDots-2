let onLevel = 0
let onGroup = 0
let groups = [
  { numLevels: 12, startNum: 0, title: 'Practice' },
  /*  { numLevels: 12, startNum: 12, title: 'Practice 2' },
   { numLevels: 12, startNum: 24, title: 'Circle Drop' },
   { numLevels: 12, startNum: 36, title: 'Ice Break' },
   { numLevels: 12, startNum: 48, title: 'Wild Time' } */
];
let levels = [
  {
    title: 'Test', rows: 8, cols: 7, items: 4, movesGoal: 20, background: 0x00cc29,
    allowWild: false,
    wildStartCount: 5,
    allowGems: false, gemsStartCount: 4,
    allowGolden: false, goldenStartCount: 4,
    allowSquareBomb: false, squareBombStartCount: 3,
    allowFire: false, fireStartCount: 4,
    allowIce: false, iceStartCount: 10,
    allowBomb: true, bombStartCount: 4,
    allowRover: true, roverStartCount: 3,
    win: { orange: 10, red: 15, square: 6, blue: 9, rover: 3 },
    blocks: []
  },
  {
    title: 'Test', rows: 6, cols: 6, items: 4, movesGoal: 13, background: 0x00cc29,
    allowWild: false,
    wildStartCount: 0,
    allowGems: false, gemsStartCount: 4,
    allowGolden: false, goldenStartCount: 4,
    allowSquareBomb: false, squareBombStartCount: 0,
    allowFire: false, fireStartCount: 4,
    allowIce: true, iceStartCount: 6,
    allowBomb: false, bombStartCount: 4,
    win: { orange: 10, red: 15, ice: 6 },
    blocks: []
  },
  { title: "test wild", rows: 8, cols: 7, items: 5, background: 0xfafafa, allowWild: true, wildStartCount: 3, allowGolden: false, goldenStartCount: 0, allowGems: false, gemsStartCount: 0, movesGoal: 20, allowIce: false, iceStartCount: 0, allowFire: false, fireStartCount: 0, allowBomb: false, bombStartCount: 0, allowSquareBomb: false, squareBombStartCount: 0, win: { "red": "15", "blue": "15", "orange": "15", "green": "15" }, blocks: [] },
  { title: "test circle", rows: 8, cols: 7, items: 5, background: 0xfafafa, allowWild: false, wildStartCount: 3, allowGolden: true, goldenStartCount: 3, allowGems: false, gemsStartCount: 0, movesGoal: 20, allowIce: false, iceStartCount: 0, allowFire: false, fireStartCount: 0, allowBomb: false, bombStartCount: 0, allowSquareBomb: false, squareBombStartCount: 0, win: { "red": "15", "blue": "15", "orange": "15", "green": "15", "golden": "2" }, blocks: [] },
  { title: "test squareBomb", rows: 8, cols: 7, items: 5, background: 0xfafafa, allowWild: false, wildStartCount: 0, allowGolden: false, goldenStartCount: 0, allowGems: false, gemsStartCount: 0, movesGoal: 20, allowIce: false, iceStartCount: 0, allowFire: false, fireStartCount: 0, allowBomb: false, bombStartCount: 0, allowSquareBomb: false, squareBombStartCount: 0, win: { "red": "15", "blue": "15", "orange": "15", "green": "15", "squareBomb": "2" }, blocks: [] },
  { title: "test ice", rows: 8, cols: 7, items: 5, background: 0xfafafa, allowWild: false, wildStartCount: 0, allowGolden: false, goldenStartCount: 0, allowGems: false, gemsStartCount: 0, movesGoal: 20, allowIce: true, iceStartCount: 4, allowFire: false, fireStartCount: 0, allowBomb: false, bombStartCount: 0, allowSquareBomb: false, squareBombStartCount: 0, win: { "red": "15", "blue": "15", "orange": "15", "green": "15", "ice": "5" }, blocks: [] },
  { title: "test fire", rows: 8, cols: 7, items: 5, background: 0xfafafa, allowWild: false, wildStartCount: 0, allowGolden: false, goldenStartCount: 0, allowGems: false, gemsStartCount: 0, movesGoal: 20, allowIce: false, iceStartCount: 0, allowFire: true, fireStartCount: 4, allowBomb: false, bombStartCount: 0, allowSquareBomb: false, squareBombStartCount: 0, win: { "red": "15", "blue": "15", "orange": "15", "green": "15" }, blocks: [] },
  { title: "test bomb", rows: 8, cols: 7, items: 5, background: 0xfafafa, allowWild: false, wildStartCount: 0, allowGolden: false, goldenStartCount: 0, allowGems: false, gemsStartCount: 0, movesGoal: 20, allowIce: false, iceStartCount: 0, allowFire: false, fireStartCount: 0, allowBomb: true, bombStartCount: 4, allowSquareBomb: false, squareBombStartCount: 0, win: { "red": "15", "blue": "15", "orange": "15", "green": "15", "bomb": "3" }, blocks: [] },
  { title: "test gems", rows: 8, cols: 7, items: 5, background: 0xfafafa, allowWild: false, wildStartCount: 0, allowGolden: false, goldenStartCount: 0, allowGems: true, gemsStartCount: 2, movesGoal: 20, allowIce: false, iceStartCount: 0, allowFire: false, fireStartCount: 0, allowBomb: false, bombStartCount: 0, allowSquareBomb: false, squareBombStartCount: 0, win: { "red": "15", "blue": "15", "orange": "15", "green": "15", "gem": "3" }, blocks: [] },
  { title: "blocks", rows: 8, cols: 4, items: 4, background: 0x940080, allowWild: false, wildStartCount: 0, allowGolden: false, goldenStartCount: 0, allowGems: false, gemsStartCount: 0, movesGoal: 20, allowIce: false, iceStartCount: 0, allowFire: false, fireStartCount: 0, allowBomb: false, bombStartCount: 0, allowSquareBomb: false, squareBombStartCount: 0, win: { "orange": "20" }, "allowBlocks": true, "blocks": [{ "row": 2, "col": 2 }, { "row": 2, "col": 3 }, { "row": 3, "col": 2 }, { "row": 3, "col": 3 }, { "row": 4, "col": 2 }, { "row": 4, "col": 3 }, { "row": 5, "col": 2 }, { "row": 5, "col": 3 }] },
  { title: "test gems", rows: 8, cols: 7, items: 5, background: 0xfafafa, allowWild: false, wildStartCount: 0, allowGolden: false, goldenStartCount: 0, allowGems: true, gemsStartCount: 2, movesGoal: 20, allowIce: false, iceStartCount: 0, allowFire: false, fireStartCount: 0, allowBomb: false, bombStartCount: 0, allowSquareBomb: false, squareBombStartCount: 0, win: { "red": "15", "blue": "15", "orange": "15", "green": "15", "gem": "3" }, blocks: [] },
  { title: "test gems", rows: 8, cols: 7, items: 5, background: 0xfafafa, allowWild: false, wildStartCount: 0, allowGolden: false, goldenStartCount: 0, allowGems: true, gemsStartCount: 2, movesGoal: 20, allowIce: false, iceStartCount: 0, allowFire: false, fireStartCount: 0, allowBomb: false, bombStartCount: 0, allowSquareBomb: false, squareBombStartCount: 0, win: { "red": "15", "blue": "15", "orange": "15", "green": "15", "gem": "3" }, blocks: [] },
]






