```
-> High-resolution flood susceptibility mapping and exposure assessment in Pakistan

-> App Created By: Mirza Waleed
-> Email: waleedgeo@outlook.com

-> Feel free to use this code for your own projects, but please give credit to the original author by citing the paper & giving star to its repository.

-> Paper Citation: Waleed, M., & Sajjad, M. (2025). High-resolution flood susceptibility mapping and exposure assessment in Pakistan: An integrated artificial intelligence, machine learning and geospatial framework. International Journal of Disaster Risk Reduction, 121(10544), 2.

-> Paper Link: https://doi.org/10.1016/j.ijdrr.2025.105442

-> Overview:
Earth Engine JavaScript code for the Flood Susceptibility Mapping (FSM) application in Pakistan. 
This code creates a web-based application that allows users to visualize flood susceptibility data 
across different provinces and districts in Pakistan. 
The application includes interactive charts, a legend, and a reset button for user convenience.   

```


var valuesList = [1, 2, 3, 4, 5];
var namesList = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
var palette = ["#147218","#7cb815","#f2fe2a","#ffac18","#fe3c19"];

// Pakistan FSM data
var pakistanFSMData = [
  {class: 'Very Low', percentage: 57.91},
  {class: 'Low', percentage: 12.05},
  {class: 'Medium', percentage: 9.29},
  {class: 'High', percentage: 8.04},
  {class: 'Very High', percentage: 12.71}
];

// Province FSM data
var provinceFSMData = [
  {province: 'Azad Kashmir', veryLow: 98.15, low: 1.65, moderate: 0.18, high: 0.02, veryHigh: 0},
  {province: 'Balochistan', veryLow: 65.5, low: 9.66, moderate: 5.26, high: 4.95, veryHigh: 14.63},
  {province: 'Gilgit Baltistan', veryLow: 97.8, low: 1.78, moderate: 0.25, high: 0.16, veryHigh: 0.01},
  {province: 'Islamabad', veryLow: 99.99, low: 0.01, moderate: 0, high: 0, veryHigh: 0},
  {province: 'Khyber Pakhtunkhwa', veryLow: 90.76, low: 2.45, moderate: 2.04, high: 2.1, veryHigh: 2.65},
  {province: 'Punjab', veryLow: 30.6, low: 24.39, moderate: 21.72, high: 13.02, veryHigh: 10.26},
  {province: 'Sindh', veryLow: 25.97, low: 13.89, moderate: 12.32, high: 18.64, veryHigh: 29.18}
];

// vis param
var vis = {
    min: 1,
    max: 5,
    palette: palette
};

// importing carbon data
var img1 = ee.Image('projects/waleedgeo/assets/fsm_pk_lgbm');
var img2 = ee.Image('projects/waleedgeo/assets/fsm_pk_xgboost');

// importing shapefile
var province = ee.FeatureCollection('projects/pak-var/assets/pak_adm2');
var province_list = province.aggregate_array('ADM1_EN').distinct();

var national = ee.FeatureCollection('projects/pak-var/assets/pak_adm0');
var empty = ee.Image().byte();
var national_boundary = empty.paint({
    featureCollection: national,
    width: 2
});
var adm1 = ee.FeatureCollection("projects/pak-var/assets/pk_adm1");
var adm1_boundary = empty.paint({featureCollection:adm1, width:1})
/*
#################################################
Styles for the UI elements
*/

var styleBox = {
    padding: '0px 0px 0px 0px',
    width: '250px',
};
  
var styleH1 = {
    fontWeight: 'bold',
    fontSize: '20px',
    margin: '10px 5px 10px 5px',
    padding: '0px 0px 0px 0px',
    color: '#1a73e8'  // Updated color for better visibility
};
  
var styleH2 = {
    fontWeight: 'bold',
    fontSize: '16px',
    margin: '10px 5px',
    color: '#333333'
};
  
var styleP = {
    fontSize: '12px',
    margin: '5px 5px',
    padding: '0px 0px 0px 0px'
};

var styleButton = {
    margin: '10px 5px',
    fontSize: '13px',
    color: 'black',
    backgroundColor: '#1a73e8',
    padding: '6px 12px',
    border: '1px solid #0b5394',
    borderRadius: '4px'
};

var dividerStyle = {
  margin: '15px 0px',
  backgroundColor: '#e0e0e0', 
  height: '1px'
};

