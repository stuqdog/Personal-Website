import React, { Component } from 'react';

const SubmitPuzzle = props => {
    return(
        <div>
            <form action="#" onClick={e => props.solvePuzzle(e)}>
                <input type="button" value="Solve puzzle..." id="solve"></input>
            </form>
        </div>
    )
}

export default SubmitPuzzle;
