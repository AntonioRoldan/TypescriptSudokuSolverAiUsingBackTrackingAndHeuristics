import {Grid, ThreeByThreeBlockIndicesFromGrid, ThreeByThreeBlockWeFindOurselvesAt, RowColumnIndicesFromThreeByThreeSubgridWithinGridTuple, RowColumnEnteredValueTuple} from "./util/types"
//SUDOKU SOLVER IN TYPESCRIPT USING BACKTRACKING 
const { generateSudoku } = require("sudoku-puzzle")

const sudokuSolver = (sudokuGrid: Grid = []) => {
    
    //Data structures : 

    //threeByThreeGridsRowsAndColumnIndexesWithinSudokuGrid: Multidimensional array containing an array for each 3x3 block found in our 9x9 grid which in turns contains its elements' row and column indexex WITHIN our 9x9 array listed row by row from top to bottom
    //Each array contains arrays with the rows and column directions for each of the nine 3x3 blocks arranged in a top to bottom fashion for rows first and a left to right fashion in terms of columns
    //we will try to find the row and column of a given square we find ourselves at throughout the algorithm here and use
    //The outer loop index to know what 3x3 block we find ourseles in out of the nine there are 
    //3x3 blocks are stores on a left to right basis, top to bottom in terms of rows so first one row and within that row each column, then we go for the next row and so on in a top to bottom fashion

    //The program will traverse the sudokuGrid data structure and check for blanks squares that is rows and columns directions within the sudokuGrid data structure which contain 0 as a number then increase a counter with the total amount of blank squares 
    //It will then use the counter for the while loop as we enter numbers or remove them as part of our backtracking process we will increase or decrease the counter if the counter is zero the program will have found the solution 
    //After that it will traverse the sudokuGriid again looking for blank squares in the same way as we explained at the beginning of this comment 
    //Once at a blank square it will check if its row column is contained in one or more of the deadEndEnteredNumbersCombinations arrays and it will iterate through the deadEndEnteredNumbersCombinations data structure to do it and if the currentCombination variable is the same as the deadEndEnteredNumbersCombinations where the row column match has been found without our found match by row or column the currentRow and currentColumn variables
    //If they are the same it means if we add the value of our match by row and column to our current square with which the match matches in row and column we will get a dead end so we add this number to the unavailableEnteredNumbersChoices array 
    //Once the program finishes iterating through the deadEnteredNumbersCombinations data structures it will check for the length of unavailableEnteringNumbersChoices, which we will have made unique before and after adding all numbers to it, if it is nine since all numbers are unique and only numbers from one to nine are entered or located in a square
    //We will backtrack there to previously filled square to empty it and fill it again when we empty it we increase the numberOfBlankSquaresForWhileLoopCounter since we are a square further from getting to the solution so the while loop will have to run for that extra step 
    //In order to backtrack to a target point and try to enter the value and traverse the sudoku array looking for blanks to fill from there we have to get the square we are going to refill with a valid value this time, update the currontRow and currentColumn variables with its row and column values 
    //increase our numberOfBlanksSquaresForWhileLoopCounter and and break our nested for loop of depth 2 (one loop inside another)
    //That way the while loop will get to a next iteration with its checked value (blank squares count) updated so we won't run out of iterations
    //If on the contrary unavailableEnteringNumbersChoices does not have length 9 we add a new number to the sudoku grid and a tuple to the currentCombination array and decrease the counter 
    //The for loop will continue iterating from that point on and looking for blank squares to fill from top to bottom first and left to right second or in other words row by row 
    //When the counter is zero the solution will have been found 
    //How do we backtrack? We add a randomly selected previously added square within the current row and column or 3x3 block that we find ourselves in within the sudoku in the case if there are any if not we know we can pick any previously added square within currentCombination 
    //Unless the reason we hit the dead end is that no new values can be added without repeating values within the row column or 3x3 block we find ourselves in THAT we have not previously added in which case the sudoku is not well designed we run this check 
    //Within our backtracking target point finding function to know if the sudoku puzzle is valid 
    //The reason we can pick any previously added square from the currentCombination array if no previously added square has been found in our current row column and 3x3 block is that we find ourselves (provided we run our check for a valid sudoku puzzle) in a dead end situation by having run out 
    //of values to be added within a given square for a particular combinatiion of already added squares and this situation can be undone by changing any of the previously added squares so we will exit the current combination without needing to resort to previously added squares in the row column and or 3x3 grid we find ourselves in
    
    
    
    
    var numberOfBlankSquaresForWhileLoopCounter: number = 0
    var backtrackingTargetPoint: RowColumnEnteredValueTuple = [0, 0, 0] //The square we are emptying to refill it with a new valid value that gets us out of the dead end 
    var possibleNumberChoices: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9] //The algorithm will iterate through this numbers after filling the unavailableNumbers array if the number is not found in the unavailableNumbers array- The algorithm will fill the blank with that number 
    var unavailableEnteringNumbersChoices: number[] = [] //Numbers found on the same row, on the same column or on the same 3x3 grid or as part of a dead end combination. which we cannot repeat the number that the algorithm will enter in a blank square will be a number that is not found within this array BUT is found in the possibleNumberChoices array
    var numbersThatWeCanEnterIntoThisBlankSquare: number[] = []
    var unavailableEnteringNumbersChoicesFromRepeatedValuesInRowColumnAndThreeByThreeGrid: number[] = []
    var newlyAddedFilledSquare: RowColumnEnteredValueTuple = [0, 0, 0]
    var performBacktracking: boolean = false 
    var newNumberToBeAdded: number = 0 
    var currentRow: number = 0 //Our first cursor variable which we will use to traverse the 9x9 grid
    var currentColumn: number = 0  //Our second cursor variable which we will use to traverse the 9x9 grid 
    var deadEndEnteredNumbersCombinations: RowColumnEnteredValueTuple[][] = [] //We will check if a number we are going to enter at any given time is found here at the same row and column ALONG with the rest of entered numbers at the same rows and columns too if so we add that number to unavailableNumbersForEntering  
    //deadEndEnteredNumbersCombinations is an array of arrays of arrays of three length identical in information storing format as the currentCombination array commented below 
    //We know an entered combination is a dead end combination when the current blank where we are adding numbers does not have any available number as we check for numbers not in unavailableNumbersForEntering within the possibleNumberChoices array 
    var currentEnteredNumbersCombination: RowColumnEnteredValueTuple[] = [] //An array containing arrays of three length where elements from left to right are row, column, value 
    const rowAndColumnIndicesWithinEachThreeByThreeSubgridWithinSudokuGrid: ThreeByThreeBlockIndicesFromGrid= [ //When the algorithm finds itself at a blank square it will take its row and column and try to find it here to know the indexes that will be used to obtain the numbers found in its 3x3 block. 
                                           [[0, 0], [0, 1], [0, 2], //Those numbers will be added to the unavailableNumbersForEntering array without occurrences for any given number as we will do for the column and row check.
                                            [1, 0], [1, 1], [1, 2], 
                                            [2, 0], [2, 1], [2, 2] //End of first 3x3 block found at top row left column  
                                        ], [[0, 3], [0, 4], [0, 5],
                                            [1, 3], [1, 4], [1, 5],
                                            [2, 3], [2, 4], [2, 5] //End of Second 3x3 block found at top row middle column                                        
                                        ], [[0, 6], [0, 7], [0, 8],
                                            [1, 6], [1, 7], [1, 8],
                                            [2, 6], [2, 7], [2, 8] //End of Third 3x3 block found at top row right column
                                        ], [[3, 0], [3, 1], [3, 2],
                                            [4, 0], [4, 1], [4, 2],
                                            [5, 0], [5, 1], [5, 2] //End of fourth 3x3 block found at middle row left column
                                        ], [[3, 3], [3, 4], [3, 5],
                                            [4, 3], [4, 4], [4, 5],
                                            [5, 3], [5, 4], [5, 5] //End of fifth 3x3 block found at middle row middle column 
                                        ], [[3, 6], [3, 7], [3, 8],
                                            [4, 6], [4, 7], [4, 8],
                                            [5, 6], [5, 7], [5, 8] //End of sixth 3x3 block found at middle row right column 
                                        ], [[6, 0], [6, 1], [6, 2],
                                            [7, 0], [7, 1], [7, 2],
                                            [8, 0], [8, 1], [8, 2] //End of seventh 3x3 block found at bottom row left column 
                                        ], [[6, 3], [6, 4], [6, 5],
                                            [7, 3], [7, 4], [7, 5],
                                            [8, 3], [8, 4], [8, 5] //End of eighth 3x3 block found at bottom row middle column 
                                        ], [[6, 6], [6, 7], [6, 8],
                                            [7, 6], [7, 7], [7, 8],
                                            [8, 6], [8, 7], [8, 8] //End of ninth 3x3 block found at bottom row right column 
                                        ]
                                ]
    if(!sudokuGrid.length){ //If our sudoku is an empty
        return "No sudoku grid has been added"
    }
    //NOTE: First we must find the number of blank squares there are so we can set a while loop that indefinitely runs the algorithm until all blanks have been filled 
    var backtrackingCounts = 0 
    var squaresAttemptedCount = 0
    var pastSudokus: Grid[] = []
    var squaresVisitsCount = 0
    numberOfBlankSquaresForWhileLoopCounter  = findBlankSquaresAmountCounterForMainWhileLoop(sudokuGrid)
    var blankSquaresAtStart = numberOfBlankSquaresForWhileLoopCounter
    
    while(numberOfBlankSquaresForWhileLoopCounter > 0){
        backtrackingCounts++
        console.log("BACKTRACKING START IF THIS IS SHOWN SECOND TIME BACKTRACKING COUNTS NUMBER FOLLOWS SUBTRACT ONE FROM IT", backtrackingCounts)
        for(var i = 0; i < 9; i++){ // We set our index variables to current row and current column since we will update this values and break the loops if performBackTracking is set to true as part of our backtracking process in order to undo combinations try another combination with a different value from a previously added value that we may be removing if we reach a dead end 
            for(var j = 0; j < 9; j++){ //From the current row and current column variables we will keep iterating through the grid from top to bottom first left to right second 
                console.log("SQUARE VISITED START")
                console.log("CURRENT ROW", i)
                console.log("CURRENT COLUMN", j)
                console.log("\n \n \n")
                console.log("CURRENT SUDOKU", sudokuGrid)
                console.log("\n \n \n")
                squaresVisitsCount++
                console.log("SQUARES VISITS COUNT", squaresVisitsCount)
                if(sudokuGrid[i][j] === 0){
                    console.log("SQUARE ATTEMPTED BEGGINING ")
                    console.log("Blank square row", i)
                    console.log("Blank square column", j)
                    console.log("BACKTRACKING COUNT", backtrackingCounts)
                    squaresAttemptedCount++
                    console.log("SQUARES ATTEMPTED COUNT", squaresAttemptedCount)
                    console.log("CHECKING UNAVAILABLE NUMBERS FROM POSSIBLE DEAD END COMBINATIONS BEGGINING")
                    unavailableEnteringNumbersChoices = findWhatEnteredNumbersIntoRowAndColumnWillLeadToDeadEndEnteredNumbersCombinationsIfThatCanHappen(unavailableEnteringNumbersChoices, i, j, deadEndEnteredNumbersCombinations, currentEnteredNumbersCombination)
                    console.log("Unavailable entering numbers choices from possible dead end combinations", unavailableEnteringNumbersChoices)
                    console.log("CHECKING UNAVAILABLE NUMBERS FROM POSSIBLE DEAD COMBINATIONS END")
                    //Note unavailableEnteringNumbersChoicesFromDeadEndCommbinationsPool may be emmpty but we do not need to check for that 
                    if(unavailableEnteringNumbersChoices.length === 9){ // If our unavailable entering numbers choices cover the entire possible number choices range we have reached a dead end because unavailableEnteringNumbersChoices has unique values and we have numbers from one to nine only within our program so we add our currentCombination to the deadEndEnteredNumbersCombinations array 
                        console.log("DEAD END CASE BY DEAD END COMBINATION BEGINNING") 
                        deadEndEnteredNumbersCombinations.push([currentEnteredNumbersCombination].flat(1) as unknown as RowColumnEnteredValueTuple[])
                        performBacktracking = true 
                        //Next we go to a previously filled square within our same column, row or 3x3 block within the grid AND remove that element to enter a new one we update the currentColumn and currentRow values remove the value both from the sudoku and current combination and use it to uodate currentRow and currentColumn increase the blank square counter for our while loop and break the nested for loop 
                        backtrackingTargetPoint = returnRandomPreviouslyFilledSquareWithinCurrentSquaresRowColumnOr3x3BlockAsARowColumnValueTupleToEmptyItAndRefillIt(i, j, sudokuGrid, currentEnteredNumbersCombination, rowAndColumnIndicesWithinEachThreeByThreeSubgridWithinSudokuGrid)
                        //We remove our backtrackingTargetPoint value that is the value for our already filled square we are backtracking from from the sudoku grid and replace it with a zero AND we also remove it from currentEnteredNumbersCombination 
                        console.log("Square to be removed and backtracked", backtrackingTargetPoint)
                        console.log("Current entered numbers combination before removing square", currentEnteredNumbersCombination)
                        currentEnteredNumbersCombination = removeSquareValueFromSudokuAndSquareRowColumnAndValueFromCurrentEnteredNumbersCombination(sudokuGrid, currentEnteredNumbersCombination, backtrackingTargetPoint)
                        console.log("Current entered numbers combination after removal", currentEnteredNumbersCombination)
                        //We do not need to update current row and current column to redo the step the step will be redone in the next while loop's iteration because it is behind so when  the grid has been finished                   
                        numberOfBlankSquaresForWhileLoopCounter++ 
                        unavailableEnteringNumbersChoices = []
                        // console.log("PRINTING DEAD END COMBINATIONS BEGINNING")
                        // console.log(deadEndEnteredNumbersCombinations)
                        // console.log("PRINTING DEAD END COMBINATIONS END")
                        console.log("DEAD END CASE BY DEAD END COMBINATION END") 
                        console.log("SQUARE ATTEMPTED END DUE TO DEAD END BY COMBINATION")
                        break 
                    } // We don't need an else since we break within this if statements 
                    console.log("CHECKING UNAVAILABLE NUMBERS FROM REPEATED VALUES BEGGINING")
                    unavailableEnteringNumbersChoicesFromRepeatedValuesInRowColumnAndThreeByThreeGrid = findNumbersWithinRowColumnOrThreeByThreeBlockWhereWeFindOurselves(unavailableEnteringNumbersChoices, sudokuGrid, i, j, rowAndColumnIndicesWithinEachThreeByThreeSubgridWithinSudokuGrid)
                    for(var l = 0; l < unavailableEnteringNumbersChoicesFromRepeatedValuesInRowColumnAndThreeByThreeGrid.length; l++){
                        unavailableEnteringNumbersChoices.push(unavailableEnteringNumbersChoicesFromRepeatedValuesInRowColumnAndThreeByThreeGrid[l])
                    }
                    unavailableEnteringNumbersChoices = [... new Set(unavailableEnteringNumbersChoices)].filter((forbiddenNumbersToEnter) => forbiddenNumbersToEnter !== 0)
                    console.log("Unavailable entering numbers choices from repeated values", unavailableEnteringNumbersChoices)
                    console.log("CHECKING UNAVAILABLE NUMBERS FROM REPEATED VALUES END")
                    if(unavailableEnteringNumbersChoices.length === 9) {
                        console.log("DEAD END CASE BY REPEATED VALUES BEGINNING") 
                        if(deadEndEnteredNumbersCombinations.includes(currentEnteredNumbersCombination)) {console.log("Repeating forbidden combination")}
                        deadEndEnteredNumbersCombinations.push([currentEnteredNumbersCombination].flat(1) as unknown as RowColumnEnteredValueTuple[])
                        performBacktracking = true 
                        //Next we go to a previously filled square within our same column, row or 3x3 block within the grid AND remove that element to enter a new one we update the currentColumn and currentRow values remove the value both from the sudoku and current combination and use it to uodate currentRow and currentColumn increase the blank square counter for our while loop and break the nested for loop 
                        backtrackingTargetPoint = returnRandomPreviouslyFilledSquareWithinCurrentSquaresRowColumnOr3x3BlockAsARowColumnValueTupleToEmptyItAndRefillIt(i, j, sudokuGrid, currentEnteredNumbersCombination, rowAndColumnIndicesWithinEachThreeByThreeSubgridWithinSudokuGrid)
                        console.log("Square to be removed and backtracked", backtrackingTargetPoint)
                        console.log("Current entered numbers combination before removing square", currentEnteredNumbersCombination)
                        //We remove our backtrackingTargetPoint value that is the value for our already filled square we are backtracking from from the sudoku grid and replace it with a zero AND we also remove it from currentEnteredNumbersCombination 
                        currentEnteredNumbersCombination = removeSquareValueFromSudokuAndSquareRowColumnAndValueFromCurrentEnteredNumbersCombination(sudokuGrid, currentEnteredNumbersCombination, backtrackingTargetPoint)
                        console.log("Current entered numbers combination after removal", currentEnteredNumbersCombination)
                        numberOfBlankSquaresForWhileLoopCounter++ 
                        unavailableEnteringNumbersChoices = []
                        // console.log("PRINTING DEAD END COMBINATIONS BEGINNING")
                        // console.log(deadEndEnteredNumbersCombinations)
                        // console.log("PRINTING DEAD END COMBINATIONS END")
                        console.log("DEAD END CASE BY REPEATED VALUES END") 
                        console.log("SQUARE ATTEMPTED END DUE TO DEAD END BY REPEATED VALUES")
                        break 
                    }
                    //Here we add the number to the square if there are numbers to fill our square with which we have already checked and since the loop has not broken by this point our checks have been successful 
                    for(var l = 0; l < possibleNumberChoices.length; l++){
                        if(unavailableEnteringNumbersChoices.includes(possibleNumberChoices[l])){
                            continue
                        } else {
                            numbersThatWeCanEnterIntoThisBlankSquare.push(possibleNumberChoices[l])
                        }
                    }
                    console.log("ADDING NEW SQUARE BEGINNING")
                    console.log("Unavailable entering numbers for adding numbers", unavailableEnteringNumbersChoices)
                    console.log("Nummbers that we can enter into this blank square", numbersThatWeCanEnterIntoThisBlankSquare)
                    newNumberToBeAdded = numbersThatWeCanEnterIntoThisBlankSquare[Math.floor(Math.random() * numbersThatWeCanEnterIntoThisBlankSquare.length)] // We add the new number to our sudoku which is a random number from the numbers we can enter
                    sudokuGrid[i][j] = newNumberToBeAdded 
                    currentEnteredNumbersCombination.push([i, j, newNumberToBeAdded] as RowColumnEnteredValueTuple)
                    //La primera vez no está el past sudoku la segunda si y solo se hace esto al añadir un nuevo numbero esta claro que se repiten combinaciones
                    if(pastSudokus.includes(sudokuGrid)){ //Checking if program adds a value twice on the same square first we add the number then we run the check then we push becuase at the next iteration we are comparing against a pastly entered value
                        console.log("Sudoku repeating", sudokuGrid) //It should enter a new number at every moment so this should not be happening 
                    }
                    pastSudokus.push(sudokuGrid) //We know the first time it won't be repeated if we checked after we add it would be absurd but if check above is true that means we added  the number already because we are not pushing a second time 
                    numbersThatWeCanEnterIntoThisBlankSquare = []
                    unavailableEnteringNumbersChoices = []
                    numberOfBlankSquaresForWhileLoopCounter -= 1 
                    console.log("ADDING NEW SQUARE END")
                    console.log("SQUARE ATTEMPTED END")
                }
            }
            if(performBacktracking){
                performBacktracking = false 
                break 
            }
        }
    }
    return sudokuGrid
}

