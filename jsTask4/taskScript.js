document.addEventListener('DOMContentLoaded', function() {
    let langList = d3.selectAll('div.content b').nodes().map(item => item.textContent);
    let button = d3.select('input').node();
    button.addEventListener('click', function() {checkPage(langList)});
});

function checkPage(list) {
    let langMenu = d3.selectAll('div.menu a').nodes().map(item => item.textContent);
    list = [].concat(langMenu, list);
    list = list.filter(function (item, index) {
        return list.indexOf(item) === index;
    });

    d3.select('div.menu')
        .selectAll('a')
        .data(list)
        .enter()
        .append('a')
        .attr('href', '#');

    d3.select('div.menu')
        .selectAll('a')
        .data(list)
        .text(d => d);
}