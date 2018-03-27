class Cluster():
    def __init__(self, cluster_size):
        self.cells = []
        self.cluster_size = cluster_size

class Cell():
    def __init__(self, y, x, cluster, possible, operator, value, actual=None):
        self.y = y
        self.x = x
        self.cluster = cluster
        self.possible = possible
        self.operator = operator
        self.value = value
        self.actual = actual

class Solution():
    def __init__(self, size):
        self.size = size
        self.clusters = []
        self.cells = []
        self.grid = [[0 for i in range(size)] for x in range(size)]

    def sort_cells(self):
        self.cells = sorted(self.cells, key=lambda x: len(x.possible))

    def solve(self):
        self.sort_cells()
        if self.can_be_solved():
            for row in self.grid:
                for i, cell in enumerate(row):
                    row[i] = cell.actual
            print(self.grid)
            return self.grid
        else:
            print("No valid solution could be found!")

    def can_be_solved(self, i=0):
        if i == self.size ** 2: # We've assigned to every cell at this point
            return True         # without any collision, so we're done!
        cell = self.cells[i]

        if cell.operator == '=':
            cell.actual = cell.possible.pop()
            return self.can_be_solved(i+1)
        for value in cell.possible:
            cell.actual = value
            if self.is_legal_state(cell):
                if self.can_be_solved(i+1):
                    return True
        cell.actual = None # No value for cell is valid given current board,
                           # so we go back up the recursive stack
        return False

    def is_legal_state(self, cell):
        '''Checks if the current state is potentially legal by checking for
        value collisions by row/column, and checking that the cluster is still
        capable of being solved given current values. Return true if the
        current state is potentially legal, otherwise false.'''
        x, y, actual = cell.x, cell.y, cell.actual
        for row in range(self.size):
            if row == y:
                continue
            if self.grid[row][x].actual == actual:
                return False

        for column in range(self.size):
            if column == x:
                continue
            if self.grid[y][column].actual == actual:
                return False

        values = [c.actual for c in cell.cluster.cells if c.actual]
        operator, value = cell.operator, cell.value
        unknown_cells = cell.cluster.cluster_size - len(values)

        if operator == '+':
            if not unknown_cells:
                return (sum(values) == value)
            diff = value - sum(values)
            return (diff >= unknown_cells and diff <= unknown_cells * self.size)

        elif operator == '-':
            if not unknown_cells:
                return (abs(values[0] - values[1]) == value)

        elif operator == '*':
            cur_val = 1
            for val in values:
                cur_val *= val
            if not unknown_cells:
                return (cur_val == value)
            if value % cur_val:
                return False

        elif operator == '/':
            if not unknown_cells:
                denom, numer = sorted(values)
                return (numer // denom == value)

        return True


def find_possible(size, cluster_size, operator, value):
    '''finds and returns a set of all values from 1 to size (inclusive) that
    could potentially fit in a cell, given its formula requirements. (e.g., a
    cluster with two cells and a value of *35 can only consist of a 5 and a 7,
    so there's no need to consider any other values for those two cells).'''
    if operator == '+':
        min_value = max(1, value - ((cluster_size-1) * size))
        max_value = min(size, value + 1 - cluster_size)
        possible = set(range(min_value, max_value + 1))
    elif operator == '*':
        possible = {x for x in range(1, size+1) if value % x == 0}
    elif operator == '/':
        possible = set()
        for x in range(1, size // value + 1):
            possible.add(x)
            possible.add(x * value)
    elif operator == '-':
        possible = set()
        for x in range(1, 1 + size - value):
            possible.add(x)
            possible.add(x + value)
    elif operator == '=':
        possible = {value}
    else:
        print("Error: invalid operator. Please select +, -, *, /, or =.")
        # Should throw an error here.
    return possible


def solve_puzzle(clusters):
    '''This initializes everything. Creates classes out of the raw data we
    receive, then calls the methods that will actually solve the puzzle.
    '''
    size = int(clusters[0] ** .5)
    solution = Solution(size)
    for i, cluster in enumerate(clusters):
        if i == 0: # First value of clusters is puzzle size, not an actual cluster
            continue # we can probably fix that, though.
        cluster_size, operator, value = (
            len(cluster['cells']), cluster['operator'], cluster['value'])
        possible = find_possible(size, cluster_size, operator, value)
        new_cluster = Cluster(cluster_size)
        for cell in cluster['cells']:
            x = cell % 10
            y = (cell - x) // 10
            new_cell = Cell(y, x, new_cluster, possible, operator, value)
            new_cluster.cells.append(new_cell)
            solution.grid[y][x] = new_cell
            solution.cells.append(new_cell)
        solution.clusters.append(new_cluster)
    solution.solve()


def main():

      # an easy 4x4 puzzle
#     puzzle = [
#         16,
#         {'cells': [[0, 0]], 'operator': '=', 'value': 3},
#         {'cells': [[1, 0], [2, 0]], 'operator': '+', 'value': 3},
#         {'cells': [[0, 1], [0, 2]], 'operator': '-', 'value': 3},
#         {'cells': [[0, 3], [1, 3]], 'operator': '/', 'value': 2},
#         {'cells': [[1, 1], [1, 2], [2, 1]], 'operator': '*', 'value': 12},
#         {'cells': [[2, 2], [2, 3]], 'operator': '-', 'value': 1},
#         {'cells': [[3, 3]], 'operator': '=', 'value': 1},
#         {'cells': [[3, 0], [3, 1], [3, 2]], 'operator': '*', 'value': 24},
#     ]
#

    # a moderately difficult 8x8
    # puzzle = [
    #     64,
    #     {'cells': [0, 10], 'operator': '*', 'value': 28},
    #     {'cells': [1, 2], 'operator': '*', 'value': 15},
    #     {'cells': [3, 4], 'operator': '-', 'value': 5},
    #     {'cells': [5, 6], 'operator': '+', 'value': 15},
    #     {'cells': [7, 17], 'operator': '-', 'value': 2},
    #     {'cells': [11, 12], 'operator': '+', 'value': 7},
    #     {'cells': [13, 23], 'operator': '/', 'value': 2},
    #     {'cells': [14, 24], 'operator': '-', 'value': 1},
    #     {'cells': [15, 25], 'operator': '-', 'value': 5},
    #     {'cells': [16, 26], 'operator': '/', 'value': 2},
    #     {'cells': [20, 21, 22], 'operator': '+', 'value': 14},
    #     {'cells': [27, 37], 'operator': '-', 'value': 2},
    #     {'cells': [30, 40], 'operator': '+', 'value': 8},
    #     {'cells': [31, 41], 'operator': '-', 'value': 2},
    #     {'cells': [42, 32, 33], 'operator': '*', 'value': 392},
    #     {'cells': [34, 44], 'operator': '/', 'value': 2},
    #     {'cells': [35], 'operator': '=', 'value': 2},
    #     {'cells': [36, 46], 'operator': '-', 'value': 2},
    #     {'cells': [50, 60], 'operator': '-', 'value': 2},
    #     {'cells': [51, 61], 'operator': '/', 'value': 4},
    #     {'cells': [52, 62, 72], 'operator': '+', 'value': 12},
    #     {'cells': [43, 53, 54], 'operator': '+', 'value': 9},
    #     {'cells': [45, 55], 'operator': '+', 'value': 10},
    #     {'cells': [47, 57], 'operator': '-', 'value': 7},
    #     {'cells': [70, 71], 'operator': '/', 'value': 4},
    #     {'cells': [63, 73], 'operator': '*', 'value': 6},
    #     {'cells': [74, 64, 65], 'operator': '*', 'value': 56},
    #     {'cells': [56, 66, 67], 'operator': '+', 'value': 18},
    #     {'cells': [75, 76, 77], 'operator': '+', 'value': 15}
    # ]

    # a very difficult 9x9
    puzzle = [
    81,
    {'cells': [0, 1, 2, 10, 20], 'operator': '+', 'value': 21},
    {'cells': [3, 4, 5, 14], 'operator': '*', 'value': 60},
    {'cells': [6, 7, 8, 18, 28], 'operator': '+', 'value': 25},
    {'cells': [11, 12], 'operator': '-', 'value': 6},
    {'cells': [13, 23], 'operator': '+', 'value': 11},
    {'cells': [15, 25], 'operator': '-', 'value': 4},
    {'cells': [16, 17], 'operator': '+', 'value': 13},
    {'cells': [21, 31], 'operator': '+', 'value': 8},
    {'cells': [22], 'operator': '=', 'value': 8},
    {'cells': [24], 'operator': '=', 'value': 2},
    {'cells': [26], 'operator': '=', 'value': 9},
    {'cells': [27, 37], 'operator': '+', 'value': 11},
    {'cells': [30, 40, 41, 50], 'operator': '+', 'value': 24},
    {'cells': [32, 33], 'operator': '+', 'value': 13},
    {'cells': [34, 43, 44, 45, 54], 'operator': '+', 'value': 25},
    {'cells': [35, 36], 'operator': '-', 'value': 3},
    {'cells': [38, 47, 48, 58], 'operator': '+', 'value': 17},
    {'cells': [42], 'operator': '=', 'value': 2},
    {'cells': [46], 'operator': '=', 'value': 3},
    {'cells': [51, 61], 'operator': '-', 'value': 1},
    {'cells': [52, 53], 'operator': '+', 'value': 13},
    {'cells': [55, 56], 'operator': '-', 'value': 1},
    {'cells': [57, 67], 'operator': '+', 'value': 11},
    {'cells': [60, 70, 80, 81, 82], 'operator': '+', 'value': 26},
    {'cells': [62], 'operator': '=', 'value': 1},
    {'cells': [63, 73], 'operator': '*', 'value': 16},
    {'cells': [64], 'operator': '=', 'value': 6},
    {'cells': [65, 75], 'operator': '+', 'value': 12},
    {'cells': [66], 'operator': '=', 'value': 7},
    {'cells': [68, 78, 86, 87, 88], 'operator': '+', 'value': 25},
    {'cells': [71, 72], 'operator': '-', 'value': 1},
    {'cells': [74, 83, 84, 85], 'operator': '*', 'value': 378},
    {'cells': [76, 77], 'operator': '*', 'value': 3}
    ]

    solve_puzzle(puzzle)

if __name__ == "__main__":
    main()
