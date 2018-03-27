import React, { Component } from 'react';

const AssignToCluster = props => {
    return(
        <div>
            <input type="number" id="num"></input>
            <select name="operator" id="op">
                <option value="+">+</option>
                <option value="-">-</option>
                <option value="/">/</option>
                <option value="*">*</option>
                <option value="=">=</option>
            </select>
            <form action="#" onClick={e => props.commitCluster(e)}>
                <input type="button" value="Select operator and total value"></input>
            </form>
        </div>
    )
};

export default AssignToCluster;
