import sys

from app import app
from flask import Flask, jsonify, render_template, flash, redirect, request, Response
import json
import solver

clusters = []


@app.route('/receiver', methods=['POST'])
def worker():
    global clusters
    data = request.get_json()
    clusters.append(data)
    return 'test test test'

@app.route('/solver', methods=['POST'])
def solve():
    print(clusters)
    solution = solver.solve_puzzle(clusters)
    return json.dumps(str(solution))

@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
@app.route('/static', methods=['POST'])
def index():
    return render_template('index.html', title='Home')
