import sys

from app import app
from flask import Flask, jsonify, render_template, flash, redirect, request, Response
# from app.forms import LoginForm
import json
from solver import solve_puzzle

clusters = [0]
puzzle_size = 0


class Cell():

    def __init__(self, y, x):
        self.x = x
        self.y = y


@app.route('/receiver', methods=['POST'])
def worker():
    data = request.get_json()
    clusters.append(data)
    clusters[0] += len(data["cells"])
    print(clusters[0], puzzle_size)

    ''' CHECK OUT THIS STUFF RIGHT HERE. YOU SHOULD do_something(clusters)'''
    if clusters[0] == puzzle_size:
        solve_puzzle(clusters)

    print(data)
    return "A thing"

@app.route('/', methods=['GET', 'POST'])

@app.route('/index', methods=['GET', 'POST'])
@app.route('/static')
def index():
    global puzzle_size
    size = int(request.form.get("size", 6))
    puzzle_size = size ** 2
    puzzle = [[Cell(y, x) for x in range(size)] for y in range(size)]
    return render_template('index.html', title='Home', size=size)#, puzzle=puzzle) #op=op)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Login requested for user {}, remember_me={}'.format(
            form.username.data, form.remember_me.data))
        return redirect(url_for('index'))
    return render_template('login.html', title = 'Sign in', form = form)
