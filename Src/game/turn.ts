﻿enum TurnMode {
   Timed,
   Match
}

class TurnManager {

   private _timer: ex.Timer;

   constructor(public logicalGrid: LogicalGrid, public matcher: MatchManager, public turnMode: TurnMode) {
      matcher.on('match', _.bind(this._handleMatchEvent, this));
      this._timer = new ex.Timer(_.bind(this._tick, this), 2000, true);
      game.add(this._timer);
   }

   public advanceTurn(): void {
      this.advanceRows();
      transitionManager.evaluate();
   }

   public advanceRows(): void {
      // shift all rows up 1
      for (var i = 0; i < grid.rows; i++) {
         this.logicalGrid.shift(i, i - 1);
      }
      // fill first row
      this.logicalGrid.fill(grid.rows - 1);
   }

   private _handleMatchEvent(evt: MatchEvent) {
      if (evt.run.length >= 3) {
         evt.run.forEach(p => grid.clearPiece(p));
         transitionManager.evaluate();
         this.advanceRows();
      }
   }

   private _tick() {
      if (this.turnMode === TurnMode.Timed) {
         this.advanceRows();
      }
      //ex.Logger.getInstance().info("Tick", new Date());
   }
   
} 