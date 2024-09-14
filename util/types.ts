type Grid = Array<Array<number>> 
type RowColumnIndicesFromThreeByThreeSubgridWithinGridTuple = [row: number, column: number]
type ThreeByThreeBlockWeFindOurselvesAt = Array<RowColumnIndicesFromThreeByThreeSubgridWithinGridTuple>
type ThreeByThreeBlockIndicesFromGrid = Array<ThreeByThreeBlockWeFindOurselvesAt> //Array containing nine arrays each of which represent a 3x3 subgrid with the indices within such 3x3 subgrid in our 9x9 sudoku representation 
type RowColumnEnteredValueTuple = [row: number, column:number, value: number]

export { Grid, RowColumnIndicesFromThreeByThreeSubgridWithinGridTuple, ThreeByThreeBlockIndicesFromGrid, RowColumnEnteredValueTuple, ThreeByThreeBlockWeFindOurselvesAt }