/*
#################################################
Chart functions
*/

/**
 * Generates and prints a pie chart summarizing land cover class areas within an AOI.
 */
function createPieChartSliceDictionary(fc) {
    return ee.List(fc.aggregate_array("landcover_class_palette"))
      .map(function(p) {
        return {
          'color': p
        };
      }).getInfo();
}

function generateAreaChart(image, aoi, valuesList, namesList, palette) {
    // Create dictionaries for class names and palettes.
    var lookupNames = ee.Dictionary.fromLists(valuesList.map(function(num) { return num.toString(); }), namesList);
    var lookupPalette = ee.Dictionary.fromLists(valuesList.map(function(num) { return num.toString(); }), palette);
    
    // Combine pixel area with the land cover classification. (Sq km)
    var areaImageWithClass = ee.Image.pixelArea().divide(1e6).addBands(image);
    
    // Reduce region to sum pixel areas by class.
    var reductionResults = areaImageWithClass.reduceRegion({
      reducer: ee.Reducer.sum().group({
        groupField: 1,
        groupName: 'landcover_class_value',
      }),
      geometry: aoi,
      scale: 30,
      bestEffort: true,
    });
    
    // Map over each group to create features.
    var classStats = ee.List(reductionResults.get('groups'));
    var landcoverFc = ee.FeatureCollection(classStats.map(function(classStat) {
      classStat = ee.Dictionary(classStat);
      var classValue = classStat.get('landcover_class_value');
      return ee.Feature(null, {
        'landcover_class_name': lookupNames.get(classValue),
        'area_km2': classStat.get('sum'),
        'landcover_class_palette': lookupPalette.get(classValue)
      });
    }));
    
    // Generate pie chart.
    var pieChart = ui.Chart.feature.byFeature({
      features: landcoverFc,
      xProperty: 'landcover_class_name',
      yProperties: ['area_km2']
    }).setChartType('PieChart').setOptions({
      title: 'FSM Area (%)',
      titleTextStyle: {fontSize: 12, bold: true},
      slices: createPieChartSliceDictionary(landcoverFc),
      sliceVisibilityThreshold: 0, // Include all slices.
      legend: {position: 'none'},
      chartArea: {width: '80%', height: '80%'}
    });
    
    return pieChart;
}

// Function to create predefined pie chart for Pakistan and provinces
function createStaticPieChart(data, title, regionType) {
    var dataTable = [['Class', 'Percentage']];
    
    if (regionType === 'pakistan') {
        // Pakistan data format
        data.forEach(function(item) {
            dataTable.push([item.class, item.percentage]);
        });
    } else {
        // Province data format
        dataTable.push(['Very Low', data.veryLow]);
        dataTable.push(['Low', data.low]);
        dataTable.push(['Moderate', data.moderate]);
        dataTable.push(['High', data.high]);
        dataTable.push(['Very High', data.veryHigh]);
    }
    
    return ui.Chart(dataTable)
        .setChartType('PieChart')
        .setOptions({
            title: title,
            titleTextStyle: {fontSize: 11, bold: true},
            slices: {
                0: {color: palette[0]},
                1: {color: palette[1]},
                2: {color: palette[2]},
                3: {color: palette[3]},
                4: {color: palette[4]}
            },
            legend: {position: 'none'},
            width: 220,
            height: 180,
            chartArea: {width: '80%', height: '80%'}
        });
}

var chartsPanel = ui.Panel({
  style: {
    margin: '0px 0px 0px 0px',
    position: 'bottom-center',//changes here
    padding: '1px 1px',
    width: '2050px',
    backgroundColor: 'rgba(224, 226, 226, 0.6)'//chanes here
  },
          layout: ui.Panel.Layout.Flow('horizontal') 
})

// Store chart panels for easy access
var chartPanels = {};

// Function to initialize all charts
function initializeCharts() {
    chartsPanel.clear();
    chartPanels = {};
    
    // Add Pakistan chart
    var pakistanChart = createStaticPieChart(pakistanFSMData, 'Pakistan FSM', 'pakistan');
    var pakistanChartContainer = ui.Panel({
        widgets: [pakistanChart],
        style: {margin: '0 10px'}
    });
    
    chartPanels['pakistan'] = pakistanChartContainer;
    chartsPanel.add(pakistanChartContainer);
    
    // Add province charts
    provinceFSMData.forEach(function(provinceData) {
        var provinceChart = createStaticPieChart(provinceData, provinceData.province, 'province');
        var provinceChartContainer = ui.Panel({
            widgets: [provinceChart],
            style: {margin: '0 10px'}
        });
        
        chartPanels[provinceData.province] = provinceChartContainer;
        chartsPanel.add(provinceChartContainer);
    });
    
    Map.add(chartsPanel);
}

