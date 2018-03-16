from app import app
from flask import render_template, flash, redirect, request
from app.forms import LoginForm

class Cell():

    def __init__(self, y, x):
        self.x = x
        self.y = y

@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
@app.route('/static')
def index():
    # user = {'username': 'Ethan'}
    # posts = [
    #     {
    #         'author': {'username': 'John'},
    #         'body': 'Blah blah test test'
    #     },
    #     {
    #         'author': {'username': 'Joan'},
    #         'body': 'Test two'
    #     }
    # ]
    size=6
    operator = "+"
    size = int(request.form.get("size", size))
    operator = request.form.get("operator") or operator
    puzzle = [[Cell(y, x) for x in range(size)] for y in range(size)]
    return render_template('index.html', title='Home', operator=operator, size=size, puzzle=puzzle)
    # return render_template('index.html', title='Home', user=user, operator=operator, size=size, puzzle=puzzle)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Login requested for user {}, remember_me={}'.format(
            form.username.data, form.remember_me.data))
        return redirect(url_for('index'))
    return render_template('login.html', title = 'Sign in', form = form)
