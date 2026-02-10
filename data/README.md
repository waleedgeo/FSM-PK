# Data Access Guide

This directory contains documentation for accessing the FSM-PK flood susceptibility data.

## Available Datasets

### 1. LGBM Model Output
- **Resolution**: 30 meters
- **Accuracy**: 0.85
- **File Name**: `fsm_lgbm_pakistan.tif`
- **Classes**: 1-5 (Very Low to Very High susceptibility)

### 2. XGBoost Model Output
- **Resolution**: 30 meters
- **Accuracy**: 0.82
- **File Name**: `fsm_xgboost_pakistan.tif`
- **Classes**: 1-5 (Very Low to Very High susceptibility)

---

## Access Methods

### Method 1: Zenodo Cloud Optimized GeoTIFFs (Recommended for Analysis)

**Zenodo DOI**: [10.5281/zenodo.18513601](https://doi.org/10.5281/zenodo.18513601)

**Direct Download URLs**:
```
LGBM:    https://zenodo.org/records/18513602/files/fsm_lgbm_pakistan.tif?download=1
XGBoost: https://zenodo.org/records/18513602/files/fsm_xgboost_pakistan.tif?download=1
```

**Advantages**:
- ✅ Cloud Optimized GeoTIFF (COG) format
- ✅ Windowed reads without full download
- ✅ No authentication required
- ✅ Accessible via HTTP/HTTPS

**Usage Example** (Python with rioxarray):
```python
import rioxarray as rxr

# Direct cloud access without download
url = "https://zenodo.org/records/18513602/files/fsm_lgbm_pakistan.tif?download=1"
data = rxr.open_rasterio(url, masked=True)

# Read only a specific region (windowed read)
bbox = [66.5, 24.7, 67.5, 25.7]  # Karachi region [minx, miny, maxx, maxy]
karachi_fsm = data.rio.clip_box(*bbox)
```

See: [`notebooks/01_zenodo_cog_analysis.ipynb`](../notebooks/01_zenodo_cog_analysis.ipynb)

---

### Method 2: Google Earth Engine (Recommended for Large-Scale Analysis)

**Asset IDs**:
```
LGBM:    projects/waleedgeo/assets/fsm_pk_lgbm
XGBoost: projects/waleedgeo/assets/fsm_pk_xgboost
```

**Requirements**:
- Google Earth Engine account ([Sign up here](https://earthengine.google.com/signup/))
- Python `earthengine-api` package

**Advantages**:
- ✅ Server-side processing (no data download)
- ✅ Fast computation on Google's infrastructure
- ✅ Integration with other GEE datasets
- ✅ Interactive visualization with geemap

**Usage Example** (Python with earthengine-api):
```python
import ee
import geemap

# Initialize GEE
ee.Initialize()

# Load FSM asset
fsm_lgbm = ee.Image('projects/waleedgeo/assets/fsm_pk_lgbm')

# Create interactive map
Map = geemap.Map()
Map.addLayer(fsm_lgbm, {'min': 1, 'max': 5, 'palette': ['green', 'yellow', 'orange', 'red', 'darkred']}, 'FSM LGBM')
Map.centerObject(fsm_lgbm, 6)
Map.addLayerControl()
Map
```

See: [`notebooks/02_gee_interactive_map.ipynb`](../notebooks/02_gee_interactive_map.ipynb)

---

### Method 3: Interactive Web Application (Recommended for Exploration)

**URL**: [https://waleedgeo-ee.projects.earthengine.app/view/fsm-pk](https://waleedgeo-ee.projects.earthengine.app/view/fsm-pk)

**Features**:
- Visual exploration of flood susceptibility
- Province and district-level statistics
- No coding required
- No authentication required

---

## Data Specifications

| Property | Value |
|----------|-------|
| **Spatial Resolution** | 30 meters |
| **Coordinate System** | EPSG:4326 (WGS84 Geographic) |
| **Extent** | Pakistan national boundary |
| **Data Type** | Unsigned 8-bit integer (UInt8) |
| **Value Range** | 1-5 |
| **NoData Value** | 0 or 255 (depending on access method) |
| **File Size** | ~50-70 MB per file (compressed) |
| **Format** | GeoTIFF (Zenodo), Earth Engine Asset (GEE) |

---

## Classification Scheme

| Value | Class | Description | Color (Suggested) |
|-------|-------|-------------|-------------------|
| 1 | Very Low | Minimal flood susceptibility | Green (#2E7D32) |
| 2 | Low | Low flood susceptibility | Yellow-Green (#7CB342) |
| 3 | Moderate | Moderate flood susceptibility | Yellow (#FDD835) |
| 4 | High | High flood susceptibility | Orange (#FB8C00) |
| 5 | Very High | Very high flood susceptibility | Red (#C62828) |

---

## Recommended Tools

### Python Libraries
```bash
pip install rioxarray rasterio geopandas matplotlib earthengine-api geemap
```

### GIS Software
- **QGIS** (Free, open-source): [Download](https://qgis.org/)
- **ArcGIS Pro** (Commercial)

---

## Support

For questions about data access or technical issues, please contact:
- **Email**: [waleedgeo@outlook.com](mailto:waleedgeo@outlook.com)
- **GitHub Issues**: [Open an issue](https://github.com/waleedgeo/FSM-PK/issues)

---

## Citation

If you use this data, please cite:

```
Waleed, M., & Sajjad, M. (2025). High-resolution flood susceptibility mapping 
and exposure assessment in Pakistan: An integrated artificial intelligence, 
machine learning and geospatial framework. International Journal of Disaster 
Risk Reduction, 121, 105442. https://doi.org/10.1016/j.ijdrr.2025.105442
```
