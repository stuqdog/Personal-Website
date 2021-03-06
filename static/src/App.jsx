import React, { Component } from 'react';
import logo from './logo.svg';

// Components
import SizeUpdater from './SizeUpdater';
import Grid from './Grid';
import AssignToCluster from './AssignToCluster';
import SubmitPuzzle from './SubmitPuzzle';
import './App.css';


const App = props => (
    <div>
        <SizeUpdater
            size={props.size}
            updateGrid={props.updateGrid}
            />
        <Grid
            size={props.size}
            addToCluster={props.addToCluster}
        />
        <SubmitPuzzle
            solvePuzzle={props.solvePuzzle}
            />
        <AssignToCluster
            commitCluster={props.commitCluster}
        />
    </div>
);

export default App;


// PuzzleSizer
// Grid
//  OperatorSelector
//  Cell
