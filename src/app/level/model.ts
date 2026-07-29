import LevelSquare from 'app/level/square';

import { readThreat, withTaken } from 'app/level/threat';
import { parseBlueprint } from 'app/utils/parse-blueprint';
import { bindObjectsMethods } from "app/utils/bind-methods";

import { PIECE_NAMES } from 'app/types';

import type { Held } from 'app/level/threat';
import type {
  Bound,
  BoardDimensions,
  Coords,
  PieceName,
  PiecePlacement
} from 'app/types';

interface FilterableSquare {
  value: number;
  index: number;
}

export default class LevelModel {

  pieces: readonly PieceName[] = PIECE_NAMES;

  declare columns: number;

  declare rows: number;

  declare visibleRows: number;

  declare square: Bound<typeof LevelSquare>;

  blueprint: number[][];

  regularSquares: Coords[] = [];

  enemyPieces: PiecePlacement[] = [];

  taken = "";

  private readonly threat: Held;

  constructor(blueprint: string, { columns, rows, visibleRows }: BoardDimensions) {

    Object.assign(this, { columns, rows, visibleRows });

    this.blueprint = parseBlueprint(blueprint, columns);

    this.threat = readThreat(this.blueprint, columns);

    bindObjectsMethods.call(
      this as unknown as Record<string, unknown>,
      { square: LevelSquare }
    );
  }

  // The whole level is read at once: it is drawn once, and what has not been
  // scrolled into view yet is off the top of a canvas that already holds it.
  reset(): void {

    const rows = Array
      .from({ length: this.rows }, (_none, row) => this.parseRow(row));

    this.regularSquares = rows.flatMap(({ regularSquares }) => regularSquares);

    this.enemyPieces = rows.flatMap(({ newEnemies }) => newEnemies);

    this.taken = "";
  }

  get heldSquares(): ReadonlySet<string> {

    return this.threat(this.taken);
  }

  capture(square: Coords): void {

    this.taken = withTaken(this.taken, square);
  }

  parseRow(rowIndex: number): {
    regularSquares: Coords[];
    newEnemies: PiecePlacement[];
  } {

    const filterableRow: FilterableSquare[] = (this.blueprint[rowIndex] ?? [])
      .map((value, index) => ({ value, index }));

    const isNotHole = ({ value }: FilterableSquare) => value > 0;

    const isEnemy = ({ value }: FilterableSquare) => value > 1;

    const getSquareCoords = ({ index }: { index: number }): Coords => [index, rowIndex];

    const getPieceName = (value: number) => this.pieces[value - 2] as PieceName;

    const getPiecePositionAndName = ({ value, index }: FilterableSquare): PiecePlacement => ({
      pieceName: getPieceName(value),
      position: getSquareCoords({ index })
    });

    return {

      regularSquares: filterableRow
        .filter(isNotHole)
        .map(getSquareCoords),

      newEnemies: filterableRow
        .filter(isEnemy)
        .map(getPiecePositionAndName)
    }
  }
}
