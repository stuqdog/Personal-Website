'''to add: a method for reducing the possible set for items in a row/column where
a confirmed cell exists. i.e., if a cell == 3, then no cell in the same row/column
should have 3 in its possible set.'''


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

    def solve(self):
        self.cells = sorted(self.cells, key=lambda x: len(x.possible))
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
        if len(cell.possible) == 1:
            cell.actual = sum(cell.possible)
            return self.can_be_solved(i+1)
        else:
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
        current state is potentially legal, false otherwise.'''
        x, y = cell.x, cell.y
        for row in range(self.size):
            if row == y:
                continue
            if self.grid[row][x].actual == cell.actual:
                return False

        for column in range(self.size):
            if column == x:
                continue
            if self.grid[y][column].actual == cell.actual:
                return False

        values = [c.actual for c in cell.cluster.cells if c.actual]
        operator, value = cell.operator, cell.value
        unknown_cells = cell.cluster.cluster_size - len(values)

        if operator == '+':
            if unknown_cells == 0:
                if sum(values) != value:
                    return False
            diff = value - sum(values)
            if diff < unknown_cells:
                return False
            elif diff > unknown_cells * self.size:
                return False

        elif operator == '-':
            if unknown_cells == 0:
                if abs(values[0] - values[1]) != value:
                    return False

        elif operator == '*':
            cur_val = 1
            for val in values:
                cur_val *= val

            if unknown_cells == 0:
                if cur_val != value:
                    return False

            if value % cur_val:
                return False

        elif operator == '/':
            if unknown_cells == 0:
                denom, numer = sorted(values)
                if numer // denom != value:
                    return False
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
    puzzle = [
        64,
        {'cells': [0, 10], 'operator': '*', 'value': 28},
        {'cells': [1, 2], 'operator': '*', 'value': 15},
        {'cells': [3, 4], 'operator': '-', 'value': 5},
        {'cells': [5, 6], 'operator': '+', 'value': 15},
        {'cells': [7, 17], 'operator': '-', 'value': 2},
        {'cells': [11, 12], 'operator': '+', 'value': 7},
        {'cells': [13, 23], 'operator': '/', 'value': 2},
        {'cells': [14, 24], 'operator': '-', 'value': 1},
        {'cells': [15, 25], 'operator': '-', 'value': 5},
        {'cells': [16, 26], 'operator': '/', 'value': 2},
        {'cells': [20, 21, 22], 'operator': '+', 'value': 14},
        {'cells': [27, 37], 'operator': '-', 'value': 2},
        {'cells': [30, 40], 'operator': '+', 'value': 8},
        {'cells': [31, 41], 'operator': '-', 'value': 2},
        {'cells': [42, 32, 33], 'operator': '*', 'value': 392},
        {'cells': [34, 44], 'operator': '/', 'value': 2},
        {'cells': [35], 'operator': '=', 'value': 2},
        {'cells': [36, 46], 'operator': '-', 'value': 2},
        {'cells': [50, 60], 'operator': '-', 'value': 2},
        {'cells': [51, 61], 'operator': '/', 'value': 4},
        {'cells': [52, 62, 72], 'operator': '+', 'value': 12},
        {'cells': [43, 53, 54], 'operator': '+', 'value': 9},
        {'cells': [45, 55], 'operator': '+', 'value': 10},
        {'cells': [47, 57], 'operator': '-', 'value': 7},
        {'cells': [70, 71], 'operator': '/', 'value': 4},
        {'cells': [63, 73], 'operator': '*', 'value': 6},
        {'cells': [74, 64, 65], 'operator': '*', 'value': 56},
        {'cells': [56, 66, 67], 'operator': '+', 'value': 18},
        {'cells': [75, 76, 77], 'operator': '+', 'value': 15}
    ]

    solve_puzzle(puzzle)

if __name__ == "__main__":
    main()
