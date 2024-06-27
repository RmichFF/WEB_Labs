import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import quotearray from './quotes.js';
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
    const state = Object.keys(props.data[0]).fill('hidden');
    const [hiddenColumns, setHiddenColumns] = React.useState(state);
    const setColumn = (event) => {
        setHiddenColumns(
            hiddenColumns.map((item, index) =>
                item = (index == event.target.id) ? ((item=="hidden") ? 'visible' : 'hidden') : item)
        );
    }

    const li = Object.keys(props.data[0]).map((item, index) => (
        <>
            <input type="button" name="col" id={index} value={item} onClick = {setColumn} className={(hiddenColumns[index] == "visible") ? "button" : "prbutton"}/>
        </>
        )
    )
    return(
        <>
            <div className="interact">
                <form>
                    {li}
                </form>
                <table className="table">
                    <CreateHeader head = {Object.keys(props.data[0])} hid = {hiddenColumns}/>
                    <CreateBody body = {props.data} hid = {hiddenColumns}/>
                </table>
            </div>
        </>
    )
}


function Header() {
    return (
        <div className="header">
            <h2>КЛУБ АВИАМОДЕЛЬНОГО СПОРТА "РАЙТ"</h2>
            <label>
                <input className="but" type="button" id="search" value="&#128269;"/>
                <input className="searchbar" type="text"id="search"/>
            </label>
        </div>
    );
}

function Footer() {
    return (
        <div className="footer">
            <div className="item">&copy; Нечепуренко Р.А., Б9121-09.03.04(6), 2023-2024</div>
            <div className="item">&#9993; Контакты</div>
        </div>
    )
}

function Slogan() {
    return (
        <h1>  
            ВЫ 	— <span>ПОКЛОННИК СТЕНДОВОГО МОДЕЛИЗМА?</span><br/>
            ВЫ 	— <span>УВЛЕКАЕТЕСЬ ИСТОРИЕЙ АВИАЦИИ?</span><br/>
            КЛУБ "РАЙТ" РАД ВИДЕТЬ ВАС<br/>
            В СВОИХ РЯДАХ!
        </h1>
    )
}

function Quote(props) {
    const [quote, setQuote] = React.useState(props.quotes[0]);

    const shuffle = React.useCallback(() => {
        const index = Math.floor(Math.random() * props.quotes.length);
        setQuote(props.quotes[index]);
    }, []);

    React.useEffect(() => {
        const intervalID = setInterval(shuffle, 15000);
        return () => clearInterval(intervalID);
    }, [shuffle]);

    return (
        <>
            <div className="citation">
                <p className="quote">"{quote.quote}"</p>
                <p className="author">&copy; {quote.author}</p>
            </div>
        </>
    )
}

function Main() {
    return (
        <div className="main">
            <Slogan/>
            <Quote quotes = {quotearray}/>
        </div>
    )
}

function Submain() {
    return (
        <div className="submain">
            <Table data = {aircraftInfo}/>
        </div>
    )
}

function Content() {
    return (
        <>
            <Header/>
            <div className="content">
                <Main/>
                <Submain/>
            </div>
            <Footer/>
        </>
    )
}

root.render(<Content/>);