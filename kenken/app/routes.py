import sys

from app import app
from flask import Flask, jsonify, render_template, flash, redirect, request, Response
# from app.forms import LoginForm
import json
import solver

clusters = [0] # first element is # of blocks in clusters. when it equals the
               # size of the puzzle in blocks, we've added every block.
puzzle_size = 0 # size of the actual puzzle. We compare clusters[0] to this.


class Cell():

    def __init__(self, y, x):
        self.x = x
        self.y = y


@app.route('/receiver', methods=['POST'])
def worker():
    data = request.get_json()
    clusters.append(data)
    clusters[0] = sum(len(clusters[x]['cells']) for x in range(1, len(clusters)))
    print(clusters[0], puzzle_size)

    ''' CHECK OUT THIS STUFF RIGHT HERE. YOU SHOULD do_something(clusters)'''
    if clusters[0] == puzzle_size:
        solver.solve_puzzle(clusters)

    print(data)
    return "A thing"

@app.route('/', methods=['GET', 'POST'])

@app.route('/index', methods=['GET', 'POST'])
@app.route('/static', methods=['POST'])
def index():
    global puzzle_size
    global clusters
    clusters = [0]
    data = request.get_json()
    print(data)
    size = int(data["size"]) if data else 6
    puzzle_size = size ** 2
    puzzle = [[Cell(y, x) for x in range(size)] for y in range(size)]
    return render_template('index.html', title='Home', size=size)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Login requested for user {}, remember_me={}'.format(
            form.username.data, form.remember_me.data))
        return redirect(url_for('index'))
    return render_template('login.html', title = 'Sign in', form = form)
