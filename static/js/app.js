
// import json data url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
//const url = "../samples.json"

d3.json(url).then(function(data) {
    console.log(data);
    console.log(data.names);
    console.log(data.samples);
    console.log(data.metadata);
  });

// horizontal bar chart

function init() {
    // Create a drop-down menu for each id
    let dropdown = d3.select("#selDataset");
    // Fetch data
    d3.json(url).then((data) => {
    // Append names to the dropdown menu using the forEach function
        let names = data.names
        names.forEach(function(sample) {
            dropdown.append("option")
            .text(sample)
            .property("value", sample)
        });

        // Select the first array of data for plotting
        let sample1 = names[0];

        chartPlots(sample1);
        metadata(sample1);
 })};
 init();

    // fuction to update plots

function chartPlots(sample) {
        d3.json(url).then((data) => {
            let samples = data.samples.filter(select => select.id == sample)[0];            ;
            let otu_id = samples.otu_ids;
            let values = samples.sample_values;
            let labels = samples.otu_labels;
        
           
        // horizontal bar chart

        let tracebar = [{
            x: values.slice(0,10).reverse(),
            y: otu_id.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            type: "bar",
            text: labels,
            orientation : 'h',
            marker: {
                size: values,
                color: otu_id
            }

        }];

        let bar_layout = {
            title: "Top 10 Bacteria Cultures",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Values" }
        };

        Plotly.newPlot("bar", tracebar, bar_layout)

        // bubble chart

        let traceBubble = [{
            x: otu_id,
            y: values,
            text: labels,
            mode: 'markers',
            marker: {
                size: values, 
                color: otu_id,       
            }
        }];

        let bub_layout = {
            title: "Bacteria Culture Per Sample",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Values" }
        };

        Plotly.newPlot("bubble", traceBubble, bub_layout, )
    
        }
    )}


    // function to update demographics

function metadata(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata.find(item => item.id == sample); 
        let metadataPanel = d3.select("#sample-metadata"); 
        
        // Clear existing content
        metadataPanel.html("");
        
        // Populate with new content
        Object.entries(metadata).forEach(([key, value]) => {
            metadataPanel.append("p")
                .text(`${key}: ${value}`);
        });
    });
}
    
    
    // function to update Sample Selection   

function optionChanged(sample) {
    chartPlots(sample);
    metadata(sample);
};
