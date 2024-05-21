function changePage(id) {
    let desiredClassElement = document.getElementById(id);
    let desiredClass = desiredClassElement.className;
    let desiredElements = document.getElementsByClassName(desiredClass);
    let deleteElements = [];
    for (let i = 0; i < desiredElements.length; i++) {
        if (desiredElements[i].className.length == desiredClass.length && desiredElements[i] != desiredClassElement) {
            deleteElements.push(desiredElements[i]);
        }
    }
    deleteElements.forEach((elem) => {
        elem.remove();
    });
}
