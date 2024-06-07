let mainTable;
let curTable;

//Операции вып. при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    //Вебпак спасибо
    if (document.title == 'Таблица лётно-технических характеристик') {
        let tableId = 'acInfo';
        mainTable = curTable = getTable(tableId);
        let filterBut = document.getElementById('filterBut');
        filterBut.onclick = function(){filterTable(this.form, tableId, mainTable)};
        let clearFilterBut = document.getElementById('clearFilter');
        clearFilterBut.onclick = function(){clearFilter(tableId, mainTable)};
        let sortBut = document.getElementById('sortBut');
        sortBut.onclick = function(){sortTable(tableId, curTable, this.form)};
        let clearSortBut = document.getElementById('clearSort');
        clearSortBut.onclick = function(){clearSort(this.form, tableId, curTable)};
        setSortOptions(this.getElementById('sort'));
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

//Выводит таблицу на страницу
function printTable(data, tableId) {
    let table = document.getElementById(tableId);
    table.innerHTML = '';
    let tr = document.createElement('tr');
    for(key in mainTable[0]) {
        let th = document.createElement('th');
        th.className = "table__data table__data_head";
        th.innerHTML = key;
        tr.appendChild(th);
    }
    table.appendChild(tr);
    
    data.forEach((item) => {
        let tr = document.createElement('tr');
        for(let key in item) {
            let td = document.createElement('td');
            td.className = "table__data";
            td.innerHTML = item[key];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    });

}

//In the memory of filters
function clearFilter(tableId, data) {
    curTable = mainTable;
    clearSort(document.getElementById('sort'), tableId, data);
}

let correspond = {
    'Название': 'name',
    'Страна произв.': 'country',
    'Компания': 'company',
    'Тип': 'type',
    'Боевой радиус, км': ['radMin', 'radMax'],
    'Макс. скорость, км/ч': ['spMin', 'spMax'],
    'Практ. потолок, м': ['hMin', 'hMax']
}

//Получает поля для фильтрации
function getFields(form) {
    let filterFields = {};
    for(let i = 0; i < form.elements.length-2; i++) {
        let item = form.elements[i];
        let valInput = item.value.toLowerCase().trim();
        if (item.type != "text") {
            if (valInput == '') {
                valInput = (i % 2) ? Infinity : -Infinity;
            } else {
                valInput = +valInput;
            }
        }
        filterFields[item.id] = valInput;
    }
    return filterFields;
}

function filterTable(form, tableId, data) {
    let filterFields = getFields(form);
    let filteredTable = data.filter(item => {
        let result = true;
        for(let key in item) {
            let val = item[key];
            if (typeof val == 'string') {
                val = item[key].toLowerCase();
                result &&= val.indexOf(filterFields[correspond[key]]) !== -1;
            }
            else {
                result &&= (val >= filterFields[correspond[key][0]] && val <= filterFields[correspond[key][1]]);
            }
        }
        return result;
    }); 

    curTable = filteredTable;

    printTable(filteredTable, tableId);
}

//In the memory of sort
let sortCspd = [
    'Название',
    'Страна произв.',
    'Компания',
    'Тип',
    'Боевой радиус, км',
    'Макс. скорость, км/ч',
    'Практ. потолок, м'
]

function createOption(str, val) {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
}

function setSortOption(head, sortSelect) {

    sortSelect.append(createOption('Нет', 0));

    for (let i in head) {
        sortSelect.append(createOption(head[i], Number(i) + 1));
    }
}

function setSortOptions(form) {
    let allSelect = form.getElementsByTagName('select');   
    let allCheck = form.getElementsByTagName('input');
    for(let i = 0; i < allSelect.length; i++) {
        if(i != allSelect.length - 1) {
            allSelect[i].onchange = function(){changeNextSelect(this)};
        }
        if (i != 0) {
            allSelect[i].disabled = true;
            allCheck[i].disabled = true;
        }
        setSortOption(sortCspd, allSelect[i]);
    }
} 
   
function changeNextSelect(curSelect) {

    let allSelect = curSelect.form.getElementsByTagName('select');
    let allCheck = curSelect.form.getElementsByTagName('input');

    allSelect[Number(curSelect.id)].disabled = false;
    allCheck[Number(curSelect.id)].disabled = false;
    for (let i = Number(curSelect.id); i < allSelect.length; i++) {
        allSelect[i].innerHTML = curSelect.innerHTML;
        if (curSelect.selectedIndex != 0) {
            allSelect[i].remove(curSelect.selectedIndex);
        } else {
            allSelect[i].disabled = true;
            allCheck[i].disabled = true;
        }
    }
}

function clearSort(form, tableId, data) {
    form.reset();
    let allSelect = form.getElementsByTagName('select');
    let allCheck = form.getElementsByTagName('input');
    for(let i = 1; i < allSelect.length; i++) {
        allSelect[i].disabled = true;
        allCheck[i].disabled = true;
    }
    printTable(data, tableId);
}

function getSortSetup(data) {
    let sortArr = [];
   
    let sortSelects = data.getElementsByTagName('select');
   
    for (let i = 0; i < sortSelects.length; i++) {
    
        let key = sortSelects[i].value;
        if (key == 0) {
            break;
        }

        let desc = document.getElementById('desc' + sortSelects[i].id).checked;
        sortArr.push({column: key - 1, order: desc});
    }
    return sortArr;
}


function sortTable(tableId, data, form) {

    let sortArr = getSortSetup(form);
    if (sortArr.length == 0) {
        return false;
    }

    let sortedTable = data.slice();

    sortedTable.sort((a, b) => {
        for(let i in sortArr) {
            let key = sortArr[i].column;
            let desc = sortArr[i].order;
            if (a[sortCspd[key]] > b[sortCspd[key]]) {
                return (desc) ? -1 : 1;
            } else if (a[sortCspd[key]] < b[sortCspd[key]]){
                return (desc) ? 1 : -1;
            }
        }
        return 0;
    });

    printTable(sortedTable, tableId);
}