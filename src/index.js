import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// prop -> propreties
// state -> components remember things
// you need to always call super when defining the constructor of a subclass
// class Square extends React.Component {
//     // constructor(props) {
//     //     super(props);
//     //     this.state = { // it is consider private
//     //         value: null,
//     //     };
//     // }
//
//     render() {
//         return (
//             //when we click on a square it executes smthing
//             //we are passing a function as the onCLick pro
//             // now it displays the square's state
//             //putting on different lines for better readability
//             <button
//                 className="square"
//                 onClick={() => this.props.onClick()}
//             >
//                 {this.props.value}
//             </button>
//         );
//     }
// }

//Display the location for each move in the format (col, row) in the move history list.

//component function
function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        //Each Square will now receive a value prop that will
        //either be 'X', 'O', or null for empty squares.
        //we cannot update the Board's state directly from Square
        //because state is considered private
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const rowCount = 3, colCount = 3;
        return (
            <div>
                {[...new Array(rowCount)].map((row, rowIndex) => {
                    return (
                        <div className="board-row" key={rowIndex}>
                            {[...new Array(colCount)].map((col, colIndex) => this.renderSquare(rowIndex*colCount + colIndex) )}
                        </div>
                    )
                })
                }
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            //setting the first move as X by default
            xIsNext: true,
            isAscending: false,
        };
        //The bind() method creates a new function that,
        //when called, has its this keyword set to the provided value
        this.toggleAscend = this.toggleAscend.bind(this);
    }

    handleClick(i) {
        //The Square/Board components are now controlled components
        //The Game has full control over them
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        //ignoring a click if someone has won or if a Square is filled
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
                currentPosition: getPosition(i),
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,

        });

    }

    toggleAscend() {
        this.setState({
            isAscending: !this.state.isAscending,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        //uses the most recent history to determine the game's status
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const isAscending = this.state.isAscending ? 'Ascending' : 'Descending';

        const moves = history.map((step, move) => {
            if(this.state.isAscending) {
                move = history.length - 1 - move;
                const currentPos = step.currentPosition;
                const desc = move ?
                    'Go to move #' + move + ' ' + currentPos :
                    'Go to game start';
                //move - number of the move from the history table , stepNumber - current(after clicking) number
                if ( move === this.state.stepNumber ) {
                    return (
                        React.createElement("li", { key: move },
                            React.createElement("button", { onClick: () => this.jumpTo(move) }, React.createElement("b", null, desc))));
                } else {
                    return (
                        React.createElement("li", { key: move },
                            //the third argument is the child
                            React.createElement("button", { onClick: () => this.jumpTo(move) }, desc)));
                }

                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>
                            {desc}
                        </button>
                    </li>
                );
            } else {
                const currentPos = step.currentPosition;
                const desc = move ?
                    'Go to move #' + move + ' ' + currentPos :
                    'Go to game start';
                //move - number of the move from the history table , stepNumber - current(after clicking) number
                if ( move === this.state.stepNumber ) {
                    return (
                        React.createElement("li", { key: move },
                            React.createElement("button", { onClick: () => this.jumpTo(move) }, React.createElement("b", null, desc))));
                } else {
                    return (
                        React.createElement("li", { key: move },
                            //the third argument is the child
                            React.createElement("button", { onClick: () => this.jumpTo(move) }, desc)));
                }

                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>
                            {desc}
                        </button>
                    </li>
                );
            }
        })

        let status;
        if(winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                    <button onClick={this.toggleAscend}>
                        {isAscending}
                    </button>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function getPosition(square) {
    const positions = {
        0: '(1, 1)',
        1: '(1, 2)',
        2: '(1, 3)',
        3: '(2, 1)',
        4: '(2, 2)',
        5: '(2, 3)',
        6: '(3, 1)',
        7: '(3, 2)',
        8: '(3, 3)',
    }

    return positions[square];
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for(let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        // T && T?F && T?F
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);