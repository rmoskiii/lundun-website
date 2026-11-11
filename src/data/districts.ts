// All copy here is placeholder flavour text. Edit freely; the map reads from this file.

export type DistrictId = 'knightsbury' | 'canary-quay' | 'peckam' | 'gilmore';

export interface District {
  id: DistrictId;
  name: string;
  bank: 'North bank' | 'South bank';
  line: string;
  blurb: string;
  sightings: string[];
  heat: 1 | 2 | 3 | 4 | 5;
  /** SVG polygon points in the map's 800 x 520 viewBox */
  shape: string;
  label: [number, number];
  pattern: string;
}

export const DISTRICTS: District[] = [
  {
    id: 'knightsbury',
    name: 'Knightsbury',
    bank: 'North bank',
    line: 'Old money. Older secrets.',
    blurb: 'Garden squares, private security and cars worth more than the houses they’re parked outside.',
    sightings: ['Gated squares', 'Supercars', 'Private security'],
    heat: 2,
    shape: '30,30 420,30 420,240 300,252 160,214 30,204',
    label: [215, 120],
    pattern: 'pat-grid',
  },
  {
    id: 'canary-quay',
    name: 'Canary Quay',
    bank: 'North bank',
    line: 'Glass towers. Dirty money.',
    blurb: 'Bankers by day. After midnight the lifts keep running and nobody asks who’s going up.',
    sightings: ['Towers', 'Docks', 'River crossings'],
    heat: 3,
    shape: '440,30 770,30 770,206 712,232 684,326 640,376 590,372 548,322 522,264 440,246',
    label: [608, 110],
    pattern: 'pat-towers',
  },
  {
    id: 'peckam',
    name: 'Peckam',
    bank: 'South bank',
    line: 'Loud streets. Long memories.',
    blurb: 'Terraces, night buses and corner shops that never close. Everybody knows somebody.',
    sightings: ['Terraced streets', 'Night buses', 'The big wheel'],
    heat: 4,
    shape: '30,262 150,262 290,302 410,300 428,490 30,490',
    label: [215, 400],
    pattern: 'pat-terrace',
  },
  {
    id: 'gilmore',
    name: 'Gilmore Estate',
    bank: 'South bank',
    line: 'Don’t come here asking questions.',
    blurb: 'Tower blocks and stairwells with their own rules. Some doors you knock on once.',
    sightings: ['Tower blocks', 'Underpasses', 'Rooftops'],
    heat: 5,
    shape: '448,300 500,296 530,368 594,422 666,422 724,360 744,272 770,262 770,490 448,490',
    label: [640, 462],
    pattern: 'pat-blocks',
  },
];

/** River centre line, drawn on top of the districts as a wide stroke. */
export const RIVER_PATH =
  'M -20 232 C 120 216 230 280 380 272 C 468 266 498 268 520 312 C 548 392 600 420 646 404 C 694 386 704 310 724 262 C 742 226 780 226 820 230';
