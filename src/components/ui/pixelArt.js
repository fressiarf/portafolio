// Pixel-art original (dibujado para este proyecto). Sin JSX para poder validarlo con Node.

/** Convierte una cuadrícula de caracteres en rectángulos (runs horizontales del mismo carácter). */
export function gridToRects(rows, skip = '.') {
  const rects = []
  rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const ch = row[x]
      if (ch === skip) {
        x += 1
        continue
      }
      let w = 1
      while (row[x + w] === ch) w += 1
      rects.push({ x, y, w, ch })
      x += w
    }
  })
  return rects
}

/* ------------------------------------------------------------------ */
/* Iconos 12x12 ('#' = relleno)                                        */
/* ------------------------------------------------------------------ */
const E = '............'

export const ICONS = {
  about: [
    '....####....', '...######...', '...######...', '...######...', '....####....', E,
    '..########..', '.##########.', '.##########.', '.##########.', '.##########.', E,
  ],
  projects: [
    E, '.####.......', '.#####......', '.##########.', '.#........#.', '.#........#.',
    '.#........#.', '.#........#.', '.#........#.', '.##########.', E, E,
  ],
  stack: [
    E, '############', '############', '#..........#', '#.#........#', '#..#.......#',
    '#...#......#', '#..#.......#', '#.#..####..#', '#..........#', '############', E,
  ],
  design: [
    '..........##', '.........###', '........###.', '.......###..', '......###...', '.....###....',
    '....###.....', '...###......', '..###.......', '.##.........', '#...........', E,
  ],
  timeline: [
    '.###........', '.###.#######', '.###........', '..#.........', '.###........', '.###.#####..',
    '.###........', '..#.........', '.###........', '.###.#######', '.###........', E,
  ],
  contact: [
    E, '.##########.', '############', '##..#..#..##', '############', '.##########.',
    '..###.......', '..##........', '..#.........', E, E, E,
  ],
  github: [
    E, '.#........#.', '.##......##.', '.##########.', '############', '##..####..##',
    '##..####..##', '############', '.##########.', '..###..###..', '..##....##..', E,
  ],
  linkedin: [
    '.##########.', '############', '##.#########', '############', '##.#...#####', '##.#.##.####',
    '##.#.##.####', '##.#.##.####', '##.#.##.####', '############', '.##########.', E,
  ],
  email: [
    E, '############', '##........##', '#.#......#.#', '#..#....#..#', '#...####...#',
    '#..........#', '#..........#', '############', E, E, E,
  ],
  heart: [
    E, '..##....##..', '.####..####.', '############', '############', '############',
    '.##########.', '..########..', '...######...', '....####....', '.....##.....', E,
  ],
  menu: [E, E, '############', '############', E, '############', '############', E, '############', '############', E, E],
  close: [
    '##........##', '###......###', '.###....###.', '..###..###..', '...######...', '....####....',
    '....####....', '...######...', '..###..###..', '.###....###.', '###......###', '##........##',
  ],
  arrow: [
    E, '......##....', '.......##...', '........##..', '.........##.', '############',
    '############', '.........##.', '........##..', '.......##...', '......##....', E,
  ],
  star: [
    '.....##.....', '.....##.....', '....####....', '############', '.##########.', '..########..',
    '...######...', '..########..', '..###..###..', '.###....###.', '.##......##.', E,
  ],
  sparkle: [
    '.....##.....', '.....##.....', '.....##.....', '....####....', '...######...', '############',
    '############', '...######...', '....####....', '.....##.....', '.....##.....', '.....##.....',
  ],
  lock: [
    '....####....', '...##..##...', '..##....##..', '..#......#..', '..#......#..', '.##########.',
    '.##########.', '.####..####.', '.####..####.', '.##########.', '.##########.', E,
  ],
  download: [
    '.....##.....', '.....##.....', '.....##.....', '.....##.....', '..########..', '...######...',
    '....####....', '.....##.....', E, '#..........#', '#..........#', '############',
  ],
  external: [
    '......######', '........####', '.......#####', '......###.##', '#####.###..#', '#...###.....',
    '#..###......', '#..##......#', '#..........#', '#..........#', '#..........#', '############',
  ],
}

