// ============================================================================
// FSM-PK: High-Resolution Flood Susceptibility Mapping for Pakistan
// Google Earth Engine Application
// Author: Mirza Waleed (waleedgeo@outlook.com)
// License: CC BY-NC-SA 4.0
// ============================================================================

// ============================================================================
// DATA CONFIGURATION
// ============================================================================

var valuesList = [1, 2, 3, 4, 5];
var namesList = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
var palette = ["#2E7D32", "#7CB342", "#FDD835", "#FB8C00", "#C62828"];

// Pakistan FSM statistics (percentage by susceptibility class)
var pakistanFSMData = [
    { class: 'Very Low', percentage: 57.91 },
    { class: 'Low', percentage: 12.05 },
    { class: 'Medium', percentage: 9.29 },
    { class: 'High', percentage: 8.04 },
    { class: 'Very High', percentage: 12.71 }
];

// Province FSM statistics
var provinceFSMData = [
    { province: 'Azad Kashmir', veryLow: 98.15, low: 1.65, moderate: 0.18, high: 0.02, veryHigh: 0 },
    { province: 'Balochistan', veryLow: 65.5, low: 9.66, moderate: 5.26, high: 4.95, veryHigh: 14.63 },
    { province: 'Gilgit Baltistan', veryLow: 97.8, low: 1.78, moderate: 0.25, high: 0.16, veryHigh: 0.01 },
    { province: 'Islamabad', veryLow: 99.99, low: 0.01, moderate: 0, high: 0, veryHigh: 0 },
    { province: 'Khyber Pakhtunkhwa', veryLow: 90.76, low: 2.45, moderate: 2.04, high: 2.1, veryHigh: 2.65 },
    { province: 'Punjab', veryLow: 30.6, low: 24.39, moderate: 21.72, high: 13.02, veryHigh: 10.26 },
    { province: 'Sindh', veryLow: 25.97, low: 13.89, moderate: 12.32, high: 18.64, veryHigh: 29.18 }
];

var vis = { min: 1, max: 5, palette: palette };

// ============================================================================
// DATA LOADING
// ============================================================================

var img1 = ee.Image('projects/waleedgeo/assets/fsm_pk_lgbm');
var img2 = ee.Image('projects/waleedgeo/assets/fsm_pk_xgboost');

var province = ee.FeatureCollection('projects/pak-var/assets/pak_adm2');
var province_list = province.aggregate_array('ADM1_EN').distinct();

var national = ee.FeatureCollection('projects/pak-var/assets/pak_adm0');
var empty = ee.Image().byte();
var national_boundary = empty.paint({ featureCollection: national, width: 2 });

var adm1 = ee.FeatureCollection("projects/pak-var/assets/pk_adm1");
var adm1_boundary = empty.paint({ featureCollection: adm1, width: 1 });

// ============================================================================
// UI STYLES
// ============================================================================

var colors = {
    primary: '#1565C0',
    primaryLight: '#42A5F5',
    accent: '#43A047',
    text: '#212121',
    textLight: '#616161',
    textMuted: '#9E9E9E',
    divider: '#E0E0E0',
    background: '#FFFFFF',
    cardBg: '#F5F5F5'
};

var styles = {
    panel: {
        width: '280px',
        padding: '12px',
        backgroundColor: colors.background
    },
    h1: {
        fontWeight: 'bold',
        fontSize: '14px',
        color: colors.primary,
        margin: '0 0 2px 0'
    },
    h2: {
        fontWeight: 'bold',
        fontSize: '12px',
        color: colors.text,
        margin: '10px 0 4px 0'
    },
    h3: {
        fontWeight: 'bold',
        fontSize: '11px',
        color: colors.textLight,
        margin: '8px 0 3px 0'
    },
    text: {
        fontSize: '11px',
        color: colors.textLight,
        margin: '3px 0'
    },
    textSmall: {
        fontSize: '10px',
        color: colors.textMuted,
        margin: '2px 0'
    },
    link: {
        fontSize: '11px',
        color: colors.primary,
        margin: '2px 0'
    },
    select: {
        width: '256px',
        margin: '3px 0'
    },
    button: {
        fontSize: '12px',
        margin: '8px auto'
    },
    divider: {
        height: '1px',
        backgroundColor: colors.divider,
        margin: '10px 0'
    }
};

