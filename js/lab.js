

let neighbor = (...args) => {
    let curMax = true;
    let result = 0;
    for (let i = 0; i < args.length - 1; i++) {
        if (args[i] > args[i + 1] && curMax) {
            result++;
            curMax = false;
        } else if (args[i] == args[i+1]) {
            curMax = false;
        } else if (args[i] < args[i+1]) {
            curMax = true;
        }
    }
    return (curMax) ? (result + 1) : result;
}

alert(neighbor(9, 8, 7, 6, 5, 4, 3, 2, 1));