const findNumbersWithinRowColumnOrThreeByThreeBlockWhereWeFindOurselves = (unavailableEnteringNumbersChoices: number[], sudokuGrid: Grid, currentRow: number, currentColumn: number, rowAndColumnIndicesWithinEachThreeByThreeSubgridWithinSudokuGrid: ThreeByThreeBlockIndicesFromGrid) => {
    console.log("FINDING NUMBERS NOT TO BE REPEATED WITHIN SAME ROW COLUMN AND 3X3 GRID BEGINNINNG")
    var numbersWithinRow: number[] = []
    var numbersWithinColumn: number[] = []
    var numbersWithinThreeByThreeBlock: number[] = []
    var rowColumnIndicesFromThreeByThreeBlockWeFindOurselvesAt: Array<RowColumnIndicesFromThreeByThreeSubgridWithinGridTuple> = []
    for(var i = 0; i < 9; i++){
       if(currentColumn === i) {
        continue 
       }
       numbersWithinRow.push(sudokuGrid[currentRow][i])
    }
    for(var i = 0; i < 9; i++){
        if(currentRow === i){
            continue 
        }
        numbersWithinColumn.push(sudokuGrid[i][currentColumn])
    }
    rowColumnIndicesFromThreeByThreeBlockWeFindOurselvesAt = findThreeByThreeIndicesBlockWithinSudokuGridWhereCurrentRowAndCurrentColumnAreAt(currentRow, currentColumn, rowAndColumnIndicesWithinEachThreeByThreeSubgridWithinSudokuGrid)
    for(var i = 0; i < rowColumnIndicesFromThreeByThreeBlockWeFindOurselvesAt.length; i++){
        if(rowColumnIndicesFromThreeByThreeBlockWeFindOurselvesAt[i][0] === currentRow && rowColumnIndicesFromThreeByThreeBlockWeFindOurselvesAt[i][1] === currentColumn){
            continue 
        }
        numbersWithinThreeByThreeBlock.push(sudokuGrid[rowColumnIndicesFromThreeByThreeBlockWeFindOurselvesAt[i][0]][rowColumnIndicesFromThreeByThreeBlockWeFindOurselvesAt[i][1]]) //We get the row and column of this square within the three by three block and access the number from the sudoku grid 
    }
    unavailableEnteringNumbersChoices = addUnavailableEnteringNumbersChoicesFromGivenPoolToUnavailableEnteringNumbersChoices(unavailableEnteringNumbersChoices, numbersWithinRow)
    unavailableEnteringNumbersChoices = addUnavailableEnteringNumbersChoicesFromGivenPoolToUnavailableEnteringNumbersChoices(unavailableEnteringNumbersChoices, numbersWithinColumn)
    unavailableEnteringNumbersChoices = addUnavailableEnteringNumbersChoicesFromGivenPoolToUnavailableEnteringNumbersChoices(unavailableEnteringNumbersChoices, numbersWithinThreeByThreeBlock)
    console.log("NUMBERS WIITHIN ROW", numbersWithinRow)
    console.log("NUMBERS WITHIN COLUMN", numbersWithinColumn)
    console.log("NUMBERS WITHIN 3X3 BLOCK", numbersWithinThreeByThreeBlock)
    console.log("FINDING NUMBERS NOT TO BE REPEATED WITHIN SAME ROW COLUMN AND 3X3 GRID END")
    return unavailableEnteringNumbersChoices
}

