let mainTable;

const marginX = 100;
const marginY = 100;
const height = 500;
const width = 1000;

let svg = d3.select("svg")
 .attr("height", height)
 .attr("width", width);

//Операции вып. при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    //Вебпак спасибо
    if (document.title == 'Таблица лётно-технических характеристик') {
        mainTable = getTable('acInfo');
        svg.style('display', 'none');
        d3.select('#show-plot').on('click', function () {if (!error(this.form)) {drawGraph(this.form, mainTable)}});
        d3.select('#clear-svg').on('click', function () {clearSVG()});
    }
});

//Получает ассоциативный массив на основе таблицы
function getTable(tableId) {
    let table = document.getElementById(tableId).rows;
    let assTable = [];
    for(let i = 1; i < table.length; i++) {
        let record = {}
        for(j = 0; j < table[i].children.length; j++) {
            let text = table[i].children[j].innerText
            record[table[0].children[j].innerText] = (isNaN(parseFloat(text)) || !isFinite(text)) ? text : +text;
        }
        assTable.push(record);
    }
    return assTable;
}

function clearSVG() {
    svg.selectAll('*').remove();
    svg.style('display', 'none');
}

function createArrGraph(data, keyX, keyY) {

    groupObj = d3.group(data, d => d[keyX]);
    let graphArr = d3.map(groupObj, d => {
        return {labelX : d[0], value : d3.max(d[1].map(b => b[keyY]))}
    });
    return graphArr;
}

function drawGraph(form, data) {
    svg.style('display', '');
    const keyX = form.ox.value;
   
    const colors = ["blue", "red", "green"];

    const Ys = d3.select("form.graph").selectAll("input.checkbox:checked").nodes().map(d => d.value);
   
    let arrGraphs = Ys.map(d => {return createArrGraph(data, keyX, d)});
   
    svg.selectAll('*').remove();

    const [scX, scY] = createAxis(arrGraphs);

    let legend = svg
        .selectAll(".lineLegend")
        .data(Ys)
        .enter()
        .append("g")
        .attr("class","lineLegend")
        .attr("transform", function (d,i) {
            return `translate(${width - marginX * 1.55}, ${height - marginY / 2 + i * 15})`;
        });

    let pil = d3.select("#gtype").node().value;
    for (let i = 0; i < arrGraphs.length; i++) {
        if (pil == 0) {
            createChart(arrGraphs[i], scX, scY, i, colors[i]);
        }
        else {
            createPillar(arrGraphs[i], scX, scY, i, arrGraphs.length, colors[i]);
        }

        legend.append("text")
            .text(d => d)
            .attr("transform", "translate(20,8)")
            .style("font", "12px Verdana");

        legend.append("rect")
            .attr("fill", (d, i) => colors[i])
            .attr("width", 15)
            .attr("height", 5);
    }
}
   
function createAxis(data){
    let minMax = d3.extent(data.flat().map(d => d.value));

    let scaleX = d3.scaleBand()
        .domain(data[0].map(d => d.labelX))
        .range([0, width - 2 * marginX])
        .padding(0.2);
   
    let scaleY = d3.scaleLinear()
        .domain([minMax[0] * 0.85, minMax[1] * 1.1 ])
        .range([height - 2 * marginY, 0]);
   
    let axisX = d3.axisBottom(scaleX); 
    let axisY = d3.axisLeft(scaleY); 

    svg.append("g")
        .attr("transform", `translate(${marginX}, ${height - 1.5 * marginY})`)
        .call(axisX)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", d => "rotate(-45)");
   
    svg.append("g")
        .attr("transform", `translate(${marginX}, ${0.5 * marginY})`)
        .call(axisY);
   
    return [scaleX, scaleY];
}
   
function createChart(data, scaleX, scaleY, index, color) {
    const r = 4
    let ident = (index == 0) ? -r / 2 : r / 2;

    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", r)
        .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
        .attr("cy", d => scaleY(d.value) + ident)
        .attr("transform", `translate(${marginX}, ${0.5 * marginY})`)
        .style("fill", color);
}

function createPillar(data, scaleX, scaleY, index, apprS, color) {
    let yAxisLen = height - 2 * marginY;
    svg.selectAll(".rect")
        .data(data)
        .enter().append("rect")
        .attr("x", d => scaleX(d.labelX))
        .attr("width", scaleX.bandwidth() / apprS)
        .attr("y", d => scaleY(d.value))
        .attr("height", d => yAxisLen - scaleY(d.value))
        .attr("transform", `translate(${marginX + index * scaleX.bandwidth() / apprS}, ${ 0.5 * marginY})`)
        .attr("fill", color);
}

function error(form) {
    ret = false;
    if (form.ox.value == ''){
        ret = true;
        d3.select("#axisX")
            .style("color", "red")
            .transition()
            .duration(500)
            .style("color", "black");

    }
    if (d3.select("form.graph").selectAll("input.checkbox:checked").nodes().length == 0){
        ret = true;
        d3.select("#axisY")
            .style("color", "red")
            .transition()
            .duration(500)
            .style("color", "black");
    }

    return ret;
}