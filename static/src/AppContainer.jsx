/* General thoughts:

1. Currently, clusters are passed to Python as soon as they are filled. This is simpler
because it means we don't have to find a clean way to store all clusters, but it's probably
not ideal. When the ability to reassign to clusters is added, it'll be a lot less cumbersome
if Python doesn't also have to delete clusters. Need to think about the best way to store all
the clusters and their formulae.
1a. Thoughts: have cell html somehow contain an indicator for finding clusters. Probably
through classes. This will likely be faster, but puts logic work into the html which seems
clunky.
1b. Asymptotically slow solution, when a cell is clicked just search through all committed
clusters until that cell is found. It's O(n), where n is the number of currently committed
cells. But, (n) will never be larger than 81 so there's a pretty tight bound.
2) Probably best to store clusters as dictionaries within a list, and then send that list to
Python. That is consistent with how Python reads the data anyway; we'd just send the whole
thing at once instead of one at a time. Added advantage of eliminating the one global
variable in routes.py.
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
        /* Checks to see if all cells have been committed. If they have, sends an update to
        Python backend to start solving the puzzle. Then, retrieves results from Python. */
        let committedCells = 0;
        let clusters = this.state.clusters;
        for (let i = 0; i < clusters.length; ++i) {
            committedCells += clusters[i].length;
        }
        if (committedCells !== Math.pow(this.state.size, 2)) {
            alert("Cannot solve a puzzle unless all cells have been declared.");
            return;
        }
        fetch('/solver', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
        }).catch(error => console.log("Error is: " + error)
        ).then(solution => {
            return solution.json();
        }).then(solution => {
            let jsonSolution = JSON.parse(solution);
            this.displaySolution(jsonSolution);
        });
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
        /* Checks that the operator and total submitted obey basic rules, e.g. subtraction
        and division can only take two cells and equality can only take one cell. */
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
        /* resets the grid size and erases any assigned clusters or cells */
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
    }



    addToCluster = (cell, y, x) => {
        /* Adds a selected cell to the current cluster */
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
        /* If a legal solution is received from solvePuzzle, updates puzzle to display it.
        Otherwise, alerts the user that there is no legal solution. */
        if (solution.length === 0) {
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
        /* Calls legality checks to confirm the cluster obeys rules. If it does, the cluster
        data is sent to Python in preparation for puzzle solving. */
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
        ).catch(error => console.log("Error is: " + error));
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
