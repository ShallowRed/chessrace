import LevelSquare from 'app/level/square';

import { readRules } from 'app/level/rules';
import { withTaken } from 'app/level/threat';
import { parseBlueprint } from 'app/utils/parse-blueprint';
import { bindObjectsMethods } from "app/utils/bind-methods";

import { PIECE_NAMES } from 'app/types';

import type { Outcome, Rules, Standing } from 'app/level/rules';
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

  private readonly rules: Rules;

  constructor(blueprint: string, { columns, rows, visibleRows }: BoardDimensions) {

    Object.assign(this, { columns, rows, visibleRows });

    this.blueprint = parseBlueprint(blueprint, columns);

    this.rules = readRules(this.blueprint, columns);

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

  holds(square: Coords): boolean {

    return this.rules.isHeld(this.taken, square);
  }

  // The one place a click is turned into what it means. The solver reads the
  // same answer from the same rules, so the two cannot drift apart.
  resolve(player: PiecePlacement, target: Coords): Outcome {

    const standing: Standing = { ...player, taken: this.taken };

    return this.rules.resolve(standing, target);
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