const findThreeByThreeIndicesBlockWithinSudokuGridWhereCurrentRowAndCurrentColumnAreAt = (currentRow: number, currentColumn: number, rowAndColumnIndicesWithinEachThreeByThreeSubgridWithinSudokuGrid: ThreeByThreeBlockIndicesFromGrid): RowColumnIndicesFromThreeByThreeSubgridWithinGridTuple[] => {
    var threeByThreeBlockWithinThreeByThreeBlocksRowsAndColumnsIndicesWithinSudokuGridAtThisIndex:number = 0  
    var rowColumnWithinThisSpecificThreeByThreeGridWithinSudokuGridTuple: RowColumnIndicesFromThreeByThreeSubgridWithinGridTuple = [0, 0]
    var indicesFromThreeByThreeBlockWeFindOurselvesAt: Array<RowColumnIndicesFromThreeByThreeSubgridWithinGridTuple> = []
    var threeByThreeBlockWithinSudokuGridWhereCurrentRowAndColumnAreWasFound: boolean = false 
    for(var i = 0; i < rowAndColumnIndicesWithinEachThreeByThreeSubgridWithinSudokuGrid.length; i++){ //We run a first nested loop as we iterate within our rowAndColumnIndicesWithinEachThreeByThreeSubgridWithinSudokuGrid array to find the specific 3x3 block where currentRow and currentColumn are within the sudoku grid 
        threeByThreeBlockWithinThreeByThreeBlocksRowsAndColumnsIndicesWithinSudokuGridAtThisIndex = i //The three by three block within the 9x9 grid we find ourselves at in a top-to-bottom first left-to-right second order 
        for( var j = 0; j < rowAndColumnIndicesWithinEachThreeByThreeSubgridWithinSudokuGrid.length; j++){ //We iterate through a 3x3 block of 9x9 indices in the sudokku grid within this 3x3 block 
            rowColumnWithinThisSpecificThreeByThreeGridWithinSudokuGridTuple = rowAndColumnIndicesWithinEachThreeByThreeSubgridWithinSudokuGrid[threeByThreeBlockWithinThreeByThreeBlocksRowsAndColumnsIndicesWithinSudokuGridAtThisIndex][j]
            indicesFromThreeByThreeBlockWeFindOurselvesAt.push(rowColumnWithinThisSpecificThreeByThreeGridWithinSudokuGridTuple)
            if(rowColumnWithinThisSpecificThreeByThreeGridWithinSudokuGridTuple[0] === currentRow && rowColumnWithinThisSpecificThreeByThreeGridWithinSudokuGridTuple[1] === currentColumn) { //If current row and current colummn are within this 3x3 block
                threeByThreeBlockWithinSudokuGridWhereCurrentRowAndColumnAreWasFound = true 
            }
        }
        if(threeByThreeBlockWithinSudokuGridWhereCurrentRowAndColumnAreWasFound){
            return indicesFromThreeByThreeBlockWeFindOurselvesAt
            //Now we have the indicesFromThreeByThreeBlockWeFindOurselvesAt array with the indices belonging to the 3x3 block we are at 
        } else {
            indicesFromThreeByThreeBlockWeFindOurselvesAt = [] //We clear our current block array for the next iteration
        }
    }
    return indicesFromThreeByThreeBlockWeFindOurselvesAt
}

