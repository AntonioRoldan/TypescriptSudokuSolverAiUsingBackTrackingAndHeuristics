import {Grid, ThreeByThreeBlockIndicesFromGrid, ThreeByThreeBlockWeFindOurselvesAt, RowColumnIndicesFromThreeByThreeSubgridWithinGridTuple, RowColumnEnteredValueTuple} from "./util/types"
//SUDOKU SOLVER IN TYPESCRIPT USING BACKTRACKING 

const sudokuSolver = (sudokuGrid: Grid = []) => {
    
    // Algorithm behavior: 

    //The algorithm tries to add a valid (not repeated in the same column, row and 3x3 block within the grid) number to each blank cell as it iterates 
    //through the grid while keeping track of the combination of numbers that have been entered in the grid to make the current entered numbers combination (these are stored in the currentCombination 
    //array as a length three tuple with row column and value in this order).
    //If it cannot enter any valid number at a square it adds the current combination of entered numbers to an array containing dead end combinations and undoes one random already 
    //taken step or square from currentEnteredNumbersCombination there are two ways in which the number is picked which will be explainsed further below 
    //(this is why we are using the backtracking target point variable this variable is our chosen step to be undone) and iterates the grid from the beginning again.

    //The algorithm checks that the current combination of entered numbers it keeps track of does not coincide with a previously found invalid combination of entered numbers 
    //if we add a new number or numbers from our 1-9 choices. What we are doing is we are checking what entering numbers at the current blank square give us a dead end combination at this specific square to not repeat ourselves. 

    //If they give us a dead end combination they are declared invalid and as such added to invalidEnteringNumbersChoices
    //We keep track of invalid combinations by adding them to a data structure whenever we find a dead end (square with no valid numbers to be entered) this data structure is deadEndEnteredNumbersCombinations.
    //This all happens within a while loop that uses a condition checking that the number of blank squares is greatesr than zero for it to keep running.

    //As we add elements we decrease this variable and if we remove them we decrease it.
    //So there are two kinds of invalid numbers the ones that lead to already found dead end combinations and those which can be found in the same row, column or 3x3 grid as the blank row and column we find ourselves at
    //We check for both conditions and after each check fill the invalidEnteringNumbersChoices array based on them. And after filling the array we check
    
    //if we run out of valid numbers to enter at that specific square (in which case invalidEnteringNumbersChoices.length is nine because we make it unique and 
    //can only add numbers from one to nine) we backtrack.
    //If not we add a new number using the array to know what numbers we can add by comparing it to possible numbers choices. If we run out of valid numbers 
    //we add the currentEnteredNumbersCombination to the dead end combinations array and pick a random pastly entered number from our same column row or
    // 3x3 grid OR any pastly entered number it depends on whether we reached a dead end because of possible dead end combinations we may reach adding any number
    // from our 1-9 choices OR if it is due to repeated values these are the two different strategies used depending on the situation although I suspect they are equivalent.
    
    //We take the number that we picked and remove it from the sudoku and its row column value tuple from currentEnteredNumbersCombination we subtract the loop's conditional variable. 
    //And then the inner grid iterating for loop is broken if no valid numbers are found and an extra boolean variable is set to break the outer for loop and iterate through the grid again in the next while loops iteration
    //If on the contrary there are valid numbers we add a random number from that set of valid numbers to our square in the sudoku grid 2D array and add a new tuple to the currentEnteredNumbersCombination data structure.
    //Of course we have to decrease the while loop's conditional variable (that is the amount of blank squares left) by one in this case.
    
    //Note the program backtracks to a previously filled square within the same column row or 3x3 grid of no invalid numbers 
    //were found or by checking a random previously entered square in the case where what happens is that we have run out of numbers to add without ending up in a dead end combination 

    //Note: The algorithm checks for numbers within the same 3x3 row by using an extra array containing the row column indices contained 
    //within each 3x3 block wiithin the 9x9 sudokku grid (this variable is called rowAndColumnIndicesWithinEachThreeByThreeSubgridWithinSudokuGrid)
    //It iterates through this array keeping track of the square we find ourselves at and compare the row column values with each row column pair 
    // within each block and if there is a match it knows what block it is in then by storing that block it uses the indices to extract the values from the 9x9 grid 
    //TODO: REFACTOR CODE 

    var numberOfBlankSquaresForWhileLoopCounter: number = 0
    var backtrackingTargetPoint: RowColumnEnteredValueTuple = [0, 0, 0] //The square we are emptying to refill it with a new valid value that gets us out of the dead end 
    var possibleNumberChoices: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9] //The algorithm will iterate through this numbers after filling the unavailableNumbers array if the number is not found in the unavailableNumbers array- The algorithm will fill the blank with that number 
    var invalidEnteringNumbersChoices: number[] = [] //Numbers found on the same row, on the same column or on the same 3x3 grid or as part of a dead end combination. which we cannot repeat the number that the algorithm will enter in a blank square will be a number that is not found within this array BUT is found in the possibleNumberChoices array
    var numbersThatWeCanEnterIntoThisBlankSquare: number[] = []
    var performBacktracking: boolean = false 
    var newNumberToBeAdded: number = 0 
    var deadEndEnteredNumbersCombinations: RowColumnEnteredValueTuple[][] = [] //We will check if a number we are going to enter at any given time is found here at the same row and column ALONG with the rest of the currentEnteredNumbers commbination of rows columns numbers if so we add that number to unavailableNumbersForEntering  
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
    var squaresVisitsCount = 0
    numberOfBlankSquaresForWhileLoopCounter  = findBlankSquaresAmountCounterForMainWhileLoop(sudokuGrid)
    
    while(numberOfBlankSquaresForWhileLoopCounter > 0){
        backtrackingCounts++
        console.log("BACKTRACKING START IF THIS IS SHOWN SECOND TIME BACKTRACKING COUNTS NUMBER FOLLOWS SUBTRACT ONE FROM IT", backtrackingCounts)
        for(var i = 0; i < 9; i++){ // We set our index variables to current row and current column since we will update this values and break the loops if performBackTracking is set to true as part of our backtracking process in order to undo combinations try another combination with a different value from a previously added value that we may be removing if we reach a dead end 
            for(var j = 0; j < 9; j++){ //From the current row and current column variables we will keep iterating through the grid from top to bottom first left to right second 
                console.log("SQUARE VISITED START")
                console.log("CURRENT ROW", i)
                console.log("CURRENT COLUMN", j)
                console.log("\n \n \n")
                console.log("\n \n \n")
                squaresVisitsCount++
                console.log("SQUARES VISITS COUNT", squaresVisitsCount)
                if(sudokuGrid[i][j] === 0){
                    console.log("CURRENT SUDOKU", sudokuGrid)
                    console.log("SQUARE ATTEMPTED BEGGINING ")
                    console.log("Blank square row", i)
                    console.log("Blank square column", j)
                    console.log("BACKTRACKING COUNT", backtrackingCounts)
                    squaresAttemptedCount++
                    console.log("SQUARES ATTEMPTED COUNT", squaresAttemptedCount)
                    console.log("CHECKING UNAVAILABLE NUMBERS FROM POSSIBLE DEAD END COMBINATIONS BEGGINING")
                    findWhatEnteredNumbersIntoRowAndColumnWillLeadToDeadEndEnteredNumbersCombinationsIfThatCanHappen(invalidEnteringNumbersChoices, i, j, deadEndEnteredNumbersCombinations, currentEnteredNumbersCombination)
                    console.log("Unavailable entering numbers choices from possible dead end combinations", invalidEnteringNumbersChoices)
                    console.log("CHECKING UNAVAILABLE NUMBERS FROM POSSIBLE DEAD COMBINATIONS END")
                    //Note unavailableEnteringNumbersChoicesFromDeadEndCommbinationsPool may be emmpty but we do not need to check for that 
                    if(invalidEnteringNumbersChoices.length === 9){ // If our unavailable entering numbers choices cover the entire possible number choices range we have reached a dead end because unavailableEnteringNumbersChoices has unique values and we have numbers from one to nine only within our program so we add our currentCombination to the deadEndEnteredNumbersCombinations array 
                        console.log("DEAD END CASE BY DEAD END COMBINATION BEGINNING") 
                        deadEndEnteredNumbersCombinations.push(currentEnteredNumbersCombination)
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
                        invalidEnteringNumbersChoices = []
                        // console.log("PRINTING DEAD END COMBINATIONS BEGINNING")
                        // console.log(deadEndEnteredNumbersCombinations)
                        // console.log("PRINTING DEAD END COMBINATIONS END")
                        console.log("DEAD END CASE BY DEAD END COMBINATION END") 
                        console.log("SQUARE ATTEMPTED END DUE TO DEAD END BY COMBINATION")
                        break 
                    } // We don't need an else since we break within this if statements 
                    console.log("CHECKING UNAVAILABLE NUMBERS FROM REPEATED VALUES BEGGINING")
                    findNumbersWithinRowColumnOrThreeByThreeBlockWhereWeFindOurselves(invalidEnteringNumbersChoices, sudokuGrid, i, j, rowAndColumnIndicesWithinEachThreeByThreeSubgridWithinSudokuGrid)
                    console.log("Unavailable entering numbers choices from repeated values", invalidEnteringNumbersChoices)
                    console.log("CHECKING UNAVAILABLE NUMBERS FROM REPEATED VALUES END")
                    if(invalidEnteringNumbersChoices.length === 9) {
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
                        invalidEnteringNumbersChoices = []
                        // console.log("PRINTING DEAD END COMBINATIONS BEGINNING")
                        // console.log(deadEndEnteredNumbersCombinations)
                        // console.log("PRINTING DEAD END COMBINATIONS END")
                        console.log("DEAD END CASE BY REPEATED VALUES END") 
                        console.log("SQUARE ATTEMPTED END DUE TO DEAD END BY REPEATED VALUES")
                        break 
                    }
                    //Here we add the number to the square if there are numbers to fill our square with which we have already checked and since the loop has not broken by this point our checks have been successful 
                    for(var l = 0; l < possibleNumberChoices.length; l++){
                        if(invalidEnteringNumbersChoices.includes(possibleNumberChoices[l])){
                            continue
                        } else {
                            numbersThatWeCanEnterIntoThisBlankSquare.push(possibleNumberChoices[l])
                        }
                    }
                    console.log("ADDING NEW SQUARE BEGINNING")
                    console.log("Unavailable entering numbers for adding numbers", invalidEnteringNumbersChoices)
                    console.log("Nummbers that we can enter into this blank square", numbersThatWeCanEnterIntoThisBlankSquare)
                    newNumberToBeAdded = numbersThatWeCanEnterIntoThisBlankSquare[Math.floor(Math.random() * numbersThatWeCanEnterIntoThisBlankSquare.length)] // We add the new number to our sudoku which is a random number from the numbers we can enter
                    sudokuGrid[i][j] = newNumberToBeAdded 
                    currentEnteredNumbersCombination.push([i, j, newNumberToBeAdded] as RowColumnEnteredValueTuple)
                    //La primera vez no está el past sudoku la segunda si y solo se hace esto al añadir un nuevo numbero esta claro que se repiten combinaciones
                    numbersThatWeCanEnterIntoThisBlankSquare = []
                    invalidEnteringNumbersChoices = []
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

const findNumbersWithinRowColumnOrThreeByThreeBlockWhereWeFindOurselves = (unavailableEnteringNumbersChoices: number[], sudokuGrid: Grid, currentRow: number, currentColumn: number, rowAndColumnIndicesWithinEachThreeByThreeSubgridWithinSudokuGrid: ThreeByThreeBlockIndicesFromGrid) : void => {
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
    unavailableEnteringNumbersChoices
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
const findWhatEnteredNumbersIntoRowAndColumnWillLeadToDeadEndEnteredNumbersCombinationsIfThatCanHappen = (unavailableEnteredNumbersChoices: number[], currentRow: number, currentColumn: number, deadEndEnteredNumbersCombinations: RowColumnEnteredValueTuple[][], currentEnteredNumbersCombination: RowColumnEnteredValueTuple[]) : void => {
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
    }
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
        } else {
            currentCombinationAndCurrentDeadEndEnteredNumbersCombinationContainSameItemsWithoutIncludingOurMatch = false
        }
        if(currentCombinationAndCurrentDeadEndEnteredNumbersCombinationContainSameItemsWithoutIncludingOurMatch === false && weAreAtTheCurrentMatchSoLeaveItOut === false){
            return currentCombinationAndCurrentDeadEndEnteredNumbersCombinationContainSameItemsWithoutIncludingOurMatch //The value here will be false and it must be true at the end of every loop's cycle 
        }
    }
    return currentCombinationAndCurrentDeadEndEnteredNumbersCombinationContainSameItemsWithoutIncludingOurMatch //This value will be true if we reach this step 
}

//End of first part of the algorithm as explained in the top comment 

var sudoku = [[0, 0, 9, 0, 1, 0, 0, 3, 0], //Easy sudokku 
[0, 0, 0, 7, 6, 0, 0, 0, 9],
[0, 7, 3, 0, 0, 8, 0, 5, 0],
[7, 2, 0, 0, 0, 9, 1, 0, 0],
[9, 0, 6, 8, 3, 0, 5, 0, 0],
[0, 0, 5, 0, 0, 2, 0, 9, 0],
[6, 9, 4, 0, 5, 0, 3, 0, 0],
[8, 0, 2, 3, 0, 6, 0, 7, 5],
[0, 5, 0, 2, 0, 4, 0, 1, 6]]

 sudoku = [[3, 7, 0, 0, 6, 2, 0, 0, 0], //Easy sudokku 
[0, 2, 9, 1, 0, 0, 7, 0, 0],
[5, 0, 1, 0, 0, 0, 9, 2, 8],
[8, 0, 0, 4, 9, 6, 1, 0, 7],
[0, 4, 0, 0, 1, 0, 0, 9, 6],
[1, 0, 6, 7, 5, 3, 0, 0, 4],
[9, 8, 4, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 3, 0],
[6, 1, 0, 0, 2, 0, 5, 4, 0]]

 sudoku = [[0, 8, 0, 0, 0, 0, 0, 7, 2], //Hard sudoku 
[2, 5, 0, 0, 0, 4, 0, 0, 1],
[0, 1, 0, 0, 0, 0, 5, 4, 9],
[5, 0, 1, 3, 0, 7, 0, 0, 0],
[0, 7, 0, 0, 0, 0, 0, 1, 5],
[4, 2, 0, 1, 0, 8, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 9, 6],
[8, 0, 0, 0, 6, 9, 0, 0, 7],
[1, 0, 0, 0, 0, 0, 2, 8, 0]]

var sudokuPuzzle = JSON.parse(JSON.stringify(sudoku))
sudoku = [[0, 8, 0, 0, 0, 0, 0, 7, 2], //Hard sudoku 
[2, 5, 0, 0, 0, 4, 0, 0, 1],
[0, 1, 0, 0, 0, 0, 5, 4, 9],
[5, 0, 1, 3, 0, 7, 0, 0, 0],
[0, 7, 0, 0, 0, 0, 0, 1, 5],
[4, 2, 0, 1, 0, 8, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 9, 6],
[8, 0, 0, 0, 6, 9, 0, 0, 7],
[1, 0, 0, 0, 0, 0, 2, 8, 0]]

console.log("Solution", sudokuSolver(sudoku))
console.log("Original sudoku puzzle", sudokuPuzzle)

 