/*jshint esversion: 6*/

init = () => {
    draw();
    console.log("done");
};

let draw = () => {
    try {
        let functionExp = math.compile(document.querySelector("#function-1").value);

        let xValues = math.range(-6, 6, 0.01).toArray();
        let yValues = xValues.map( (x) => functionExp.evaluate({x: x}));

        let graphData = [{
            x: xValues,
            y: yValues,
            type: 'scatter'
        }];

        Plotly.newPlot("graph", graphData);
    }
    catch (err) {
        console.log(err);
    }
};

document.querySelector("#functions").onsubmit = (e) => {
    e.preventDefault();
    draw();
};

init();