class DungeonMap {
    size: number;
    board: KnockoutObservable<DungeonTile[][]>;
    playerPosition: KnockoutObservable<Point>;
    playerMoved: KnockoutObservable<boolean>;

    constructor(size: number) {
        this.size = size;
        this.board = ko.observable(this.generateMap());

        this.playerPosition = ko.observable(new Point(Math.floor(size / 2), size - 1));
        this.playerMoved = ko.observable(false);

        // Move the boss if it spawns on the player.
        if (this.currentTile().type() == GameConstants.DungeonTile.boss) {
            this.currentTile().type(GameConstants.DungeonTile.entrance);
            const newX = GameConstants.randomIntBetween(0, size - 2);
            const newY = GameConstants.randomIntBetween(0, size - 2);
            this.board()[newY][newX].type(GameConstants.DungeonTile.boss);
            this.board()[newY][newX].calculateCssClass();
        }
        this.currentTile().isVisible = true;
        this.currentTile().type(GameConstants.DungeonTile.entrance);
        this.currentTile().hasPlayer = true;
        this.currentTile().calculateCssClass();
    }

    public moveToCoordinates(x: number, y: number) {
        if (this.moveToTile(new Point(x, y))) {
            this.playerMoved(true);
        }
    }

    public moveUp() {
        this.moveToCoordinates(this.playerPosition().x, this.playerPosition().y - 1);
    }

    public moveRight() {
        this.moveToCoordinates(this.playerPosition().x + 1, this.playerPosition().y);
    }

    public moveDown() {
        this.moveToCoordinates(this.playerPosition().x, this.playerPosition().y + 1);
    }

    public moveLeft() {
        this.moveToCoordinates(this.playerPosition().x - 1, this.playerPosition().y);
    }

    public moveToTile(point: Point): boolean {
        if (this.hasAccesToTile(point)) {
            this.currentTile().hasPlayer = false;
            this.currentTile().calculateCssClass();
            this.playerPosition(point);
            this.currentTile().hasPlayer = true;
            this.currentTile().isVisible = true;
            this.currentTile().calculateCssClass();
            if (this.currentTile().type() == GameConstants.DungeonTile.enemy) {
                DungeonBattle.generateNewEnemy();
            }
            if (this.currentTile().type() == GameConstants.DungeonTile.chest && Settings.getSetting('autoChest').value) {
                DungeonRunner.openChest();
            }
            return true;
        }
        return false;
    }

    public showChestTiles() {
        for (let i = 0; i < this.board().length; i++) {
            for (let j = 0; j < this.board()[i].length; j++) {
                if (this.board()[i][j].type() == GameConstants.DungeonTile.chest) {
                    this.board()[i][j].isVisible = true;
                    this.board()[i][j].calculateCssClass();
                }
            }
        }
    }

    public showAllTiles() {
        for (let i = 0; i < this.board().length; i++) {
            for (let j = 0; j < this.board()[i].length; j++) {
                this.board()[i][j].isVisible = true;
                this.board()[i][j].calculateCssClass();
            }
        }
    }

    public currentTile(): DungeonTile {
        return this.board()[this.playerPosition().y][this.playerPosition().x];
    }

    public hasAccesToTile(point: Point) {
        if (DungeonRunner.fighting() || DungeonBattle.catching()) {
            return false;
        }
        //If any of the adjacent Tiles is visited, it's a valid Tile.
        if (point.x < 0 || point.x >= this.size || point.y < 0 || point.y >= this.size) {
            return false;
        }

        if (point.y < this.size - 1 && this.board()[point.y + 1][point.x].isVisible) {
            return true;
        }

        if (point.y > 0 && this.board()[point.y - 1][point.x].isVisible) {
            return true;
        }

        if (point.x < this.size - 1 && this.board()[point.y][point.x + 1].isVisible) {
            return true;
        }

        if (point.x > 0 && this.board()[point.y][point.x - 1].isVisible) {
            return true;
        }
        return false;
    }

    public generateMap() {
        // Fill mapList with required Tiles
        const mapList: DungeonTile[] = [];

        // Boss
        mapList.push(new DungeonTile(GameConstants.DungeonTile.boss));

        // Chests
        for (let i = 0; i < this.size; i++) {
            mapList.push(new DungeonTile(GameConstants.DungeonTile.chest));
        }

        // Enemy Pokemon
        for (let i = 0; i < this.size * 2 + 3; i++) {
            mapList.push(new DungeonTile(GameConstants.DungeonTile.enemy));
        }

        // Fill with empty tiles
        for (let i: number = mapList.length; i < this.size * this.size; i++) {
            mapList.push(new DungeonTile(GameConstants.DungeonTile.empty));
        }

        // Shuffle the tiles randomly
        this.shuffle(mapList);
        while (mapList[mapList.length - Math.floor(this.size / 2) - 1].type() != GameConstants.DungeonTile.empty) {
            this.shuffle(mapList);
        }

        // Create a 2d array
        const map: DungeonTile[][] = [];
        while (mapList.length) {
            map.push(mapList.splice(0, this.size));
        }
        return map;
    }

    /**
     * Shuffles array in place.
     * @param {Array} a items The array containing the items.
     */
    public shuffle(a) {
        let j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }
}