/* ------------------------------------------------------------------ */
/* Avatares chibi 16x16                                                */
/* o contorno · h pelo · H pelo sombra · s piel · e ojo · w brillo     */
/* b rubor · m boca · c ropa · g lentes · x / y accesorios · k capucha */
/* ------------------------------------------------------------------ */
const BASE = [
  '................',
  '....oooooooo....',
  '...ohhhhhhhho...',
  '..ohhhhhhhhhho..',
  '.ohhhhhhhhhhhho.',
  '.ohhHhhhhhhHhho.',
  '.ohhssshhssshho.',
  '.ohssssssssssho.',
  '.osswesssswesso.',
  '.osseesssseesso.',
  '.osbssssssssbso.',
  '..ossssmmsssso..',
  '...oossssssoo...',
  '...occcssccco...',
  '..occcccccccco..',
  '..oooooooooooo..',
]

const SKIN = '#ffe3cf'
const COMMON = { o: '#3d2c5c', s: SKIN, w: '#ffffff', b: '#ffb3c7', m: '#c0607a' }

function build({ rows = {}, px = [] }) {
  const grid = BASE.map((r) => r.split(''))
  Object.entries(rows).forEach(([y, str]) => {
    grid[Number(y)] = str.split('')
  })
  px.forEach(([x, y, ch]) => {
    grid[y][x] = ch
  })
  return grid.map((r) => r.join(''))
}

const glassesRows = {
  7: '.ohggggssggggho.',
  8: '.osgwegssgwegso.',
  9: '.osgeegssgeegso.',
  10: '.osggggssggggso.',
}

