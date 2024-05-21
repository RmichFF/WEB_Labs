function changeView(data) {
    let image = document.getElementById('image');
    image.setAttribute('src', `images/${(data.compform[0].checked) ? 'ex' : 'tg'}.png`);
}

function calculate(data) {
    let select = false;
    for (let i = 0; i < 4; i++) {
        if (data.task[i].selected) {
            select = true;
        }
    }
    if (select) {
        let output = document.getElementById('output');

        let r = data.input1.value;
        let f = data.input2.value;

        if (isNaN(parseFloat(r)) || r < 0 || !isFinite(f)) {
            data.input1.classList.add("error");
            return;
        }

        if (isNaN(parseFloat(f)) || Math.abs(f) > Math.PI || !isFinite(f)) {
            data.input2.classList.add("error");
            return;
        }

        changeView(data);
        cleanPage();

        let imPart = Math.round(r * Math.sin(f) * 1000) / 1000;
        let rlPart = Math.round(r * Math.cos(f) * 1000) / 1000;

        let newFs = document.createElement('fieldset');
        let newLg = document.createElement('legend');
        newLg.innerHTML = 'Результат';
        newFs.appendChild(newLg);
        console.log(data.task[0].selected);
        
        if (data.task[0].selected) {
            let newForm = document.createElement('p');
            newForm.innerHTML = `Алгебраическая форма: z = ${rlPart} ${(imPart >= 0) ? '+' : '-'} i * ${Math.abs(imPart)}<br>`;
            if (data.compform[1].checked) {
                newForm.innerHTML += `Показательная форма: z = ${r} * e<sup>i * ${f}</sup>`;
            } 
            else {
                newForm.innerHTML += `Тригонометрическая форма: z = ${r} * (cos(${f}) + i * sin(${f})`;
            }
            newFs.appendChild(newForm);
        }

        if (data.task[1].selected) {
            let newIm = document.createElement('p');
            newIm.innerHTML = `Im(z) = ${imPart}`;
            newFs.appendChild(newIm);
        }

        if (data.task[2].selected) {
            let newRe = document.createElement('p');
            newRe.innerHTML = `Re(z) = ${rlPart}`;
            newFs.appendChild(newRe);
        }

        if (data.task[3].selected) {
            let newArg = document.createElement('p');
            newArg.innerHTML = `Arg(z) = ${f}`;
            newFs.appendChild(newArg);
        }
        output.appendChild(newFs);
    }
    else {
        data.task.classList.add("error");
            return;
    }
}

function cleanPage() {
    let output = document.getElementById('output')
    output.innerHTML = ''
}

let input1 = document.getElementById('input1');
input1.onfocus = function() {
    this.classList.remove('error');
};

let input2 = document.getElementById('input2');
input2.onfocus = function() {
    this.classList.remove('error');
};

let task = document.getElementById('task');
task.onfocus = function() {
    this.classList.remove('error');
};
