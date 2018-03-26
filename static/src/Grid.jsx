import React, { Component } from 'react';
import range from 'lodash/range';
import './App.css';

const Grid = (props) => {
    const xGrid = range(props.size).map((item) => (
            <td key={`x${item}`}></td>
    ));

    const yGrid = range(props.size).map((yItem) => (
        <tr key={yItem}>
            {
                range(props.size).map((xItem) => (
                    <td key={`${yItem}${xItem}`}
                        onClick={(e) => props.addToCluster(e.target, yItem, xItem)}>
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
    // <table cellspacing='0'>
    //     {% for y in range(size - 1) %}
    //         <tr>
    //             <td class="left" id ="{{ y }}-0"
    //                 onclick="addToCluster(this, {{ y }}, 0)"></td>
    //
    //             {% for x in range(size - 1) %}
    //                 <td id ="{{ y }}-{{ x + 1 }}"
    //                     onclick="addToCluster(this, {{y}}, {{x+1}})"></td>
    //
    //             {% endfor %}
    //         </tr>
    //     {% endfor %}
    //     <tr>
    //         <td class="left bottom" id ="{{ size-1 }}-0"
    //             onclick="addToCluster(this, {{size - 1}}, 0)"></td>
    //
    //         {% for x in range(size - 1) %}
    //             <td class="bottom" id = "{{ size - 1 }}{{ x + 1 }}"
    //                 onclick="addToCluster(this, {{size-1}}, {{x+1}})"></td>
    //
    //         {% endfor %}
    //     </tr>
    // </table>

export default Grid;