export const CHARACTERS = {
  707: {
    name: '707',
    pastel: 'var(--p-707)',
    palette: { h: '#e0533d', H: '#b83a2a', e: '#d4a017', c: '#5a4a7a', g: '#f2b705', x: '#ffd35c', y: '#7fd8f0' },
    grid: build({
      rows: {
        0: '........oo......',
        1: '....ooooohho....',
        4: '.oxxyyxxxxyyxxo.',
        ...glassesRows,
        14: '..occcxcccxcco..',
      },
    }),
  },
  jumin: {
    name: 'Jumin',
    pastel: 'var(--p-jumin)',
    palette: { h: '#2b2b3a', H: '#45455e', e: '#6b6f8a', c: '#2b2b3a', x: '#ffffff' },
    grid: build({
      rows: {
        6: '.ohhhhhhhssshho.',
        7: '.ohhsssssssssho.',
        13: '...occcxxccco...',
        14: '..occccxxcccco..',
      },
    }),
  },
  zen: {
    name: 'Zen',
    pastel: 'var(--p-zen)',
    palette: { h: '#f4f4fa', H: '#c4c6dc', e: '#d9405a', c: '#ffffff', x: '#3d2c5c' },
    grid: build({
      rows: { 14: '..occcxxxxccco..' },
      px: [
        [14, 9, 'H'], [15, 9, 'o'], [14, 10, 'H'], [15, 10, 'o'], [14, 11, 'H'], [15, 11, 'o'],
        [13, 12, 'o'], [14, 12, 'H'], [15, 12, 'o'], [14, 13, 'o'],
      ],
    }),
  },
  yoosung: {
    name: 'Yoosung',
    pastel: 'var(--p-yoosung)',
    palette: { h: '#f6d365', H: '#d9ad3f', e: '#8a5cc7', c: '#7fc98a', x: '#ff8fb1', y: '#7fb8f0' },
    grid: build({ px: [[11, 4, 'x'], [12, 4, 'y'], [11, 5, 'y'], [12, 5, 'x']] }),
  },
  jaehee: {
    name: 'Jaehee',
    pastel: 'var(--p-jaehee)',
    palette: { h: '#8b5a3c', H: '#6e4630', e: '#7a5232', c: '#d9b48f', g: '#3d2c5c', x: '#ffffff' },
    grid: build({
      rows: { ...glassesRows, 13: '...occcxxccco...' },
      px: [[2, 8, 'h'], [13, 8, 'h'], [2, 9, 'h'], [13, 9, 'h'], [2, 10, 'h'], [13, 10, 'h'], [3, 11, 'o'], [12, 11, 'o']],
    }),
  },
  v: {
    name: 'V',
    pastel: 'var(--p-v)',
    palette: { h: '#5cc9c2', H: '#3fa9a3', e: '#2b2b3a', c: '#6a7fa0', k: '#2b2b3a', y: '#8fe3ff' },
    grid: build({
      rows: {
        8: '.osykkkkkkkkyso.',
        9: '.osskkkssskkkso.',
      },
      px: [[4, 8, 'y'], [10, 8, 'y']],
    }),
    noBlink: true,
  },
  unknown: {
    name: 'Unknown',
    pastel: 'var(--p-unknown)',
    palette: { h: '#f7ecf3', H: '#f29cc0', e: '#3fbf98', c: '#4b3470', k: '#4b3470' },
    grid: build({
      rows: {
        1: '...okkkkkkkko...',
        2: '..okkkkkkkkkko..',
        3: '.okkkhhhhhhkkko.',
        4: '.okhhhhhhhhhhko.',
        5: '.okhhHhhhhHhhko.',
        6: '.okhssshhssshko.',
        7: '.okssssssssssko.',
        8: '.okswesssswesko.',
        9: '.okseesssseesko.',
        10: '.okbssssssssbko.',
      },
    }),
  },
  fressia: {
    name: 'Fressia',
    pastel: 'var(--p-fressia)',
    palette: { h: '#5a3a34', H: '#7a524a', e: '#4a2e2a', c: '#c9b8ff', x: '#ff7aa8', y: '#ffffff' },
    grid: build({
      rows: {
        0: '...........xx...',
        1: '....oooooooxyx..',
        2: '...ohhhhhhhhxx..',
      },
      px: [
        [1, 11, 'o'], [2, 11, 'h'], [1, 12, 'o'], [2, 12, 'h'], [1, 13, 'o'], [2, 13, 'h'],
        [13, 11, 'h'], [14, 11, 'o'], [13, 12, 'h'], [14, 12, 'o'], [13, 13, 'h'], [14, 13, 'o'],
      ],
    }),
  },
}

// Fressia = MC (v3): respaldo pixel cuando no carga /avatars/mc.*
CHARACTERS.mc = { ...CHARACTERS.fressia, name: 'Fressia' }

/** Orden del elenco que aparece en la fila de mini-avatares. */
export const CAST_ORDER = ['707', 'jumin', 'zen', 'yoosung', 'jaehee', 'v', 'unknown']

export const SKIN_COLOR = SKIN
export const COMMON_COLORS = COMMON

/* Gatita blanca 16x12, dos cuadros de caminata */
const CAT_BODY = [
  '..o.o...........',
  '.owowo..........',
  '.owwwwo.........',
  '.owpwpwoooooo...',
  '.owwnwwwwwwwwo.o',
  '..owwwwwwwwwwwoo',
  '...owwwwwwwwwo..',
  '...owwwwwwwwwo..',
]
export const CAT_FRAMES = [
  [...CAT_BODY, '...owo.owo.owo..', '...oo..oo..oo...', E + '....', E + '....'],
  [...CAT_BODY, '....owoowo.owo..', '....oo.oo...oo..', E + '....', E + '....'],
]
export const CAT_PALETTE = { o: '#3d2c5c', w: '#ffffff', p: '#5fb3a1', n: '#ff8fb1' }