const removeSquareValueFromSudokuAndSquareRowColumnAndValueFromCurrentEnteredNumbersCombination = (sudokuGrid: Grid, currentEnteredNumbersCombination:RowColumnEnteredValueTuple[], backtrackingTargetPoint: RowColumnEnteredValueTuple) => {
    var newCurrentRow = backtrackingTargetPoint[0]
    var newCurrentColumn = backtrackingTargetPoint[1]
    sudokuGrid[newCurrentRow][newCurrentColumn] = 0 //We make the square blank again in the sudoku 
    currentEnteredNumbersCombination = currentEnteredNumbersCombination.filter((previouslyFilledSquare) => //And remove the square row column value tuple from currentEnteredNumbersCombination 
        previouslyFilledSquare !== backtrackingTargetPoint
    )
    return currentEnteredNumbersCombination
}

// Start of second part of our algorithm as explained in the top comment
const returnRandomPreviouslyFilledSquareWithinCurrentSquaresRowColumnOr3x3BlockAsARowColumnValueTupleToEmptyItAndRefillIt = (currentRow: number, currentColumn: number, sudokuGrid: Array<Array<number>>, currentEnteredNumbersCombination: RowColumnEnteredValueTuple[], rowAndColumnIndicesWithinEachThreeByThreeSubgridWithinSudokuGrid: ThreeByThreeBlockIndicesFromGrid)  : RowColumnEnteredValueTuple => {
    //This function is used to backtrack to a previous step and undo it to re do it again with a different value 
    //It finds previously added squares by checking whether a square in the current squares row column and 3x3 grid is found within the currentCombination parameter and data structure if so it is added to 
    // previouslyFilledSquaresWithinCurrentSquareRowColumnOr3x3BlockArray and then a random value from this array is picked as our backtracking point or target 
    //If the sudoku puzzle is well designed we know this function will always find at least one previously filled square because all squares should be fillable without any other squares having been filled in principle
    //In other words we cannot have a square with no possible number choices without taking into account a previously added square in the same row column and or 3x3 block otherwise it is a badly designned sudoku because you cannot add a starting value 
    //To this square and if that were the case the sudoku could not even be started nor solved 
    //Note if we reached a dead end becase we may end up getting a deadEndEnteredNumbersCombination if we add any number to our current square we do not need to backtrack to a previously filled element WITHIN the same sudoku row column and or 3x3 grid 
    //But what we know is that this function will be called after a dead end is reached for both the former and latter cases which are the only cases we can have for a dead end to occur 
    //Since this function is called WHEN a dead end condition is met we know we have to backtrack to any previously added value and empty that square to refill it with a new value 
    //The difference between cases is that in the former case any of the values within currentCombination will suffice for our purpose as a backtracking target point.
    //In the latter case tho if we want to add a new number to that specific square we need to change the values of previously added squares in our current sudokku grid row column and 3x3 
    //Since we have reached a dead end which means no new elements can be added any of those will suffice 
    //How do we know if we are in the former or latter case? 
    //Provided that we have a function that checks the sudoku is well designed as described at the beginning of this comment we know that if our previouslyFilledSquaresWithinCurrentSquareRowColumnOr3x3BlockArray is empty we are in the former case 
    //If on the contrary it is filled with one or more values we are in the latter although we could be in both cases at the same time too in which case the filled array scenario would also cover this new case and we would backtrack in the same fashion as
    //the second case. 
    var threeByThreeBlockWithinThreeByThreeBlocksRowsAndColumnsIndicesWithinSudokuGridAtThisIndex: number = 0 
    var rowColumnIndicesWithinThreeByThreeBlockWhereCurrentRowAndColumnAreLocated: RowColumnIndicesFromThreeByThreeSubgridWithinGridTuple = [0, 0]
    var rowColumnWithinThisSpecificThreeByThreeGridWithinSudokuGridTuple: RowColumnIndicesFromThreeByThreeSubgridWithinGridTuple = [0, 0]
    var previouslyFilledSquaresWithinCurrentSquareRowColumnOr3x3BlockArray: RowColumnEnteredValueTuple[] = []
    var previouslyFilledSquareAsRowColumnValueTuple: RowColumnEnteredValueTuple = [0, 0, 0]
    var sudokuGridsRowWhereWeAreLookingForAPreviouslyFilledSquareAsARowColumnValueTuple = currentRow
    var sudokuGridsColumnWhereWeAreLookingForAPreviouslyFilledSquareAsARowColumnValueTuple = currentColumn
    var potentialPreviouslyFilledSquareAsARowColumnValueTuple: RowColumnEnteredValueTuple = [0, 0, 0]
    var indicesFromThreeByThreeBlockWeFindOurselvesAt: Array<RowColumnIndicesFromThreeByThreeSubgridWithinGridTuple> = []
    var threeByThreeBlockWithinSudokuGridWhereCurrentRowAndColumnAreWasFound: boolean = false
    var backtrackingTargetPoint: RowColumnEnteredValueTuple = [0, 0, 0]
    //First we check the squares within our current row we found ourselves at in the grid looking for previously filled squares there 
    //We are looking for SQUARES within the row or traversing the row that is why we go column by column (the i variable represents the column)
    for(var i = 0; i < 9; i++){
        potentialPreviouslyFilledSquareAsARowColumnValueTuple[0] = sudokuGridsRowWhereWeAreLookingForAPreviouslyFilledSquareAsARowColumnValueTuple
        potentialPreviouslyFilledSquareAsARowColumnValueTuple[1] = i
        potentialPreviouslyFilledSquareAsARowColumnValueTuple[2] = sudokuGrid[sudokuGridsRowWhereWeAreLookingForAPreviouslyFilledSquareAsARowColumnValueTuple][i]
        if(sudokuGridsColumnWhereWeAreLookingForAPreviouslyFilledSquareAsARowColumnValueTuple === i){
            continue
        }
        if(currentEnteredNumbersCombination.includes(potentialPreviouslyFilledSquareAsARowColumnValueTuple)){
            previouslyFilledSquareAsRowColumnValueTuple = potentialPreviouslyFilledSquareAsARowColumnValueTuple
            previouslyFilledSquaresWithinCurrentSquareRowColumnOr3x3BlockArray.push(previouslyFilledSquareAsRowColumnValueTuple)
        }
    }
    //Next we check for previously added squares at our courrent column we go row by row to check all squares within this column (this time the i variable represents the row)
    for(var i = 0; i < 9; i++){ 
        potentialPreviouslyFilledSquareAsARowColumnValueTuple[0] = i 
        potentialPreviouslyFilledSquareAsARowColumnValueTuple[1] = sudokuGridsColumnWhereWeAreLookingForAPreviouslyFilledSquareAsARowColumnValueTuple
        potentialPreviouslyFilledSquareAsARowColumnValueTuple[2] = sudokuGrid[i][sudokuGridsColumnWhereWeAreLookingForAPreviouslyFilledSquareAsARowColumnValueTuple]
        if(sudokuGridsRowWhereWeAreLookingForAPreviouslyFilledSquareAsARowColumnValueTuple === i){
            continue
        }
        if(currentEnteredNumbersCombination.includes(potentialPreviouslyFilledSquareAsARowColumnValueTuple)){
            previouslyFilledSquareAsRowColumnValueTuple = potentialPreviouslyFilledSquareAsARowColumnValueTuple
            previouslyFilledSquaresWithinCurrentSquareRowColumnOr3x3BlockArray.push(previouslyFilledSquareAsRowColumnValueTuple)
        }
    }
    //Finally we check for previously filled squares within our 3x3 block 
    indicesFromThreeByThreeBlockWeFindOurselvesAt = findThreeByThreeIndicesBlockWithinSudokuGridWhereCurrentRowAndCurrentColumnAreAt(currentRow, currentColumn, rowAndColumnIndicesWithinEachThreeByThreeSubgridWithinSudokuGrid)
    for(var i = 0; i < indicesFromThreeByThreeBlockWeFindOurselvesAt.length; i++){
        rowColumnIndicesWithinThreeByThreeBlockWhereCurrentRowAndColumnAreLocated = indicesFromThreeByThreeBlockWeFindOurselvesAt[i]
        potentialPreviouslyFilledSquareAsARowColumnValueTuple[0] = rowColumnIndicesWithinThreeByThreeBlockWhereCurrentRowAndColumnAreLocated[0] //Row index
        potentialPreviouslyFilledSquareAsARowColumnValueTuple[1] = rowColumnIndicesWithinThreeByThreeBlockWhereCurrentRowAndColumnAreLocated[1] //Column index s
        if(potentialPreviouslyFilledSquareAsARowColumnValueTuple[0] === currentRow && potentialPreviouslyFilledSquareAsARowColumnValueTuple[1] === currentColumn){
            continue
        }
        potentialPreviouslyFilledSquareAsARowColumnValueTuple[2] = sudokuGrid[rowColumnIndicesWithinThreeByThreeBlockWhereCurrentRowAndColumnAreLocated[0]][rowColumnIndicesWithinThreeByThreeBlockWhereCurrentRowAndColumnAreLocated[1]] // Value 
        if(currentEnteredNumbersCombination.includes(potentialPreviouslyFilledSquareAsARowColumnValueTuple)) { //If this square within the 3x3 block where current row and current column variables are located has been filled by us before 
            previouslyFilledSquareAsRowColumnValueTuple = potentialPreviouslyFilledSquareAsARowColumnValueTuple
            previouslyFilledSquaresWithinCurrentSquareRowColumnOr3x3BlockArray.push(previouslyFilledSquareAsRowColumnValueTuple)
        }
    }
    previouslyFilledSquaresWithinCurrentSquareRowColumnOr3x3BlockArray = [... new Set(previouslyFilledSquaresWithinCurrentSquareRowColumnOr3x3BlockArray)] // We make it unique since we may have row or column values within our 3x3 block that alter the randomness of our choice 
    //We return a random value from here. Note if the array length is one since our value for the seed would be zero and we will return the only value there is in the array that is we would obtain index zero 
    if(previouslyFilledSquaresWithinCurrentSquareRowColumnOr3x3BlockArray.length > 0) { //If wee are in the second or third case backtrack to a square from previouslyFilledSquaresWithinCurrentSquareRowColumnOr3x3BlockArray
        backtrackingTargetPoint = previouslyFilledSquaresWithinCurrentSquareRowColumnOr3x3BlockArray[Math.floor(Math.random() * previouslyFilledSquaresWithinCurrentSquareRowColumnOr3x3BlockArray.length)]
        return backtrackingTargetPoint
    } else { //If we find ourselves in the first case (where any number we add to a new array will lead us to a dead end scenario) we backtrack to a square from currentCombination 
        backtrackingTargetPoint = currentEnteredNumbersCombination[Math.floor(Math.random() * currentEnteredNumbersCombination.length)]
        return backtrackingTargetPoint//We know in this case we must have filled squares already in our currentCombination array because we have reached a dead end situation by possible dead end combination resulting from any number typed in a square any possible dead combination must have at least TWO elements so our currentCombination array has at least one element which we can rewrite. Whenver that we reach this flow of execution branch currentCombination will be filled with values
    } //And that is not necessarily the scenario in the other two cases 
}


