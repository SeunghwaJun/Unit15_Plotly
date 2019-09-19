
var sampledata = 'static/data/samples.json';
var sampleinfo = d3.select('#selDataset');

function metadata(subject) {

    d3.json(sampledata).then((entry) => {
        var idInput = sampleinfo.property('value');
        var filtereddata = entry.metadata.filter((row) => row.id === parseInt(idInput));
        console.log(filtereddata);

        var demoinfo = d3.select('#sample-metadata');
        demoinfo.html('');
        Object.entries(filtereddata[0]).forEach(([key, value]) => {
            var info_p = demoinfo.append('p');
            info_p.text(`${key}: ${value}`);
        });
    });
};


function bargraph(subject) {
    d3.json(sampledata).then((entry) => {
        var idInput = sampleinfo.property('value');
        var filteredsample = entry.samples.filter((row) => row.id === idInput);
        console.log(filteredsample[0]);

        var slicedvalues = filteredsample[0].sample_values.slice(0, 10).reverse();
        var slicedlabels = filteredsample[0].otu_labels.slice(0, 10).reverse();
        var slicedids = filteredsample[0].otu_ids.slice(0, 10).reverse();
        console.log(slicedids);

        var idlist = [];

        for (var i = 0; i < slicedids.length; i ++) {
            idlist.push(`OTU ${slicedids[i].toString()}`);
        };
        console.log(idlist);

        var trace1 = {
            x: slicedvalues,
            y: idlist,
            text: slicedlabels,
            type: 'bar',
            orientation: 'h',
            marker: {
              color: '#C71585',
              width: 1
            },
        };

        var data = [trace1];

        var layout = {
            title: `Top 10 OTU OTUs Found in That Individual ${subject}`,
            xaxis: {title: 'Number of OTU'},
            yaxis: {title: 'OTU ID'}
        };

        Plotly.newPlot('bar', data, layout);
    }); 
};



function bubbleplot(subject) {
    d3.json(sampledata).then((entry) => {
        var idInput = sampleinfo.property('value');
        var filtered_sample = entry.samples.filter((row) => row.id === idInput);
        console.log(filtered_sample[0]);

        var trace1 = {
            x: filtered_sample[0].otu_ids,
            y: filtered_sample[0].sample_values,
            text: filtered_sample[0].otu_labels,
            mode: 'markers',
            marker: {
                size: filtered_sample[0].sample_values,
                color: filtered_sample[0].otu_ids
            }
        };

        var data = [trace1];

        var layout = {
            title: `Top 10 OTU OTUs Found in That Individual ${subject}`,
            yaxis: {title: 'Number of OTU'},
            xaxis: {title: 'OTU ID'}
        };

        Plotly.newPlot('bubble', data, layout);
    });
};


function gaugechart(subject) {
    d3.json(sampledata).then((entry) => {
        var idInput = sampleinfo.property('value');
        var filtered_metadata = entry.metadata.filter((row) => row.id === parseInt(idInput));
        console.log(filtered_metadata);

        var trace1 = {
            domain: {
                x: [0, 1],
                y: [0, 1]
            },
            value: filtered_metadata[0].wfreq,
            title: 'Belly Button Wshing Frequency: Scrups per week',
            type: 'indicator',
            mode: 'gauge+number+delta',
            delta: {reference: 4.5, increasing: {color: 'RebeccaPurple'} },
            gauge: {
                axis: {range: [null, 9]},
                bar: {color: 'black'},
                steps: [
                    {range: [0, 2], color: 'red'},
                    {range: [2, 4], color: 'salmon'},
                    {range: [4, 6], color: 'yellowgreen'},
                    {range: [6, 8], color: 'cyan'},
                    {range: [8, 9], color: 'steelblue'},
                ]
            }
        };

        var data = [trace1];

        var layout = {width: 500, height: 500, margin: {t: 0, b: 0}};
        
        Plotly.newPlot('gauge', data, layout);
    });  
};


function optionChanged(option) {
    metadata(option);
    bargraph(option);
    bubbleplot(option);
    gaugechart(option)
};


function init() {
    d3.json(sampledata).then((entry) => {
        console.log(entry);

        var ids = entry.samples.map(sample => sample.id);
        console.log(ids);

        ids.forEach((id) => {
            var idNo = sampleinfo.append('option');
            idNo.text(id);
        });

        metadata(ids[0]);
        gaugechart(ids[0]);
        bargraph(ids[0]);
        bubbleplot(ids[0]);
    });
};

init();

