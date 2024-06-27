import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import aircraftInfo from './aircrafts.js';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));


reportWebVitals();


function CreateRow(props) {
    const cells = (props.isHead == '0')
    ? props.row.map((item, index) => <td key={index} className={props.hid[index]}>{item}</td>)
    : props.row.map((item, index) => <th key={index} className={props.hid[index]}>{item}</th>);
    return(<>{cells}</>)
}

function CreateHeader(props) {
    return(<thead><tr><CreateRow row = {props.head } isHead='1' hid = {props.hid}/></tr></thead>)
}

function CreateBody(props) {
    const tbody = props.body.map((item, index) => 
    <tr key={index}>
        <CreateRow row = {Object.values(item)} isHead = '0' hid = {props.hid}/>
    </tr>);

    return(<tbody>{tbody}</tbody>)
}

function Table(props) {
    const state = Object.keys(props.data[0]).fill('visible');
    const [hiddenColumns, setHiddenColumns] = React.useState(state);
    const setColumn = (event) => {
        setHiddenColumns(
            hiddenColumns.map((item, index) =>
                item = (index == event.target.value) ? ((event.target.checked) ? 'visible' : 'hidden') : item)
        );
    }

    const li = Object.keys(props.data[0]).map((item, index) => (
        <>
            <input type="checkbox" name="col" value={index} onChange = {setColumn} checked={(hiddenColumns[index] === 'visible') ? true : false}/>{item}<br/>
        </>
        )
    )
    return(
        <>
            <form>
                {li}
            </form>
            <table>
                <CreateHeader head = {Object.keys(props.data[0])} hid = {hiddenColumns}/>
                <CreateBody body = {props.data} hid = {hiddenColumns}/>
            </table>
        </>
    )
} 


root.render(<Table data = {aircraftInfo}/>);