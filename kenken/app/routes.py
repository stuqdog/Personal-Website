import sys

from app import app
from flask import Flask, jsonify, render_template, flash, redirect, request, Response
# from app.forms import LoginForm
import json
import solver

''' first element of clusters is the number of cells in clusters. when it is
 equal to the size of the puzzle in blocks, we've added every block. This is a
 stopgap though. Eventually we'll want to add functionality to modify clusters
 that have already been submitted, and add a submit button that allows for
 submitting the puzzle. The submit button will send along the actual size,
 and we can compare clusters to that without mixing up the kind of data
 we're storing in clusters.'''
clusters = [0]
puzzle_size = 0 # size of the actual puzzle. We compare clusters[0] to this.
solution = 10


@app.route('/receiver', methods=['POST'])
def worker():
    data = request.get_json()
    clusters.append(data)
    print(clusters)
    clusters[0] = sum(len(clusters[x]['cells']) for x in range(1, len(clusters)))

    if clusters[0] == puzzle_size:
        solution = solver.solve_puzzle(clusters)

    return json.dumps('[test]') #json.dumps(["test"]) #json.dumps(["A thing"])

@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
@app.route('/static', methods=['POST'])
def index():
    global puzzle_size
    global clusters
    clusters = [0]
    data = request.get_json()
    size = int(data["size"]) if data else 6
    puzzle_size = size ** 2
    return render_template('index.html', title='Home', solution=solution)

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     form = LoginForm()
#     if form.validate_on_submit():
#         flash('Login requested for user {}, remember_me={}'.format(
#             form.username.data, form.remember_me.data))
#         return redirect(url_for('index'))
#     return render_template('login.html', title = 'Sign in', form = form)
