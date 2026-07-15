# High-resolution Flood Susceptibility Mapping and Exposure Assessment in Pakistan

[![DOI](https://img.shields.io/badge/DOI-10.1016%2Fj.ijdrr.2025.105442-blue)](https://doi.org/10.1016/j.ijdrr.2025.105442)
[![Zenodo](https://img.shields.io/badge/Data-Zenodo-blue)](https://doi.org/10.5281/zenodo.18513601)
[![FCFs Zenodo](https://img.shields.io/badge/FCFs-Zenodo-blue)](https://doi.org/10.5281/zenodo.20200726)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](http://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Open Access](https://img.shields.io/badge/Open%20Access-Yes-success)](https://doi.org/10.1016/j.ijdrr.2025.105442)
[![Python 3.8+](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/downloads/)
[![GEE App](https://img.shields.io/badge/GEE-Interactive%20App-green)](https://waleedgeo-ee.projects.earthengine.app/view/fsm-pk)

<table>
  <tr>
    <td align="center">
      <img src="img/v-r1Artboard 3.webp" alt="FSM Pakistan Combined Overview" width="100%">
    </td>
  </tr>
</table>

---

## Open Source Data Available

The **high-resolution (30m) flood susceptibility maps for Pakistan** and the **flood conditioning raster layers** used in the associated research are publicly available for download.

| Download Option | Link | Format |
|-----------------|------|--------|
| **Flood Susceptibility Maps** | [doi.org/10.5281/zenodo.18513601](https://doi.org/10.5281/zenodo.18513601) | Cloud Optimized GeoTIFF |
| **LGBM Model (Direct)** | [Download fsm_lgbm_pakistan.tif](https://zenodo.org/records/18513602/files/fsm_lgbm_pakistan.tif?download=1) | GeoTIFF (~150 MB) |
| **XGBoost Model (Direct)** | [Download fsm_xgboost_pakistan.tif](https://zenodo.org/records/18513602/files/fsm_xgboost_pakistan.tif?download=1) | GeoTIFF (~150 MB) |
| **Flood Conditioning Rasters** | [doi.org/10.5281/zenodo.20200726](https://doi.org/10.5281/zenodo.20200726) | Cloud Optimized GeoTIFF |
| **Google Earth Engine** | See [GEE Assets](#google-earth-engine-assets) section | EE Asset |

---

## Overview

This repository provides the **first national-scale, high-resolution (30m) flood susceptibility maps for Pakistan**, developed using an integrated artificial intelligence, machine learning, and geospatial framework.

### Key Highlights

- **High-Resolution Mapping**: National-scale flood susceptibility maps at **30m spatial resolution**
- **Best Performing Model**: LightGBM (LGBM) with **0.85 accuracy**
- **Five Susceptibility Classes**: Very Low, Low, Moderate, High, Very High
- **Cloud-Native Access**: Available as Cloud Optimized GeoTIFFs and Google Earth Engine assets
- **Interactive Web App**: Explore data without coding via [GEE App](https://waleedgeo-ee.projects.earthengine.app/view/fsm-pk)

---

## Publication

**Waleed, M., & Sajjad, M. (2025).** *High-resolution flood susceptibility mapping and exposure assessment in Pakistan: An integrated artificial intelligence, machine learning and geospatial framework.* **International Journal of Disaster Risk Reduction**, 121, 105442.

| Resource | Link |
|----------|------|
| Paper DOI | [doi.org/10.1016/j.ijdrr.2025.105442](https://doi.org/10.1016/j.ijdrr.2025.105442) |
| Paper PDF | [Download PDF](data/Waleed%20and%20Sajjad%20-%202025%20-%20High-resolution%20flood%20susceptibility%20mapping%20and%20exposure%20assessment%20in%20Pakistan%20An%20integrated%20arti.pdf) |

> **Note**: Figure 8 has been corrected. See [Corrigendum DOI: 10.1016/j.ijdrr.2025.105842](https://doi.org/10.1016/j.ijdrr.2025.105842) (Published: November 14, 2025)

---

## Interactive Notebooks

We provide two Jupyter notebooks for working with the flood susceptibility data:

<table>
  <tr>
    <th>Notebook</th>
    <th>Description</th>
    <th>Launch</th>
  </tr>
  <tr>
    <td><b><a href="notebooks/01_zenodo_cog_analysis.ipynb">01_zenodo_cog_analysis.ipynb</a></b></td>
    <td>
      <b>Cloud-Native COG Workflow</b><br>
      Work with Zenodo-hosted Cloud Optimized GeoTIFFs directly without downloading. Demonstrates windowed reads for regional analysis (e.g., Karachi), visualization with custom colormaps, and efficient data extraction.
    </td>
    <td>
      <a href="https://colab.research.google.com/github/waleedgeo/FSM-PK/blob/main/notebooks/01_zenodo_cog_analysis.ipynb">
        <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab">
      </a>
    </td>
  </tr>
  <tr>
    <td><b><a href="notebooks/02_gee_interactive_map.ipynb">02_gee_interactive_map.ipynb</a></b></td>
    <td>
      <b>Google Earth Engine Workflow</b><br>
      Server-side processing using GEE Python API. Features interactive split-panel comparison with satellite imagery, spatial analysis, and area calculations using geemap.
    </td>
    <td>
      <a href="https://colab.research.google.com/github/waleedgeo/FSM-PK/blob/main/notebooks/02_gee_interactive_map.ipynb">
        <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab">
      </a>
    </td>
  </tr>
</table>

See [`docs/environment_setup.md`](docs/environment_setup.md) for setup instructions.

---

## Data Access

### Zenodo Repository (Cloud Optimized GeoTIFFs)

The recommended method for downloading and analyzing data locally:

- **DOI**: [10.5281/zenodo.18513601](https://doi.org/10.5281/zenodo.18513601)
- **Format**: Cloud Optimized GeoTIFF (COG) - supports windowed reads without full download
- **LGBM Model**: [fsm_lgbm_pakistan.tif](https://zenodo.org/records/18513602/files/fsm_lgbm_pakistan.tif?download=1) (Best performing, 0.85 accuracy)
- **XGBoost Model**: [fsm_xgboost_pakistan.tif](https://zenodo.org/records/18513602/files/fsm_xgboost_pakistan.tif?download=1) (0.82 accuracy)

### Flood Conditioning Raster Layers Dataset

The Zenodo dataset **High-Resolution (30 m) Flood Conditioning Raster Layers for Flood Susceptibility Modelling in Pakistan** provides the national-scale predictor layers used in the associated study.

- **Zenodo DOI**: [10.5281/zenodo.20200726](https://doi.org/10.5281/zenodo.20200726)
- **Citation**: Waleed, M. (2026). *High-Resolution (30 m) Flood Conditioning Raster Layers for Flood Susceptibility Modelling in Pakistan* [Dataset]. Zenodo. https://doi.org/10.5281/zenodo.20200726
- **Coverage**: Pakistan
- **Resolution**: 30 metres
- **CRS**: EPSG:3395, WGS 84 / World Mercator
- **Format**: Cloud Optimized GeoTIFF
- **Data type**: Unsigned 16-bit integer with 65535 reserved for NoData

The collection contains 13 raster layers: 10 principal flood conditioning features used in the published LightGBM and XGBoost models, plus 3 supplementary layers for transparency, sensitivity analysis, and further research. The principal features are Aspect, Curvature, Distance to drainage, Distance to rivers, Distance to roads, Elevation, NDVI, Rainfall frequency above 10 mm, Slope, and Topographic Wetness Index.

Supplementary layers include Rainfall frequency above 50 mm, Maximum rainfall intensity, and OpenStreetMap-derived water presence.

For reproducibility, the dataset also includes scaled continuous rasters with metadata tags for reconstructing original values, and users should follow the preprocessing and modelling workflow described in the associated article when reproducing the published results.

### Google Earth Engine Assets

For server-side processing without downloading:

| Model | Asset ID |
|-------|----------|
| LGBM | `projects/waleedgeo/assets/fsm_pk_lgbm` |
| XGBoost | `projects/waleedgeo/assets/fsm_pk_xgboost` |

### Interactive Web Application

<div align="center">
  <a href="https://waleedgeo-ee.projects.earthengine.app/view/fsm-pk">
    <img src="img/fsm-pk-app.png" alt="FSM Pakistan App" width="600">
  </a>
  <br>
  <strong><a href="https://waleedgeo-ee.projects.earthengine.app/view/fsm-pk">Launch FSM-PK Interactive App</a></strong>
</div>

<br>

<div align="center">
  <img src="other/fsm-pk-optimizedgif.gif" alt="FSM PK Demo" width="600">
</div>

### Data Specifications

| Property | Value |
|----------|-------|
| Spatial Resolution | 30 meters |
| Coordinate System | EPSG:4326 (WGS84) |
| Extent | Pakistan national boundary |
| Value Range | 1-5 (Very Low to Very High) |
| Data Type | Unsigned 8-bit integer |

For detailed data access instructions, see [`data/README.md`](data/README.md).

---

## Repository Structure

```
FSM-PK/
├── data/                    # Data documentation and paper PDF
├── notebooks/               # Jupyter notebooks (COG & GEE workflows)
├── codes/                   # GEE App source code
├── docs/                    # Setup documentation
├── img/                     # Images and figures
├── other/                   # Citation files and demo GIF
├── requirements.txt         # Python dependencies
└── LICENSE                  # CC BY-NC-SA 4.0
```

---

## Citation

```bibtex
@article{WALEED2025105442,
  title = {High-resolution flood susceptibility mapping and exposure assessment in Pakistan: An integrated artificial intelligence, machine learning and geospatial framework},
  journal = {International Journal of Disaster Risk Reduction},
  volume = {121},
  pages = {105442},
  year = {2025},
  doi = {https://doi.org/10.1016/j.ijdrr.2025.105442},
  author = {Mirza Waleed and Muhammad Sajjad}
}
```

```bibtex
@dataset{WALEED202620200726,
  title = {High-Resolution (30 m) Flood Conditioning Raster Layers for Flood Susceptibility Modelling in Pakistan},
  author = {Waleed, Mirza},
  year = {2026},
  publisher = {Zenodo},
  doi = {10.5281/zenodo.20200726},
  url = {https://doi.org/10.5281/zenodo.20200726}
}
```

**Export citation**: [BibTeX](other/fsm-pk.bib) | [RIS](other/fsm-pk.ris)

---

## Authors

| | |
|---|---|
| **Mirza Waleed** | Primary Author |
| Email | [waleedgeo@outlook.com](mailto:waleedgeo@outlook.com) |
| LinkedIn | [linkedin.com/in/waleedgeo](https://www.linkedin.com/in/waleedgeo) |
| Website | [waleedgeo.com](https://waleedgeo.com) |
| | |
| **Dr. Muhammad Sajjad** | Co-author |
| Google Scholar | [Profile](https://scholar.google.com.hk/citations?user=iuXamUEAAAAJ&hl=en) |

---

## License

**Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**

[![License: CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-sa/4.0/)

---

## Keywords

`flood` · `Pakistan` · `flood susceptibility` · `machine learning` · `LGBM` · `XGBoost` · `Google Earth Engine` · `geospatial` · `remote sensing` · `disaster risk management`

---

<div align="center">

**If you find this work useful, please star this repository!**

[![Star History Chart](https://api.star-history.com/svg?repos=waleedgeo/FSM-PK&type=Date)](https://star-history.com/#waleedgeo/FSM-PK&Date)

</div>