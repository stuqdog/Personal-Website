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
            solved: false,
        };
    }

    changeSize = (e) => {
        this.setState({
            size: e.target.value,
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
        let cluster = this.state.cluster;
        let selected = this.state.selected;

        if (cluster.length === 0) {
            cluster.add(y * 10 + x);
            selected.add(cell);
        }
        cell.classList.toggle("selected");
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
        e.preventDefault();
        e.stopPropagation();
        const clusterArray = Array.from(this.state.cluster);
        const selectedArray = Array.from(this.state.selected);
        const sign = document.getElementById("op").value;
        const total = document.getElementById("num").valueAsNumber;
        if (!sign || !total || total < 0) {
            alert("Error. Invalid operator sign or total value.");
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
                    operator: sign,
                    value: total,
                }),
            },
        ).catch(error => console.log("Error is: " + error))

        this.setState({
            cluster: new Set(),
            selected: new Set(),
        })
    }


    render() {
        return (
            <App
                size={this.state.size}
                changeSize={this.changeSize}
                addToCluster={this.addToCluster}
                commitCluster={this.commitCluster}
            />
        )
    }
}

export default AppContainer;
