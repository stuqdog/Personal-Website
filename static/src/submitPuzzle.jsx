import React, { Component } from 'react';


const submitPuzzle = props => (
    <div>
        Puzzle Sizersz <br />
        <select name="size" id="size"
            onChange={(e) => props.updateGrid(e) }
            value={props.size}
        >
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
        </select>
    </div>
);

export default submitPuzzle;


// import React, { Component } from 'react';
//
// const submitPuzzle = props => {
//     return(
//         <div>
//             <h1> TEST </h1>
//             <input type="number" id="num"></input>
//             <select name="operator" id="op">
//                 <option value="+">+</option>
//                 <option value="-">-</option>
//                 <option value="/">/</option>
//                 <option value="*">*</option>
//                 <option value="=">=</option>
//             </select>
//             <form action="#" onClick={e => props.solvePuzzle(e)}>
//                 <input type="button" value="Solve puzzle."></input>
//             </form>
//         </div>
//     )
// }
//
// export default submitPuzzle;