// The function that gets the starting value of the counter for our while loop at the start of our algorithm 
const findBlankSquaresAmountCounterForMainWhileLoop = (sudokuGrid: Array<Array<number>>) : number => {
    var blankSquaresCount: number = 0
    var currentRow: number = 0 
    var currentColumn: number = 0
    for(var i = 0; i < 9; i++){
        currentRow = i 
        for(var j = 0; j < 9; j++){
            currentColumn = j
            if(sudokuGrid[currentRow][currentColumn] === 0){
                blankSquaresCount++
            }
        }
    }
    return blankSquaresCount
}

const addUnavailableEnteringNumbersChoicesFromGivenPoolToUnavailableEnteringNumbersChoices = (unavailableEnteringNumbersChoices: number[], unavailableEnteringNumbersChoicesFromGivenPool: number[]) => {
    //We obtain unavailable entering numbers choices from two pools:
    //First pool: Numbers which if added to current row and column will lead to a dead end combination 
    //Second pool: Numbers found in the same column, row or 3x3 block the currentRow and currentColumn variables find themselves at 
    for(var i = 0; i < unavailableEnteringNumbersChoicesFromGivenPool.length; i++){
        unavailableEnteringNumbersChoices.push(unavailableEnteringNumbersChoicesFromGivenPool[i])
    }
    return [...new Set(unavailableEnteringNumbersChoices)].filter((unavailableNumber) => unavailableNumber != 0) 
}