// ============================================================================
// CHART FUNCTIONS
// ============================================================================

function createPieChartSliceDictionary(fc) {
    return ee.List(fc.aggregate_array("landcover_class_palette"))
        .map(function (p) { return { 'color': p }; }).getInfo();
}

function generateAreaChart(image, aoi, valuesList, namesList, palette) {
    var lookupNames = ee.Dictionary.fromLists(
        valuesList.map(function (num) { return num.toString(); }), namesList);
    var lookupPalette = ee.Dictionary.fromLists(
        valuesList.map(function (num) { return num.toString(); }), palette);

    var areaImageWithClass = ee.Image.pixelArea().divide(1e6).addBands(image);

    var reductionResults = areaImageWithClass.reduceRegion({
        reducer: ee.Reducer.sum().group({ groupField: 1, groupName: 'landcover_class_value' }),
        geometry: aoi,
        scale: 30,
        bestEffort: true
    });

    var classStats = ee.List(reductionResults.get('groups'));
    var landcoverFc = ee.FeatureCollection(classStats.map(function (classStat) {
        classStat = ee.Dictionary(classStat);
        var classValue = classStat.get('landcover_class_value');
        return ee.Feature(null, {
            'landcover_class_name': lookupNames.get(classValue),
            'area_km2': classStat.get('sum'),
            'landcover_class_palette': lookupPalette.get(classValue)
        });
    }));

    return ui.Chart.feature.byFeature({
        features: landcoverFc,
        xProperty: 'landcover_class_name',
        yProperties: ['area_km2']
    }).setChartType('PieChart').setOptions({
        title: 'FSM Area Distribution',
        titleTextStyle: { fontSize: 12, bold: true },
        slices: createPieChartSliceDictionary(landcoverFc),
        sliceVisibilityThreshold: 0,
        legend: { position: 'none' },
        chartArea: { width: '80%', height: '80%' }
    });
}

function createStaticPieChart(data, title, regionType) {
    var dataTable = [['Class', 'Percentage']];
    if (regionType === 'pakistan') {
        data.forEach(function (item) { dataTable.push([item.class, item.percentage]); });
    } else {
        dataTable.push(['Very Low', data.veryLow]);
        dataTable.push(['Low', data.low]);
        dataTable.push(['Moderate', data.moderate]);
        dataTable.push(['High', data.high]);
        dataTable.push(['Very High', data.veryHigh]);
    }

    return ui.Chart(dataTable).setChartType('PieChart').setOptions({
        title: title,
        titleTextStyle: { fontSize: 10, bold: true },
        slices: { 0: { color: palette[0] }, 1: { color: palette[1] }, 2: { color: palette[2] }, 3: { color: palette[3] }, 4: { color: palette[4] } },
        legend: { position: 'none' },
        width: 180,
        height: 150,
        chartArea: { width: '85%', height: '85%' }
    });
}

// ============================================================================
// CHARTS PANEL (Bottom)
// ============================================================================

