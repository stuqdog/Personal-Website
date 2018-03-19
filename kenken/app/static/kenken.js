cluster = new Set(); // Global on purpose. though I'm a js
clusters = []; // newbie so there's probably a better way!
selected = [];
var size = document.querySelector("#size");

function addToCluster(cell, y, x) {
    if (cluster.has([y, x])) {
        cluster.delete([y, x]);
    } else {
        cluster.add([y, x]);
        // document.getElementById("test").innerHTML = cluster.values().next().value;
    }
    cell.classList.toggle("selected");
    selected.push(cell);
}

function commitCluster() {
    var sign = document.getElementById("op").value;
    var total = document.getElementById("num").valueAsNumber;
    console.log(sign);
    console.log(total);
    for (var i = 0; i < selected.length; i++) {
        selected[i].classList.add("committed");
        selected[i].classList.remove("selected");
    }
    var newCluster = [sign, total, cluster];
    clusters.push(newCluster);
    cluster = new Set();
}

document.getElementById("test").innerHTML = "TEST";
