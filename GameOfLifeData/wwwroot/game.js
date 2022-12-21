// Load all required engine components
R.Engine.define({
    "class": "GameOfLife",
    "requires": [
        "R.engine.Game"
    ]
});

/**
 * @class Game of Life
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
            GameOfLife.initWorld(
                30, //R.engine.Support.getNumericParam('width', 30),
                30, //R.engine.Support.getNumericParam('height', 30),
                R.engine.Support.getNumericParam('delay', 2000),
                R.engine.Support.getStringParam('color', "true"),
                R.engine.Support.getStringParam('game', 'defaultGame'));

            GameOfLife.checkbox = $("input.pause");
        },

        initWorld: function(worldWidth, worldHeight, delay, color, gameId) {
            GameOfLife.elapsed = 0;
            GameOfLife.gameId = gameId;
            GameOfLife.delay = delay;
            GameOfLife.worldWidth = worldWidth;
            GameOfLife.worldHeight = worldHeight;
            GameOfLife.cellWidth = Math.floor(GameOfLife.playWidth / GameOfLife.worldWidth);
            GameOfLife.cellHeight = Math.floor(GameOfLife.playHeight / GameOfLife.worldHeight);

            // Drop a few dynamic styles
            var cellStyle = 'div.cell { width: ' + GameOfLife.cellWidth + 'px; height: ' + GameOfLife.cellHeight + 'px; ' +
                'float: left; position: relative; padding: 0; margin: 0; line-height: 7px; border-top: 1px solid; ' +
                'border-left: 1px solid; } ';

            if (color == "true") {
                cellStyle += 'div.cell.alive { background-color: green; opacity: 0.65; border-radius: 50%; border-color: green; }' +
                    'div.cell.alive:hover { opacity: 0.8; }' +
                    'div.cell.dead { background-color: red; opacity: 0.5; border-radius: 50%; border-color: red; } ' +
                    'div.cell.dead:hover { opacity: 0.65; }';
            }
            else {
                cellStyle += 'div.cell.alive { background-color: black; border-radius: 50%; }' +
                    'div.cell.alive:hover { background-color: gray; opacity: 0.8; border-radius: 50%;}' +
                    'div.cell.dead { background-color: white; border-color: lightgray; border-radius: 50%;} ' +
                    'div.cell.dead:hover {  background-color: gray; opacity: 0.8; border-radius: 50%;}';
            }
                
            var worldStyle = 'div.world { width: ' + (GameOfLife.playWidth + (worldWidth - GameOfLife.cellWidth)) +  'px; height: ' +
                (GameOfLife.playHeight + (worldHeight - GameOfLife.cellHeight)) + 'px; ' +
                'padding: 1em; }';

            var styles = "<style type='text/css'>" + cellStyle + worldStyle + "</style>";
            $("head").append(styles);

            GameOfLife.load().then(GameOfLife.draw);
        },

        draw: function () {
            GameOfLife.world = [];

            for (var cell = 0; cell < GameOfLife.worldWidth * GameOfLife.worldHeight; cell++) {
                var cellState = GameOfLife.data[cell];
                GameOfLife.world[cell] = {
                    state: cellState,
                    element: $("<div>").addClass("cell").addClass(cellState === GameOfLife.LIVE_CELL ? 'alive' : 'dead')
                };
            }
            GameOfLife.xDivisions = GameOfLife.worldWidth;
            GameOfLife.yDivisions = GameOfLife.worldHeight;

            var world = $("<div class='world'>");
            for (cell = 0; cell < GameOfLife.world.length; cell++) {
                world.append(GameOfLife.world[cell].element);
            }

            $("body", document).append(world)
                .append("<div>URL parameters <ul><li>game: <i>yourGameName</i></li><li>color: <b>true</b>/false</li><li>delay: <i>milliseconds between redraw (default is 2000)</li></ul></div>")
                .append("<div>e.g. <a href=\"https://game-of-life-di.azurewebsites.net?game=myPersonalGame&color=false&delay=500\">https://game-of-life-di.azurewebsites.net?game=myPersonalGame&color=false&delay=500</a>")


            world.click(function(ev) {
                GameOfLife.createCell(ev);
            });

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

        createCell: function (ev) {
            var clickedIndex = $("div.cell").index(ev.target);
            if (clickedIndex === -1) {
                return;
            }

            var clickedCell = GameOfLife.world[clickedIndex];

            if (clickedCell.state == GameOfLife.LIVE_CELL) {
                $(ev.target).addClass("dead").removeClass("alive");
                clickedCell.state = GameOfLife.DEAD_CELL
                GameOfLife.data[clickedIndex] = GameOfLife.DEAD_CELL;
            }
            else if (clickedCell.state == GameOfLife.DEAD_CELL) {
                $(ev.target).addClass("alive").removeClass("dead");
                clickedCell.state = GameOfLife.LIVE_CELL
                GameOfLife.data[clickedIndex] = GameOfLife.LIVE_CELL;
            }

            GameOfLife.store();
        },

        step: function() {
            GameOfLife.doStep = true;
        },

        tick: function(time, dt) {
            var cell;
            if (GameOfLife.checkbox[0].checked && !GameOfLife.doStep) {
                return;
            }
            if (GameOfLife.elapsed < GameOfLife.delay && !GameOfLife.doStep) {
                GameOfLife.elapsed += dt;
                return;
            }

            GameOfLife.elapsed = 0;
            GameOfLife.doStep = false;
            GameOfLife.load().then(GameOfLife.redraw);
        }
    });
};