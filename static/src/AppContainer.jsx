/* General thoughts:
1) No need to pass anything to Python until we're ready to solve. Keep track of
size and confirming that we're ready to solve on the js side, and then when
someone says "Hey, solve the puzzle" then js will check that we're in a position
to solve. If we are, then we'll pass the data to python.
2) Related, sorta: Add ways for people to fix clusters that they misassigned.
How do we want to do this? Maybe have each cell have a pointer to the cluster
that it belongs to? Hmm. Gotta think about that.
3) How do we add clusters? At what point do we add op and total to the array? Maybe as a dict?
*/


import React, { Component } from 'react';
import App from './App';

class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size : 6,
            clusterCoordinates: new Set(),
            clusters: [],
            clusterCells: new Set(),
        };
    }

    solvePuzzle = () => {
        let committedCells = 0;
        let clusters = this.state.clusters;
        for (let i = 0; i < clusters.length; ++i) {
            committedCells += clusters[i].length;
        }
        if (committedCells !== Math.pow(this.state.size, 2)) {
            alert("Cannot solve a puzzle unless all cells have been declared.");
            return;
        }
        alert(committedCells);
        console.log("You're in solvePuzzle!");
        const jsonPuzzle = clusters.map(cluster => cluster.map(cell => parseInt(cell.id, 10)));
        const op = document.getElementById("op").value;
        const total = document.getElementById("num").valueAsNumber;
        console.log(jsonPuzzle);
        fetch('/static', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                size: e.target.value,
            }),
        }).catch(error => console.log("Error is: " + error))
        return;
    }

    isLegalCluster = (cluster) => {
        /* Before we commit a cluster, we need to confirm that it's legal
        (all cells connected, two cells for div/sub, one cell for ==, etc.) */
        let start = cluster.keys().next().value; // There has to be a better way than this.
        let check_connectivity = new Set();
        let check_array = [start];
        while (check_array.length > 0) {
            let node = check_array.pop();
            if (cluster.has(node) && !check_connectivity.has(node)) {
                check_array.push(node-1);
                check_array.push(node-10);
                check_array.push(node+1);
                check_array.push(node+10);
                check_connectivity.add(node);
            }
        }
        if (check_connectivity.size === cluster.size) {
            return true;
        }
        return false;
    }

    isLegalOperatorAndTotal = (op, total, clusterArray) =>  {
        if (!op || !total || total < 0) {
            alert("Error. Invalid operator sign or total value.");
            return false;
        } else if (total % 1 !== 0) {
            alert("Hey! whole numbers only >:(");
            return false;
        } else if ((op === '/' || op === '-') && clusterArray.length !== 2) {
            alert("Error. Division and subtraction require exactly two cells.");
            return false;
        } else if (op === '=' && clusterArray.length !== 1) {
            alert("Error. Equality operator can only take a single cell.");
            return false;
        } else if (op !== '=' && clusterArray.length === 1) {
            alert("Error. Non-equality operators require at least two cells.");
            return false;
        } else {
            return true;
        }
    }

    updateGrid = (e) => {
        let clusterCells = this.state.clusterCells;
        let clusters = this.state.clusters;
        for (let i = 0; i < clusters.length; ++i) {
            for (let j = 0; j < clusters[i].length; ++j) {
                let cell = clusters[i][j];
                cell.className = "";
                cell.classList.add("default");
                cell.innerHTML = ' ?';
            }
        }
        clusterCells.forEach(function(cell) {
            cell.classList.remove("selected");
            cell.classList.add("default");
            clusterCells.delete(cell);
        });

        this.setState({
            size: e.target.value,
            clusterCoordinates: new Set(),
            clusters: [],
            clusterCells: new Set(),
            solved: false,
        });
        fetch('/static', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                size: e.target.value,
            }),
        }).catch(error => console.log("Error is: " + error))
    }



    addToCluster = (cell, y, x) => {
        if (cell.classList.contains("committed")) {
            alert("This cell is already committed, sorry!");
            return;
        }
        let cluster = this.state.clusterCoordinates;
        let clusterCells = this.state.clusterCells;

        if (cluster.length === 0) {
            cluster.add(y * 10 + x);
            clusterCells.add(cell);
        }
        cell.classList.toggle("selected");
        cell.classList.toggle("default");
        if (cluster.has(y * 10 + x)) {
            cluster.delete(y * 10 + x);
            clusterCells.delete(cell);
        } else {
            cluster.add(y * 10 + x);
            clusterCells.add(cell);
        }

        this.setState({
            cluster, // alternatively: key: value
            clusterCells,
        });
    }

    displaySolution = (solution) => {
        if (solution.length === 0) {
            return;
        } else if (solution.length === 1) {
            alert("Puzzle has no valid solution.");
            return;
        } else {
            for (let i = 0; i < this.state.clusters.length; ++i) {
                for (let j = 0; j < this.state.clusters[i].length; ++j) {
                    let cell = this.state.clusters[i][j];
                    let cellID = parseInt(cell.id, 10);
                    let x = cellID % 10;
                    let y = (cellID - x) / 10;
                    cell.innerHTML = solution[y][x];
                }
            }
        }
    }

    commitCluster = (e) => {
        // Let's add some logic in here to confirm that clusters are legal!
        if (!this.isLegalCluster(this.state.clusterCoordinates)) {
            alert("Error. Cluster cells must be connected.");
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const clusterArray = Array.from(this.state.clusterCoordinates);
        let selectedArray = Array.from(this.state.clusterCells);
        const op = document.getElementById("op").value;
        const total = document.getElementById("num").valueAsNumber;

        if (!this.isLegalOperatorAndTotal(op, total, clusterArray)) {
            return;
        }

        for (let i = 0; i < selectedArray.length; i++) {
            let coordinates = clusterArray[i];

            if (!this.state.clusterCoordinates.has(coordinates+10)) {
                selectedArray[i].classList.add("bottom_border");
            }
            if (!this.state.clusterCoordinates.has(coordinates-10)) {
                selectedArray[i].classList.add("top_border");
            }
            if (!this.state.clusterCoordinates.has(coordinates+1)) {
                selectedArray[i].classList.add("right_border");
            }
            if (!this.state.clusterCoordinates.has(coordinates-1)) {
                selectedArray[i].classList.add("left_border");
            }

            selectedArray[i].classList.add("committed");
            selectedArray[i].classList.remove("selected");
            selectedArray[i].classList.remove("default");
            selectedArray[i].innerHTML = op + total;
        }

        fetch(
            '/receiver',
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    cells: clusterArray,
                    operator: op,
                    value: total,
                }),
            }
        ).catch(error => console.log("Error is: " + error)
        ).then(solution => {
            return solution.json();
        }).then(solution => {
            let jsonSolution = JSON.parse(solution);
            console.log(jsonSolution);
            if (jsonSsolution.length > 0) {
                this.displaySolution(jsonSolution);
            }
        });

        this.state.clusters.push(selectedArray);
        this.setState({
            clusterCoordinates: new Set(),
            clusterCells: new Set(),
        })
    }


    render() {
        return (
            <App
                size={this.state.size}
                updateGrid={this.updateGrid}
                addToCluster={this.addToCluster}
                commitCluster={this.commitCluster}
                solvePuzzle={this.solvePuzzle}
            />
        )
    }
}

export default AppContainer;
