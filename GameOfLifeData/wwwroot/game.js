// Load all required engine components
R.Engine.define({
    "class": "GameOfLife",
    "requires": [
        "R.engine.Game"
    ]
});

/**
 * @class Game of Life
 *
 * Interesting seeds:
 *      4001389056
 */
var GameOfLife = function () {
    return R.engine.Game.extend({

        world: null,
        
        DEAD_CELL: 0,
        LIVE_CELL: 1,

        cellWidth: 0,
        cellHeight: 0,

        playWidth: 500,
        playHeight: 500,

        xDivisions: 0,
        yDivisions: 0,

        surroundingCells: [],

        TOP_LEFT: R.math.Point2D.create(-1, -1),
        TOP_CENTER: R.math.Point2D.create(0, -1),
        TOP_RIGHT: R.math.Point2D.create(1, -1),
        LEFT: R.math.Point2D.create(-1, 0),
        RIGHT: R.math.Point2D.create(1, 0),
        BOTTOM_LEFT: R.math.Point2D.create(-1, 1),
        BOTTOM_CENTER: R.math.Point2D.create(0, 1),
        BOTTOM_RIGHT: R.math.Point2D.create(1, 1),

        checkbox: null,
        doStep: false,

        /**
         * Called to set up the game, download any resources, and initialize
         * the game to its running state.
         */
        setup: function () {
            GameOfLife.seedWorld(R.engine.Support.getNumericParam('width', 30),
                R.engine.Support.getNumericParam('height', 30),
                R.engine.Support.getStringParam('game', 'defaultGame'),
                R.engine.Support.getNumericParam('seed', R.lang.Math2.randomInt()));

            GameOfLife.checkbox = $("input.pause");
        },

        seedWorld: function(worldWidth, worldHeight, gameId, seed) {
            R.lang.Math2.seed(seed);

            GameOfLife.elapsed = 0;
            GameOfLife.gameId = gameId;
            GameOfLife.cellWidth = Math.floor(GameOfLife.playWidth / worldWidth);
            GameOfLife.cellHeight = Math.floor(GameOfLife.playHeight / worldHeight);

            // Drop a few dynamic styles
            var cellStyle = 'div.cell { width: ' + GameOfLife.cellWidth + 'px; height: ' + GameOfLife.cellHeight + 'px; ' +
                'float: left; position: relative; padding: 0; margin: 0; line-height: 7px; border-top: 1px solid; ' +
                'border-left: 1px solid; } ' +
                'div.cell.alive { background-color: black; } ' +
                'div.cell.dead { background-color: none; } ';

            var worldStyle = 'div.world { width: ' + (GameOfLife.playWidth + (worldWidth - GameOfLife.cellWidth)) +  'px; height: ' +
                (GameOfLife.playHeight + (worldHeight - GameOfLife.cellHeight)) + 'px; ' +
                'border: 1px solid blue; }';

            var styles = "<style type='text/css'>" + cellStyle + worldStyle + "</style>";
            $("head").append(styles);

            GameOfLife.world = [];

            GameOfLife.load().then(function () {
                for (var cell = 0; cell < worldWidth * worldHeight; cell++) {
                    var cellState = GameOfLife.data[cell];
                    GameOfLife.world[cell] = {
                      state: cellState,
                      element: $("<div>").addClass("cell").addClass(cellState === GameOfLife.LIVE_CELL ? 'alive' : 'dead')
                    };
                }
                GameOfLife.xDivisions = worldWidth;
                GameOfLife.yDivisions = worldHeight;

                // Draw out the cells
                var world = $("<div class='world'>");
                for (cell = 0; cell < GameOfLife.world.length; cell++) {
                    world.append(GameOfLife.world[cell].element);
                }

                $("body", document).append(world).append($("<div>").html("seed: " + seed));

                world.click(function(ev) {
                    GameOfLife.createCell(ev);
                });

                for (var x = 0; x < 8; x++) {
                    GameOfLife.surroundingCells[x] = R.math.Point2D.create(0,0);
                }
            });
        },

        store: function() {
            fetch('/api/game/' + GameOfLife.gameId, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(GameOfLife.data)
            })
            .then(response => console.log(`Stored game state for game "${GameOfLife.gameId}"`));
        },

        load: async function() {
            await fetch('/api/game/' + GameOfLife.gameId, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
                .then(function (data) {
                    console.log(data);
                    GameOfLife.data = data;
                })
            .then(_ => console.log(`Retrieved game state for game "${GameOfLife.gameId}"`))
        },

        createCell: function(ev) {
            if (GameOfLife.world[$("div.cell").index(ev.target)].state == GameOfLife.LIVE_CELL) {
                $(ev.target).addClass("dead").removeClass("alive");
                GameOfLife.world[$("div.cell").index(ev.target)].state = GameOfLife.DEAD_CELL
                GameOfLife.data[$("div.cell").index(ev.target)] = GameOfLife.DEAD_CELL;
            }
            else if (GameOfLife.world[$("div.cell").index(ev.target)].state == GameOfLife.DEAD_CELL) {
                $(ev.target).addClass("alive").removeClass("dead");
                GameOfLife.world[$("div.cell").index(ev.target)].state = GameOfLife.LIVE_CELL
                GameOfLife.data[$("div.cell").index(ev.target)] = GameOfLife.LIVE_CELL;
            }
            GameOfLife.store();
        },

        getCell: function(point) {
            return ((point.y * GameOfLife.xDivisions) + point.x);
        },

        getCoordinates: function(cell) {
            var y = Math.floor(cell / GameOfLife.xDivisions);
            var x = (cell % GameOfLife.xDivisions);
            return R.math.Point2D.create(x, y);
        },

        step: function() {
            GameOfLife.doStep = true;
        },

        tick: function(time, dt) {
            var cell;
            if (GameOfLife.checkbox[0].checked && !GameOfLife.doStep) {
                return;
            }
            if (GameOfLife.elapsed < 2000 && !GameOfLife.doStep) {
                GameOfLife.elapsed += dt;
                return;
            }

            GameOfLife.elapsed = 0;
            GameOfLife.doStep = false;

            GameOfLife.load().then(_ => GameOfLife.redraw());
        },
        redraw: function () {
            for (cell = 0; cell < GameOfLife.world.length; cell++) {
                if (GameOfLife.data[cell] == GameOfLife.DEAD_CELL) {
                    GameOfLife.world[cell].element.removeClass("alive").addClass("dead");
                    GameOfLife.world[cell].state = GameOfLife.DEAD_CELL;
                } else if (GameOfLife.data[cell] == GameOfLife.LIVE_CELL) {
                    GameOfLife.world[cell].element.addClass("alive").removeClass("dead");
                    GameOfLife.world[cell].state = GameOfLife.LIVE_CELL;
                }
            }
        }

    });
};