var chartsPanel = ui.Panel({
    style: {
        position: 'bottom-center',
        padding: '2px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },
    layout: ui.Panel.Layout.Flow('horizontal')
});

var chartPanels = {};

function initializeCharts() {
    chartsPanel.clear();
    chartPanels = {};

    var pakistanChart = createStaticPieChart(pakistanFSMData, 'Pakistan', 'pakistan');
    var pakistanContainer = ui.Panel({ widgets: [pakistanChart], style: { margin: '0 8px' } });
    chartPanels['pakistan'] = pakistanContainer;
    chartsPanel.add(pakistanContainer);

    provinceFSMData.forEach(function (pData) {
        var pChart = createStaticPieChart(pData, pData.province, 'province');
        var pContainer = ui.Panel({ widgets: [pChart], style: { margin: '0 8px' } });
        chartPanels[pData.province] = pContainer;
        chartsPanel.add(pContainer);
    });

    Map.add(chartsPanel);
}

// ============================================================================
// APP FUNCTIONS
// ============================================================================

function resetApp() {
    Map.clear();
    Map.setOptions('HYBRID');
    Map.addLayer(national_boundary, { palette: 'black' }, 'Pakistan Boundary');
    Map.addLayer(img1, vis, 'FSM LGBM');
    Map.addLayer(img2, vis, 'FSM XGBoost', false);
    Map.addLayer(adm1_boundary, { palette: 'black' }, 'Provinces Boundary');

    uiElements.province.setValue(null);
    uiElements.district.setValue(null);
    uiElements.district.setDisabled(true);

    Map.setCenter(70.704, 30.655, 6.5);
    chartsPanel.style().set('shown', true);
    initializeCharts();
    uiElements.statusLabel.style().set({ shown: true });
}

// ============================================================================
// UI ELEMENTS
// ============================================================================

var uiElements = {
    // Header
    title: ui.Label('Flood Susceptibility Mapping', styles.h1),
    subtitle: ui.Label('High-Resolution (30m) National Assessment for Pakistan', {
        fontSize: '10px', color: colors.textLight, margin: '0 0 8px 0', fontStyle: 'italic'
    }),

    divider1: ui.Panel({ style: styles.divider }),

    // Open Source Data Section
    dataHeader: ui.Label('Open Source Data', styles.h2),
    dataDesc: ui.Label('The FSM data is freely available for research use:', styles.text),

    dataLinks: ui.Panel({
        widgets: [
            ui.Label('• Zenodo: doi.org/10.5281/zenodo.18513601', styles.link)
                .setUrl('https://doi.org/10.5281/zenodo.18513601'),
            ui.Label('• GitHub: github.com/waleedgeo/FSM-PK', styles.link)
                .setUrl('https://github.com/waleedgeo/FSM-PK')
        ],
        style: { margin: '4px 0 0 8px' }
    }),

    divider2: ui.Panel({ style: styles.divider }),

    // Citation Section
    citationHeader: ui.Label('Citation', styles.h2),
    citationText: ui.Label(
        'Waleed, M., & Sajjad, M. (2025). High-resolution flood susceptibility mapping... IJDRR, 121, 105442.',
        styles.textSmall
    ).setUrl('https://doi.org/10.1016/j.ijdrr.2025.105442'),

    divider3: ui.Panel({ style: styles.divider }),

    // Area Selection Section
    areaHeader: ui.Label('Area Selection', styles.h2),
    areaDesc: ui.Label('Select province and division to view detailed statistics.', styles.text),

    provinceLabel: ui.Label('Province:', styles.h3),
    province: ui.Select({
        placeholder: 'Select Province',
        style: styles.select,
        onChange: function (val) {
            if (!val) return;
            uiElements.statusLabel.style().set({ shown: false });
            uiElements.district.set({ disabled: false });

            var filter = province.filterMetadata('ADM1_EN', 'equals', val);
            filter.aggregate_array('ADM2_EN').evaluate(function (list) {
                uiElements.district.items().reset(list);
            });

            Object.keys(chartPanels).forEach(function (key) {
                if (key !== val) chartPanels[key].style().set('shown', false);
            });
        }
    }),

    districtLabel: ui.Label('Division:', styles.h3),
    district: ui.Select({
        placeholder: 'Select Division',
        style: styles.select,
        disabled: true,
        onChange: function () {
            if (!uiElements.district.getValue()) return;

            Map.clear();
            Map.setOptions('HYBRID');

            var layer = province.filterMetadata('ADM2_EN', 'equals', uiElements.district.getValue());
            var aoi_name = uiElements.district.getValue();
            var aoi_img = img1.clip(layer);

            Map.addLayer(aoi_img, vis, aoi_name + ' FSM LGBM');

            var nullImage = ee.Image().byte();
            var district_outline = nullImage.paint({ featureCollection: layer, width: 1.5 });

            chartsPanel.style().set('shown', false);

            var districtChartPanel = ui.Panel({
                style: {
                    position: 'bottom-right',
                    padding: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    width: '350px'
                }
            });

            var chart = generateAreaChart(aoi_img, layer, valuesList, namesList, palette);
            districtChartPanel.add(chart);
            Map.add(districtChartPanel);

            Map.addLayer(district_outline, { palette: 'black' }, aoi_name + ' Boundary');
            Map.centerObject(layer);
        }
    }),

    resetBtnPanel: ui.Panel({
        widgets: [ui.Button({ label: 'Reset Map', style: styles.button, onClick: resetApp })],
        layout: ui.Panel.Layout.Flow('horizontal'),
        style: { textAlign: 'center' }
    }),

    statusLabel: ui.Label('Select a division to view statistics...', {
        shown: true, fontSize: '10px', fontStyle: 'italic', color: colors.textMuted, margin: '4px 0'
    }),

    divider4: ui.Panel({ style: styles.divider }),

    // Legend Section
    legendHeader: ui.Label('Legend', styles.h2)
};

// ============================================================================
// LEGEND
// ============================================================================

// Legend - clean vertical list
function makeLegendItem(color, label) {
    return ui.Panel({
        widgets: [
            ui.Label({ style: { backgroundColor: color, padding: '8px 12px', margin: '0 8px 0 0' } }),
            ui.Label(label, { fontSize: '11px', color: colors.text, margin: '0' })
        ],
        layout: ui.Panel.Layout.Flow('horizontal'),
        style: { margin: '2px 0' }
    });
}

var legendPanel = ui.Panel({
    widgets: [
        makeLegendItem(palette[0], 'Very Low'),
        makeLegendItem(palette[1], 'Low'),
        makeLegendItem(palette[2], 'Moderate'),
        makeLegendItem(palette[3], 'High'),
        makeLegendItem(palette[4], 'Very High')
    ],
    style: { margin: '4px 0' }
});

// ============================================================================
// ABOUT SECTION
// ============================================================================

// About section
var aboutSection = ui.Panel({
    widgets: [
        ui.Panel({ style: { height: '1px', backgroundColor: colors.divider, margin: '8px 0 6px 0' } }),
        ui.Label('About', { fontSize: '12px', fontWeight: 'bold', color: colors.text, margin: '0 0 4px 0' }),
        ui.Label('Developed by Mirza Waleed', { fontSize: '11px', color: colors.textLight, margin: '2px 0' }),
        ui.Label('waleedgeo@outlook.com', { fontSize: '11px', color: colors.primary, margin: '2px 0' }).setUrl('mailto:waleedgeo@outlook.com'),
        ui.Panel({
            widgets: [
                ui.Label('Website', { fontSize: '11px', color: colors.primary, margin: '0 10px 0 0' }).setUrl('https://waleedgeo.com'),
                ui.Label('LinkedIn', { fontSize: '11px', color: colors.primary, margin: '0' }).setUrl('https://www.linkedin.com/in/waleedgeo')
            ],
            layout: ui.Panel.Layout.Flow('horizontal'),
            style: { margin: '2px 0' }
        })
    ]
});

// ============================================================================
// MAIN PANEL
// ============================================================================

var mainPanel = ui.Panel({
    widgets: [
        uiElements.title,
        uiElements.subtitle,
        uiElements.divider1,
        uiElements.dataHeader,
        uiElements.dataDesc,
        uiElements.dataLinks,
        uiElements.divider2,
        uiElements.citationHeader,
        uiElements.citationText,
        uiElements.divider3,
        uiElements.areaHeader,
        uiElements.areaDesc,
        uiElements.provinceLabel,
        uiElements.province,
        uiElements.districtLabel,
        uiElements.district,
        uiElements.resetBtnPanel,
        uiElements.statusLabel,
        uiElements.divider4,
        uiElements.legendHeader,
        legendPanel,
        aboutSection
    ],
    style: styles.panel
});

// ============================================================================
// APP INITIALIZATION
// ============================================================================

Map.setOptions('HYBRID');
Map.setCenter(70.704, 30.655, 6.5);

Map.addLayer(national_boundary, { palette: 'black' }, 'Pakistan Boundary');
Map.addLayer(img1, vis, 'FSM LGBM');
Map.addLayer(img2, vis, 'FSM XGBoost', false);
Map.addLayer(adm1_boundary, { palette: 'black' }, 'Provinces Boundary');

ui.root.add(mainPanel);
initializeCharts();

province_list.evaluate(function (provlist) {
    uiElements.province.items().reset(provlist);
});
