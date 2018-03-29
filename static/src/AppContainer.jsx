import React, { Component } from 'react';
import App from './App';

class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size : 6,
            cluster: new Set(),
            clusters: [],
            selected: new Set(),
            solution: [],
        };
    }

    isLegalCluster = (cluster) => {
        let size = cluster.length;
        let start = cluster.keys().next().value; // Not very elegant, but we need a starting
        //cluster.add(start);        // value from the set.
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
        if (this.state.solution.length === 1) {
            alert("Puzzle has no solution.");
            return;
        }
        let selected = this.state.selected;
        let clusters = this.state.clusters;
        for (let i = 0; i < clusters.length; ++i) {
            for (let j = 0; j < clusters[i].length; ++j) {
                let cell = clusters[i][j];
                cell.classList.remove("committed");
                cell.classList.remove("selected");
                cell.classList.add("default");
                if (this.state.solution.length >= 3) {
                    cell.innerHTML = this.state.solution[i][j];
                }
            }
        }
        selected.forEach(function(cell) {
            cell.classList.remove("selected");
            cell.classList.add("default");
            selected.delete(cell);
        });

        this.setState({
            size: e.target.value,
            cluster: new Set(),
            clusters: [],
            selected: new Set(),
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
        let cluster = this.state.cluster;
        let selected = this.state.selected;

        if (cluster.length === 0) {
            cluster.add(y * 10 + x);
            selected.add(cell);
        }
        cell.classList.toggle("selected");
        cell.classList.toggle("default");
        if (cluster.has(y * 10 + x)) {
            cluster.delete(y * 10 + x);
            selected.delete(cell);
        } else {
            cluster.add(y * 10 + x);
            selected.add(cell);
        }

        this.setState({
            cluster, // alternatively: key: value
            selected,
        });
    }

    commitCluster = (e) => {
        // Let's add some logic in here to confirm that clusters are legal!
        if (!this.isLegalCluster(this.state.cluster)) {
            alert("Error. Cluster cells must be connected.");
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const clusterArray = Array.from(this.state.cluster);
        const selectedArray = Array.from(this.state.selected);
        const op = document.getElementById("op").value;
        const total = document.getElementById("num").valueAsNumber;

        if (!this.isLegalOperatorAndTotal(op, total, clusterArray)) {
            return;
        }
        for (let i = 0; i < selectedArray.length; i++) {
            let coordinates = clusterArray[i];

            if (!this.state.cluster.has(coordinates+10)) {
                selectedArray[i].classList.add("bottom_border");
            }
            if (!this.state.cluster.has(coordinates-10)) {
                selectedArray[i].classList.add("top_border");
            }
            if (!this.state.cluster.has(coordinates+1)) {
                selectedArray[i].classList.add("right_border");
            }
            if (!this.state.cluster.has(coordinates-1)) {
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
        }).then(function(solution) {
            solution = JSON
            console.log(solution);
            console.log(solution.length);
            if (solution.length > 0) {
                this.displaySolution(solution);
            }
        });

        this.state.clusters.push(selectedArray);
        this.setState({
            cluster: new Set(),
            selected: new Set(),
        })
    }

    displaySolution = (solution) => {
        alert("You are here");
        return;
        if (solution.length === 0) {
            return;
        } else if (solution.length === 1) {
            alert("Puzzle could not be solved!");
            return;
        } else {

        }
    }


    render() {
        return (
            <App
                size={this.state.size}
                updateGrid={this.updateGrid}
                addToCluster={this.addToCluster}
                commitCluster={this.commitCluster}
            />
        )
    }
}

export default AppContainer;
