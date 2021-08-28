// //////////////////////////////////
//  STEP 1 // CREATING INITIAL VAR'S
// //////////////////////////////////

// Var for the select element (dropdown menu)
var seldataset = d3.select("#selDataset");

// Var for selecting demographics table
var demographicstable = d3.select("#sample-metadata");

// Var for selecting bar chart
var barChart = d3.select("#bar");

// Var for selecting bubble chart
var bubbleChart = d3.select("#bubble");

// Bonus: Var for selecting gauge chart;
var guageChart = d3.select("#gauge")

// Var for selecting samples.json
var samplejson = d3.json("samples.json");


// ///////////////////////
// STEP 2 // DROPDOWNMENU
// ///////////////////////

// Populating dropdownMenu
function init() {
    
    // Fetch the JSON data
    // Arrow functoins to add options to the select html elemnt and population each option with names
    samplejson.then((data) => {

        data.names.forEach((name) => {
            var option = seldataset.append("option");
            option.text(name).property('value', name);
        });
    });
};

// initialize dropdownMenu
init();

// /////////////////////////////
// STEP 3 // BUILDING THE PLOTS
// /////////////////////////////

// Using optionChanged function to update graph when new id/name is selected
function optionChanged() {
    // will update the demographics info
    buildPlot();
};

// Write out showTable function to show the demographics for each newName
function buildPlot(subject) {

    // Fetch JSON again
    samplejson.then((data) => {

        // Var for current id in select menu
        var currentid = seldataset.node().value;

        // Var to select metadata in samples.json
        var metadata = data.metadata;

        // Filter JSON metadata to show metadata for currentid
        var filteredmetadata = metadata.filter(subject => subject.id == currentid)[0];

        // Start process to create demographics table
        // reset demographics table metadata
        demographicstable.html("");

        var demographicslist = demographicstable.append("ul");

        // Object.entries
        Object.entries(filteredmetadata).forEach(([key, value]) => {
            demographicslist.append('li').text(`${key}: ${value}`);
        });

        // Var to select samples data from json
        var samples = data.samples;

        // Var for current id in select menu
        var currentid = seldataset.node().value;

        // Filter samples for current id
        filteredsamples = samples.filter(subject => subject.id == currentid)[0];

        // Var for bar chart details
        var barCharttrace = {
            x: filteredsamples.sample_values.slice(0,10).reverse(),
            y: filteredsamples.otu_ids.slice(0,10).map(otuid => `OTU ${otuid}`).reverse(),
            type: "bar",
            orientation: "h",
            text:  filteredsamples.otu_labels.slice(0,10).reverse()
        };

        var barChartlayout = {
            title: "10 Most Frequent Bacteria found in Chosen ID",
            yaxis: {title:"OTU ID"},
            xaxis: {title: "Bacterial Count/Frequency"}
        };

        Plotly.newPlot("bar", [barCharttrace], barChartlayout);

        // Var for bubble chart details
        var bubbleCharttrace ={
            x: filteredsamples.otu_ids,
            y: filteredsamples.sample_values,
            mode: "markers",
            marker: {
                size: filteredsamples.sample_values,
                color: filteredsamples.otu_ids
            },
            text: filteredsamples.otu_labels
        };

        var bubbleChartlayout = {
            title: "Bacteria Content of Chosen Belly Button",
            xaxis: {title: "OTU ID"},
            showlegend: false
        };

        Plotly.newPlot("bubble", [bubbleCharttrace], bubbleChartlayout);

        // Var for gauge chart
        var guageCharttrace = {
            type: "indicator",
            mode: "gauge+number+delta",
            value: filteredsamples.wfreq,
            title: { text: "Wash Frequency of Chosen Subject's Belly Button", font: { size: 24, color: "black", family: "Arial" } },
            delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
            gauge: {
              axis: { range: [null, 9], tickwidth: 1, tickcolor: "black" },
              bar: { color: "darkblue" },
              bgcolor: "white",
              borderwidth: 2,
              bordercolor: "gray",
              steps: [
                { range: [0, 1], color: "red" },
                { range: [1, 2], color: "orange" },
                { range: [2, 3], color: "lightorange" },
                { range: [3, 4], color: "yellow" },
                { range: [4, 5], color: "lightgreen" },
                { range: [5, 6], color: "green" },
                { range: [6, 7], color: "royalblue" },
                { range: [7, 8], color: "indigo" },
                { range: [8, 9], color: "violet" },
              ],
            }
        };

        var guageChartlayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

        Plotly.newPlot("gauge", [guageCharttrace], guageChartlayout);

    });
};