//First part of our algorithm as explained in the top comment 
const findWhatEnteredNumbersIntoRowAndColumnWillLeadToDeadEndEnteredNumbersCombinationsIfThatCanHappen = (unavailableEnteredNumbersChoices: number[], currentRow: number, currentColumn: number, deadEndEnteredNumbersCombinations: RowColumnEnteredValueTuple[][], currentEnteredNumbersCombination: RowColumnEnteredValueTuple[]) : number[] => {
    var deadEndEnteredNumbersCombinationIndex = 0
    var enteredNumberIndexWithindeadEndEnteredNumbersCombination = 0
    var potentialMatchingEnteredNumberAtRowAndColumnWithinDeadEndCombinationWithCurrentRowAndColumn: RowColumnEnteredValueTuple = [0, 0, 0]
    var matchingEnteredNumberAtRowAndColumnWithinDeadEndCombinationWithCurrentRowAndColumn: RowColumnEnteredValueTuple = [0, 0, 0]
    var deadEndEnteredNumbersCombination: RowColumnEnteredValueTuple[] = []
    var unavailableEnteringNumbersChoicesFromDeadEndCombinations: number[] = []
    if(deadEndEnteredNumbersCombinations.length > 0){
        for(var i = 0; i < deadEndEnteredNumbersCombinations.length; i++) {
            //We iterathe through the different combinations 
            deadEndEnteredNumbersCombinationIndex = i 
            deadEndEnteredNumbersCombination = deadEndEnteredNumbersCombinations[deadEndEnteredNumbersCombinationIndex]
            for(var j = 0; j < deadEndEnteredNumbersCombination.length; j++){
                //We iterate through numbers in this given combination, and check if there is a row column match between any of its squares and currentRow and currentColumn variables (there should only be one such square match). If so we check if by adding the value of our row column match to our current combination at our CURRENT BLANK SQUARE we could get a deadEndCombination
                //We check that by checkking if each row column value element within this commbination except our match is equal to our current combination this we do in the only function we call within this function. If that is the case we should not add this number 
                //so we add it to our match number to unavailable entering numbers 
                //If it is not the case that adding that number to our current combiantion may lead us to a dead end we break the loop so the outer inner loop goes to the the next deadEndCombination to repeats the process 
                potentialMatchingEnteredNumberAtRowAndColumnWithinDeadEndCombinationWithCurrentRowAndColumn = deadEndEnteredNumbersCombination[j]
                if(potentialMatchingEnteredNumberAtRowAndColumnWithinDeadEndCombinationWithCurrentRowAndColumn[0] === currentRow && potentialMatchingEnteredNumberAtRowAndColumnWithinDeadEndCombinationWithCurrentRowAndColumn[1] === currentColumn){
                    matchingEnteredNumberAtRowAndColumnWithinDeadEndCombinationWithCurrentRowAndColumn = potentialMatchingEnteredNumberAtRowAndColumnWithinDeadEndCombinationWithCurrentRowAndColumn
                    if(checkIfCurrentEnteredNumbersCombinationCouldBecomeADeadEndCombinationIfWeAddMatchingValueAtCurrentRowColumn(currentEnteredNumbersCombination, deadEndEnteredNumbersCombination, matchingEnteredNumberAtRowAndColumnWithinDeadEndCombinationWithCurrentRowAndColumn) == true){
                        unavailableEnteringNumbersChoicesFromDeadEndCombinations.push(matchingEnteredNumberAtRowAndColumnWithinDeadEndCombinationWithCurrentRowAndColumn[2])
                    } else{
                        break
                    }
                }
            }
        }
        unavailableEnteredNumbersChoices = addUnavailableEnteringNumbersChoicesFromGivenPoolToUnavailableEnteringNumbersChoices(unavailableEnteredNumbersChoices, unavailableEnteringNumbersChoicesFromDeadEndCombinations)
        return unavailableEnteringNumbersChoicesFromDeadEndCombinations 
    }
    return unavailableEnteredNumbersChoices
} 

