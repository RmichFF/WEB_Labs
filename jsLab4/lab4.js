let pict;

document.addEventListener('DOMContentLoaded', function() {
    d3.select('#draw').on('click', function() {pict = drawPict(this.form)});
    d3.select('#animate').on('click', function() {runAnimation(this.form)});
    d3.select('#anim').on('change', function() {changeForm(this.form)});
    d3.select('#clear').on('click', function() {clearSVG(this.form); 
                                                this.form.reset(); 
                                                changeForm(this.form); 
                                                changeCycle(this.form)});
    d3.select('#opcycle').on('change', function() {changeCycle(this.form)});
    d3.selectAll('.anim')
        .style('display', 'none');
    d3.selectAll('.cycle')
        .style('display', 'none');
    d3.select('#anim')
        .attr('disabled', 'true');
});

let ar = [ d3.easeLinear, d3.easeElastic, d3.easeBounce];

const width = 600;
const height = 600;
let svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

function changeCycle(form) {
    if(form.opcycle.checked == true) {
        d3.selectAll('.cycle')
            .style('display', '');
    }
    else {
        d3.selectAll('.cycle')
            .style('display', 'none');
    }
}

function changeForm(form) {
    if(form.anim.checked == true) {
        d3.selectAll('.anim')
            .style('display', '');
        d3.select('#draw') 
            .style('display', 'none');
        d3.select('p')
            .style('display', 'none');
    }
    else {
        d3.selectAll('.anim')
            .style('display', 'none');
        d3.select('#draw') 
            .style('display', '');
        d3.select('p')
            .style('display', '');
    }
}

function clearSVG() {
    svg.selectAll('*').remove();
    d3.select('#anim')
        .attr('disabled', 'true');
}

function drawPict(form) {
    clearSVG();
    d3.select('#anim')
        .attr('disabled', null)
    let tgl = svg.append("g");

    tgl.append("polygon")
        .attr("points", "0,0 -10,-10 -10,-30 10,-10")
        .style("fill", "#F08080")
        .style("stroke", "black")
        .style("stroke-width", "1");

    tgl.append("polygon")
        .attr("points", "0,0 10,-10 30,-10 10,10")
        .style("fill", "#FA8072")
        .style("stroke", "black")
        .style("stroke-width", "1");

    tgl.append("polygon")
        .attr("points", "0,0 10,10 10,30 -10,10")
        .style("fill", "#CD5C5C")
        .style("stroke", "black")
        .style("stroke-width", "1");

    tgl.append("polygon")
        .attr("points", "0,0 -10,10 -30,10 -10,-10")
        .style("fill", "#FF6347")
        .style("stroke", "black")
        .style("stroke-width", "1");

    tgl.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 2)
        .style("fill", "white")
        .style("stroke", "grey");

    tgl.append("ellipse")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("rx", 10)
        .attr("ry", 15)
        .style("fill", "none")
        .style("stroke", "black");

    tgl.append("ellipse")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("rx", 15)
        .attr("ry", 10)
        .style("fill", "none")
        .style("stroke", "black");

    tgl.attr('transform', `translate(${form.cx.value}, ${form.cy.value}) 
                                scale(${form.mx.value}, ${form.my.value}) 
                                rotate(${form.ang.value * 360})`);
    
    return tgl;
}

function runAnimation(form) {
    let path = hypocycloidePath();

    pict.transition()
        .ease(ar[form.aType.selectedIndex])
        .duration(form.time.value * 1000)
        .attrTween('transform', translateAlong(path.node(), form));
}

function translateAlong(path, form) {
    const length = path.getTotalLength();
    const cycle = form.cyc.value;
    const mX = +form.mx.value;
    const mXapp = form.mxend.value - mX;
    const mY = +form.my.value;
    const mYapp = form.myend.value - mY;
    const ang = +form.ang.value;
    const angApp = form.angend.value - ang;
    return function() {
        return function(t) { 
            let curMX = mX + mXapp * ((form.opcycle.checked) ? cosCycle(t * Math.PI, cycle) : t);
            let curMY = mY + mYapp * ((form.opcycle.checked) ? cosCycle(t * Math.PI, cycle) : t);
            let curAng = (ang + t * angApp) * 360;
            const {x, y} = path.getPointAtLength(t * length);
            return `translate(${x},${y}) scale(${curMX},${curMY}) rotate(${curAng})`;
        }      
    }
}
function hypocycloidePath() {
    let data = [];
    const r = 168;
    const R = 280;
    for (let t = 0 ; t <= Math.PI * 6; t += 0.1) {
        data.push(
            {x: -((R - r) * Math.cos(t) + r * Math.cos((R - r) * t / r)) + 320,
            y: (R - r) * Math.sin(t) - r * Math.sin((R - r) * t / r) + 300}
        );
    }
    
    const line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y);

    const path = svg.append('path')
        .attr('d', line(data))
        .attr('stroke', 'none')
        .attr('fill', 'none');

    return path;
}

function cosCycle(x, cyc) {
    return 0.5 - 0.5 * Math.cos(x * ((cyc == 0) ? 1 : cyc * 2));
}