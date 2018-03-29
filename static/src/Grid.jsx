import React, { Component } from 'react';
import range from 'lodash/range';
import './App.css';

const Grid = (props) => {

    const yGrid = range(props.size).map((yItem) => (
        <tr key={yItem}>
            {
                range(props.size).map((xItem) => (
                    <td key={`${yItem}${xItem}`} className="default" id={`${yItem}${xItem}`}
                        onClick={(e) => props.addToCluster(e.target, yItem, xItem)}>
                        ?
                    </td>

                ))
            }
        </tr>
    ));
    return (
        <table cellSpacing='0'>
            <tbody>
                {yGrid}
            </tbody>
        </table>
    )
}

export default Grid;
