let cluster = new Set(); // Global on purpose. though I'm a js
const clusters = []; // newbie so there's probably a better way!
let selected = new Set();
let solved = false;

function addToCluster(cell, y, x) {
    y = parseInt(y);
    x = parseInt(x);
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
}

function commitCluster() {
    const clusterArray = Array.from(cluster);
    const selectedArray = Array.from(selected);
    const sign = document.getElementById("op").value;
    const total = document.getElementById("num").valueAsNumber;
    if (!sign || !total) {
        alert("Error. Invalid operator sign or total value.");
        return;
    }

    for (let i = 0; i < selectedArray.length; i++) {
        let coordinates = clusterArray[i];

        if (!cluster.has(coordinates+10)) {
            selectedArray[i].classList.add("bottom_border");
        }
        if (!cluster.has(coordinates-10)) {
            selectedArray[i].classList.add("top_border");
        }
        if (!cluster.has(coordinates+1)) {
            selectedArray[i].classList.add("right_border");
        }
        if (!cluster.has(coordinates-1)) {
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

    cluster = new Set();
    selected = new Set();
}
