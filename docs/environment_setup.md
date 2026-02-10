# Environment Setup Guide

This guide provides detailed instructions for setting up your development environment to work with the FSM-PK flood susceptibility data and notebooks.

## Prerequisites

- **Python**: Version 3.8 or higher ([Download Python](https://www.python.org/downloads/))
- **Package Manager**: Conda (recommended) or pip
- **Google Earth Engine Account**: Required for GEE notebook ([Sign up](https://earthengine.google.com/signup/))
- **Git**: For cloning the repository ([Download Git](https://git-scm.com/downloads))

---

## Option 1: Using Conda (Recommended)

Conda provides better dependency management and environment isolation.

### Step 1: Install Miniconda or Anaconda

**Miniconda** (Lightweight):
```bash
# Windows: Download from https://docs.conda.io/en/latest/miniconda.html
# Linux/Mac:
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
```

**Anaconda** (Includes many packages):
- Download from [https://www.anaconda.com/download](https://www.anaconda.com/download)

### Step 2: Clone the Repository

```bash
git clone https://github.com/waleedgeo/FSM-PK.git
cd FSM-PK
```

### Step 3: Create a Conda Environment

```bash
# Create environment with Python 3.10
conda create -n fsm-pk python=3.10 -y

# Activate the environment
conda activate fsm-pk
```

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 5: Verify Installation

```python
python -c "import rioxarray, geemap, ee; print('All packages installed successfully!')"
```

---

## Option 2: Using pip and venv

If you prefer not to use Conda, you can use Python's built-in venv.

### Step 1: Clone the Repository

```bash
git clone https://github.com/waleedgeo/FSM-PK.git
cd FSM-PK
```

### Step 2: Create a Virtual Environment

**Windows**:
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac**:
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

## Google Earth Engine Setup

The GEE notebook requires authentication with Google Earth Engine.

### Step 1: Sign Up for GEE

1. Go to [https://earthengine.google.com/signup/](https://earthengine.google.com/signup/)
2. Sign in with your Google account
3. Fill out the registration form
4. Wait for approval (usually within 1-2 days)

### Step 2: Authenticate Earth Engine

**In Python**:
```python
import ee

# First-time authentication (opens browser)
ee.Authenticate()

# Initialize Earth Engine
ee.Initialize()
```

**Alternative: Using Service Account** (for production):
```python
import ee
from google.oauth2 import service_account

credentials = service_account.Credentials.from_service_account_file(
    'path/to/service-account-key.json'
)
ee.Initialize(credentials)
```

---

## Jupyter Notebook Setup

### Option 1: Jupyter Lab (Recommended)

```bash
# Already installed via requirements.txt
conda activate fsm-pk
jupyter lab
```

Navigate to `notebooks/` and open the desired notebook.

### Option 2: VS Code with Jupyter Extension

1. Install [VS Code](https://code.visualstudio.com/)
2. Install the "Jupyter" extension
3. Open the FSM-PK folder in VS Code
4. Select the `fsm-pk` kernel when opening notebooks

### Option 3: Google Colab (No local setup required)

Click the "Open in Colab" badge at the top of each notebook:

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/)

**Note**: In Colab, you'll need to install dependencies in the first cell:
```python
!pip install rioxarray rasterio geemap earthengine-api
```

---

## Testing Your Setup

### Test 1: Check Python Version

```bash
python --version
# Should show Python 3.8 or higher
```

### Test 2: Test Imports

Create a test script `test_imports.py`:
```python
import sys
print(f"Python version: {sys.version}")

# Test core packages
try:
    import numpy as np
    print(f"✓ NumPy {np.__version__}")
except ImportError as e:
    print(f"✗ NumPy: {e}")

try:
    import rioxarray as rxr
    print(f"✓ rioxarray {rxr.__version__}")
except ImportError as e:
    print(f"✗ rioxarray: {e}")

try:
    import rasterio
    print(f"✓ rasterio {rasterio.__version__}")
except ImportError as e:
    print(f"✗ rasterio: {e}")

try:
    import geopandas as gpd
    print(f"✓ GeoPandas {gpd.__version__}")
except ImportError as e:
    print(f"✗ GeoPandas: {e}")

try:
    import geemap
    print(f"✓ geemap {geemap.__version__}")
except ImportError as e:
    print(f"✗ geemap: {e}")

try:
    import ee
    print(f"✓ earthengine-api {ee.__version__}")
except ImportError as e:
    print(f"✗ earthengine-api: {e}")

print("\n✓ All packages imported successfully!")
```

Run the test:
```bash
python test_imports.py
```

### Test 3: Test Zenodo Data Access

```python
import rioxarray as rxr

url = "https://zenodo.org/records/18513602/files/fsm_lgbm_pakistan.tif?download=1"
try:
    data = rxr.open_rasterio(url, masked=True)
    print(f"✓ Successfully accessed Zenodo COG")
    print(f"  Shape: {data.shape}")
    print(f"  CRS: {data.rio.crs}")
except Exception as e:
    print(f"✗ Error accessing Zenodo: {e}")
```

### Test 4: Test GEE Authentication

```python
import ee

try:
    ee.Initialize()
    print("✓ GEE initialized successfully")
    
    # Try loading an asset
    fsm = ee.Image('projects/waleedgeo/assets/fsm_pk_lgbm')
    info = fsm.getInfo()
    print("✓ Successfully accessed FSM-PK GEE asset")
except Exception as e:
    print(f"✗ GEE error: {e}")
    print("  Run ee.Authenticate() first if this is your first time")
```

---

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'rioxarray'"

**Solution**:
```bash
pip install rioxarray
```

### Issue: GEE Authentication Fails

**Solution**:
1. Ensure you have a GEE account and it's approved
2. Run `ee.Authenticate()` in Python to re-authenticate
3. Check your internet connection
4. Try clearing credentials:
   ```bash
   # Linux/Mac
   rm -rf ~/.config/earthengine/
   
   # Windows
   rmdir /s %USERPROFILE%\.config\earthengine\
   ```

### Issue: "ImportError: DLL load failed" (Windows)

**Solution**: Install Visual C++ Redistributables
- Download from [Microsoft](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist)

### Issue: Jupyter Kernel Not Found

**Solution**:
```bash
conda activate fsm-pk
python -m ipykernel install --user --name=fsm-pk
```

### Issue: COG Access is Slow

**Possible Causes**:
- Slow internet connection
- Large bounding box (reading too much data)

**Solution**:
- Use smaller bounding boxes for windowed reads
- Check your internet speed
- Consider downloading the full file for extensive analysis

---

## Additional Resources

- **rioxarray Documentation**: [https://corteva.github.io/rioxarray/](https://corteva.github.io/rioxarray/)
- **geemap Documentation**: [https://geemap.org/](https://geemap.org/)
- **GEE Python API**: [https://developers.google.com/earth-engine/guides/python_install](https://developers.google.com/earth-engine/guides/python_install)
- **QGIS Tutorials**: [https://www.qgistutorials.com/](https://www.qgistutorials.com/)

---

## Support

If you encounter issues not covered here:

1. Check the [GitHub Issues](https://github.com/waleedgeo/FSM-PK/issues)
2. Open a new issue with:
   - Your operating system
   - Python version
   - Error message (full traceback)
   - Steps to reproduce

Contact: [waleedgeo@outlook.com](mailto:waleedgeo@outlook.com)
