import React, { Component } from 'react';


const SizeUpdater = props => (
    <div>
        Puzzle Size <br />
        <select name="size" id="size"
            onChange={(e) => props.updateGrid(e) }
            value={props.size}
        >
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
        </select>
    </div>
);

export default SizeUpdater;