const checkIfCurrentEnteredNumbersCombinationCouldBecomeADeadEndCombinationIfWeAddMatchingValueAtCurrentRowColumn = (currentEnteredNumbersCombination: RowColumnEnteredValueTuple[], deadEndEnteredNumbersCombination: RowColumnEnteredValueTuple[], matchingEnteredNumberAtRowAndColumnWithinDeadEndCombinationWithCurrentRowAndColumn: RowColumnEnteredValueTuple) : boolean=> {
    var currentEnteredNumberWithinDeadEndCombination: RowColumnEnteredValueTuple = [0, 0, 0]
    var currentCombinationAndCurrentDeadEndEnteredNumbersCombinationContainSameItemsWithoutIncludingOurMatch: boolean = false 
    var weAreAtTheCurrentMatchSoLeaveItOut: boolean = false 
    for(var i = 0; i < deadEndEnteredNumbersCombination.length; i++){
        currentEnteredNumberWithinDeadEndCombination = deadEndEnteredNumbersCombination[i]
        if(matchingEnteredNumberAtRowAndColumnWithinDeadEndCombinationWithCurrentRowAndColumn === currentEnteredNumberWithinDeadEndCombination){
            weAreAtTheCurrentMatchSoLeaveItOut
            continue
        }
        if(currentEnteredNumbersCombination.includes(currentEnteredNumberWithinDeadEndCombination)) { // We found a bug there might be cases where the element is included in which case it will be set to true but it could be false in which case it is set to false and so the boolean toggles but does not show whether there is a total match or not 
            currentCombinationAndCurrentDeadEndEnteredNumbersCombinationContainSameItemsWithoutIncludingOurMatch = true 
        } 
        if(currentCombinationAndCurrentDeadEndEnteredNumbersCombinationContainSameItemsWithoutIncludingOurMatch === false && weAreAtTheCurrentMatchSoLeaveItOut === false){
            return currentCombinationAndCurrentDeadEndEnteredNumbersCombinationContainSameItemsWithoutIncludingOurMatch //The value here will be false and it must be true at the end of every loop's cycle 
        }
    }
    return currentCombinationAndCurrentDeadEndEnteredNumbersCombinationContainSameItemsWithoutIncludingOurMatch //This value will be true if we reach this step 
}

//End of first part of the algorithm as explained in the top comment 

var sudoku = [[0, 0, 9, 0, 1, 0, 0, 3, 0], 
[0, 0, 0, 7, 6, 0, 0, 0, 9],
[0, 7, 3, 0, 0, 8, 0, 5, 0],
[7, 2, 0, 0, 0, 9, 1, 0, 0],
[9, 0, 6, 8, 3, 0, 5, 0, 0],
[0, 0, 5, 0, 0, 2, 0, 9, 0],
[6, 9, 4, 0, 5, 0, 3, 0, 0],
[8, 0, 2, 3, 0, 6, 0, 7, 5],
[0, 5, 0, 2, 0, 4, 0, 1, 6]]

var generatedSudoku = generateSudoku(9, 3) //first argument is board dimension second argument difficulty from one to five 
console.log(sudokuSolver(generateSudoku(9, 3)))

 