// Reset button function
function resetApp() {
    // Clear map
    Map.clear();
    Map.setOptions('HYBRID');
    // Re-add initial layers
    Map.addLayer(national_boundary, {
        palette: 'black'
    },  ' Pakistan Boundary');

    Map.addLayer(img1, vis, 'FSM LGBM');
    Map.addLayer(img2, vis, 'FSM XGBoost', false);
    Map.addLayer(adm1_boundary, {
        palette: 'black'
    }, 'Provinces Boundary');
    // Reset dropdown menus
    panel.province.setValue(null);
    panel.district.setValue(null);
    panel.district.setDisabled(true);
    
    // Center map on Pakistan
    Map.setCenter(70.704, 30.655, 6.5);

    chartsPanel.style().set('shown', true);
    
    // Re-initialize chart
     initializeCharts();

    //Remove district panel
    var districtChartPanel = ui.Panel({
          style: {
              margin: '0px 0px 0px 0px',
              position: 'bottom-center',
          padding: '1px 1px',
              width: '380px'
          }
      });

    districtChartPanel.clear()
    
    // Show loading message
    panel.loading.style().set({
        shown: true
    });
}

var panel = {
    title: ui.Label({
        value: 'High Resolution Flood Susceptibility Mapping and Exposure Assessment in Pakistan',
        style: styleH1
    }),
    sec_panel: ui.Label({
        value: 'Division Level Assessment',
        style: {
            fontWeight: 'bold',
            fontSize: '16px',
            margin: '10px 5px 5px 5px',
            padding: '0px 0px 0px 0px',
            color: '#4285f4'
        }
    }),
    sub_title: ui.Label({
        value: 'Note: Select your Province/division and see the flood susceptibility distribution.',
        style: styleP
    }),
    divider1: ui.Panel({style: dividerStyle}),
    provider: ui.Label({
        value: 'Citation',
        style: styleH2
    }),
    source: ui.Label({
        value: 'Waleed, M., & Sajjad, M. (2025). High-resolution flood susceptibility mapping and exposure assessment in Pakistan: An integrated artificial intelligence, machine learning and geospatial framework. International Journal of Disaster Risk Reduction, 121(10544), 2.',
        style: styleP
    }).setUrl('https://doi.org/10.1016/j.ijdrr.2025.105442'),
    paperlink: ui.Label({
        value: 'Click here to see the published paper',
        style: styleP
    }).setUrl('https://doi.org/10.1016/j.ijdrr.2025.105442'),
    divider2: ui.Panel({style: dividerStyle}),
    area_list: ui.Label({
        value: 'Area Selection',
        style: styleH2
    }),
    pro: ui.Label({
        value: 'Province Name:',
        style: styleP
    }),
    province: ui.Select({
        placeholder: 'Select Province',
        style: styleBox,
        onChange: function (a) {
            if (!a) return; // Skip if reset to null
            
            panel.loading.style().set({
                shown: false
            });
            panel.district.set({
                disabled: false
            });
            var filter = province.filterMetadata('ADM1_EN', 'equals', a);
            filter.aggregate_array('ADM2_EN').evaluate(function (list){
                panel.district.items().reset(list);
            });
            
            // Hide all province charts except the selected one
            Object.keys(chartPanels).forEach(function(key) {
                if (key !== a) {
                    chartPanels[key].style().set('shown', false);
                }
            });
        }
    }),
    dis: ui.Label({
        value: 'Division Name:',
        style: styleP
    }),
    district: ui.Select({
        placeholder: 'Select Division',
        style: styleBox,
        disabled: true,
        onChange: function () {
            if (!panel.district.getValue()) return; // Skip if reset to null
            
            Map.clear();
            Map.setOptions('HYBRID');
            var layer = province.filterMetadata('ADM2_EN', 'equals', panel.district.getValue());
            var aoi_name = panel.district.getValue();
            var aoi_img = img1.clip(layer);

            Map.addLayer(aoi_img, vis, aoi_name + ' FSM LGBM');

            var nullImage = ee.Image().byte();
            var district_outline = nullImage.paint({
                featureCollection: layer,
                width: 1.5
            });

            // Hide all charts panel and create a new one for the district
            chartsPanel.style().set('shown', false);
            
            var districtChartPanel = ui.Panel({
                style: {
                    margin: '0px 0px 0px 0px',
                    position: 'bottom-right',
                    padding: '1px, 1px',
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    width: '380px'
                }
            });

            var chart = generateAreaChart(aoi_img, layer, valuesList, namesList, palette);
            districtChartPanel.add(chart);
            Map.add(districtChartPanel);

            Map.addLayer(district_outline, {
                palette: 'black'
            }, panel.district.getValue() + ' Boundary');
            Map.centerObject(layer);
        }
    }),
    resetBtn: ui.Button({
        label: 'Reset Map',
        style: styleButton,
        onClick: resetApp
    }),
    loading: ui.Label({
        value: 'Waiting for the district area to be selected...',
        style: {
            shown: true,
            color: 'grey',
            fontSize: '12px',
            fontStyle: 'italic',
            margin: '5px 5px 10px 5px'
        }
    }),
    divider3: ui.Panel({style: dividerStyle}),
    legend_title: ui.Label({
        value: 'Legend',
        style: {
            fontWeight: 'bold',
            fontSize: '16px',
            margin: '5px 5px 8px 5px',
            color: '#333333'
        }
    })
};

