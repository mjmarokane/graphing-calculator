/*jshint esversion: 6*/

init = () => {
    draw();
    console.log("done");
};

let draw = () => {
    try {
        let functionExp = math.compile(document.querySelector("#func-exp-1").value);
        let domainMin = document.querySelector("#domain-min-1").value;
        let domainMax = document.querySelector("#domain-max-1").value;
        
        let xValues = math.range(domainMin, domainMax, 0.01).toArray();
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