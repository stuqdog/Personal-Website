import React, { Component } from 'react';
import logo from './logo.svg';

// Components
import SizeUpdater from './SizeUpdater';
import Grid from './Grid';
import ClusterAssigner from './ClusterAssigner';
import './App.css';


const App = props => (
    <div>
        <SizeUpdater
            size={props.size}
            changeSize={props.changeSize}
            />
        <Grid
            size={props.size}
            addToCluster={props.addToCluster}
        />
        <ClusterAssigner
            commitCluster={props.commitCluster}
        />
    </div>
);

export default App;


// PuzzleSizer
// Grid
//  OperatorSelector
//  Cell
