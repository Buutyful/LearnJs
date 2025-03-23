const ROWS = 10;
const COLS = 10;
const BOMBS = 5;
class Tile
{
    constructor(row, col, value = 0, isBomb = false)
    {
        this.row = row;
        this.col = col;
        this.value = value;
        this.isBomb = isBomb;
        this.isRevealed = false;
    }
}

class Grid
{
    constructor()
    {
        // Initialize tiles as 2D array with proper dimensions
        this.tiles = Array(ROWS).fill().map(() => Array(COLS));
    }

    Initialize()
    {
        for (let i = 0; i < ROWS; i++) 
        {
            for (let j = 0; j < COLS; j++) 
            {
                this.tiles[i][j] = new Tile(i, j);
            }
        }
        this.#PlaceBombs();
        this.#CalculateValues();
    }
    #PlaceBombs()
    {
        for (let i = 0; i < BOMBS; i++) 
        {
            let row = Math.floor(Math.random() * ROWS);
            let col = Math.floor(Math.random() * COLS);
            this.tiles[row][col].isBomb = true;
        }
    }
    #CalculateValues()
    {
        this.tiles.forEach(row => row.forEach(tile => {
            let bombCount = 0;
            for (let i = -1; i <= 1; i++)
            {
                for (let j = -1; j <= 1; j++)
                {
                    const newRow = tile.row + i;
                    const newCol = tile.col + j;
                    if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS)
                    {
                        if (this.tiles[newRow][newCol].isBomb)
                        {
                            bombCount++;
                        }
                    }
                }
            }
            tile.value = bombCount;
        }));
    }
    static RevealTile(tile, grid, revealCallback)
    {
        const queue = [tile];
        const visited = new Set();

        while (queue.length > 0) {
            const currentTile = queue.shift();
            
            if (visited.has(`${currentTile.row},${currentTile.col}`)) {
                continue;
            }

            currentTile.isRevealed = true;
            revealCallback(currentTile);
            visited.add(`${currentTile.row},${currentTile.col}`);

            if (currentTile.value === 0) {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const newRow = currentTile.row + i;
                        const newCol = currentTile.col + j;
                        
                        if (newRow >= 0 && newRow < ROWS && 
                            newCol >= 0 && newCol < COLS) {
                            queue.push(grid.tiles[newRow][newCol]);
                        }
                    }
                }
            }
        }
    }
}