// Create the legend items
function createLegendItem(color, label) {
    return ui.Panel({
        widgets: [
            ui.Label({
                style: {
                    backgroundColor: color,
                    padding: '8px',
                    margin: '0 10px 5px 5px',
                    border: '1px solid #999'
                }
            }),
            ui.Label({
                value: label,
                style: {
                    fontSize: '12px',
                    margin: '0px'
                }
            })
        ], 
        layout: ui.Panel.Layout.Flow('horizontal')
    });
}

var legendItems = [
    createLegendItem(palette[0], 'Very Low Flood'),
    createLegendItem(palette[1], 'Low Flood'),
    createLegendItem(palette[2], 'Moderate Flood'),
    createLegendItem(palette[3], 'High Flood'),
    createLegendItem(palette[4], 'Very High Flood')
];

var panel_fill = ui.Panel({
    widgets: [
        panel.title,
        panel.divider1,
        panel.provider,
        panel.source,
        panel.paperlink,
        panel.divider2,
        panel.sec_panel,
        panel.sub_title,
        panel.area_list,
        panel.pro,
        panel.province,
        panel.dis,
        panel.district,
        panel.resetBtn,
        panel.loading,
        panel.divider3,
        panel.legend_title,
    ].concat(legendItems).concat([
        ui.Panel({style: dividerStyle}),
        ui.Label('About', styleH2),
        ui.Label({
            value: 'App Created By: Mirza Waleed',
            style: {fontSize: '12px', margin: '3px 5px', fontWeight: 'bold'}
        }),
        ui.Label({
            value: 'Email: waleedgeo@outlook.com',
            style: {fontSize: '12px', margin: '3px 5px'}
        }).setUrl('mailto:waleedgeo@outlook.com'),
        ui.Label({
            value: 'Website: waleedgeo.com',
            style: {fontSize: '12px', margin: '3px 5px'}
        }).setUrl('https://waleedgeo.com'),
        ui.Label({
            value: 'LinkedIn: WaleedGeo',
            style: {fontSize: '12px', margin: '3px 5px'}
        }).setUrl('https://www.linkedin.com/in/waleedgeo')
    ]),
    style: {
        margin: '12px',
        position: 'top-right',
        width: '320px',
        backgroundColor: 'white',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '5px'
    },
});

// Initialize the app
Map.setOptions('HYBRID');
Map.setCenter(70.704, 30.655, 6.5);

// Add initial layers
Map.addLayer(national_boundary, {
    palette: 'black'
}, 'Pakistan Boundary');

Map.addLayer(img1, vis, 'FSM LGBM');
Map.addLayer(img2, vis, 'FSM XGBoost', false);
Map.addLayer(adm1_boundary, {
        palette: 'black'
    }, 'Provinces Boundary');
ui.root.add(panel_fill);

// Initialize charts when the app loads
initializeCharts();

province_list.evaluate(function (provlist) {
  panel.province.items().reset(provlist);
});
