/*jshint esversion: 6*/

let numFunctions = 1;

init = () => {
    Plotly.newPlot("graph");
};

let draw = (functionIndex) => {
    try {
        let functionExp = math.compile(document.querySelector(`#func-exp-${functionIndex}`).value);
        let domainMin = document.querySelector(`#domain-min-${functionIndex}`).value;
        let domainMax = document.querySelector(`#domain-max-${functionIndex}`).value;

        let xValues = math.range(domainMin, domainMax, 0.01).toArray();
        let yValues = xValues.map( (x) => functionExp.evaluate({x: x}));

        let graphData = [{
            x: xValues,
            y: yValues,
            type: 'scatter'
        }];

        Plotly.plot("graph", graphData);
    }
    catch (err) {
        console.log(err);
    }
};

document.querySelector("#functions").onsubmit = (e) => {
    e.preventDefault();
    Plotly.newPlot("graph");
    for (let i = 1; i <= numFunctions; i++) {
        draw(i);
        console.log("drew");
    }
};

document.querySelector("#add-more").onclick = () => {
    numFunctions++;

    let newFunction = document.createElement("div");
    let existingFunctions = document.querySelector("#functions");

    newFunction.setAttribute("class", "function");
    newFunction.innerHTML = `<label for="func-exp-1" >y=</label><input type="text" class="func-exp" id="func-exp-${numFunctions}">
                             <input type="number" value="-6" class="domain" id="domain-min-${numFunctions}">
                            <span>&le;x&le;</span>
                            <input type="number" value="6" class="domain" id="domain-max-${numFunctions}"></input>`;

    existingFunctions.insertBefore(newFunction, document.querySelector("#add-more"));
};

init();