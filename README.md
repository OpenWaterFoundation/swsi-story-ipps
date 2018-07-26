# swsi-story-ipps

This repository contains the "South Platte and Metro Basin IPPs" story and all of its associated content.  
The story provides background information and current status of Identified Projects and Processes (IPPs) 
in the South Platte and Metro basins of Colorado.  IPPs are expected to help address the water supply gap 
identified in the Statewide Water Supply Initiative (SWSI), South Platte Basin Implementation Plan (BIP) 
and the Colorado Water Plan (CWP).

The IPP story was created with the [fullPage.js](https://alvarotrigo.com/fullPage/) JavaScript library.  
See the story [deployed on the Open Water Foundation (OWF)'s website](http://stories.openwaterfoundation.org/co/swsi-story-ipps-sp/).


## Repository Contents ##

The repository contains the following:

```text
build-util/           Folder containing useful scripts to view, build, and deploy documentation
site/                 Folder containing the static website and all of the data in the website
  css/                Folder containing CSS (cascading style sheet) files used to style the story 
  data/               Folder containing data used to create visualizations, such as maps
  images/             Folder containing images used within the story
  js/                 Folder containing JavaScript files used within the story, including copies of third-party libraries and local code
  webfonts/           Folder containing fonts used within the story
  index.html          The landing page (website) for the story
  VERSION.txt         Text file that provides the date of the last update of the story 
.gitattributes        Typical Git configuration file for repository attributes, in particular handling of line-ending and binary files
.gitignore            Typical Git configuration file to ignore files that should not be committed to the repository
README.md             This file; an explanation of repository contents, data files and sources

```

## Data Sources for IPP Story ##
The table below lists each page of the IPP story and the data, if applicable, used to create the visualization within that page.  
Any data processing steps are summarized in the README.md file in the `data` folder.

Page Number | Page Name | Data Files | Data Source
--- | --- | --- | ---
1 | South Platte and Metro Basin IPPs | None | None
2 | IPP Background: SWSI 2004 | None | None
3 | IPP Background: SWSI 2010 Municipal & Industrial IPPs | None | None
4 | IPP Background: SWSI 2010 Environmental & Recreational IPPs | None | None
5 | South Platte & Metro BIP and Municipal & Industrial IPPs | None | None
6 | South Platte & Metro BIP and Agricultural IPPs | None | None
7 | South Platte & Metro BIP and Environmental and Recreational IPPs | SouthPlatteMetro-instreamflow-reaches-decreed.geojson | [Colorado's Decision Support Systems (CDSS)](http://cdss.state.co.us/GIS/Pages/AllGISData.aspx)
8 | IPPs Updated for SWSI Update and South Platte Data Platform | None | None
9 | IPPs by Location Flag | SouthPlatteMetro-IPPs.geojson | HDR (consulting firm)
10 | IPPs by Basin and Yield | SouthPlatteMetro-IPPs.geojson | HDR (consulting firm)
11 | IPPs by Basin and Cost | SouthPlatteMetro-IPPs.geojson | HDR (consulting firm)
12 | Example IPP: NISP | NCWCD-boundary.geojson, NISP-canals-js.geojson, NISP-participants-js.geojson, NISP-reservoirs-js.geojson | [Colorado Special District Mapping Project](https://demography.dola.colorado.gov/CO_SpecialDistrict/), [Northern Water](http://www.northernwater.org/sf/home), [CDSS](http://cdss.state.co.us/GIS/Pages/AllGISData.aspx)
13 | Example IPP: ACWWA Flow Project | ACWWA-boundary.geojson, Chambers-Reservoir.geojson, ECCV-boundary.geojson, ECCV-WTP.geojson, Northern-Pipeline.geojson | [Arapahoe County Water and Wastewater Authority (ACWWA)](https://www.google.com/maps/d/viewer?mid=1vlGZrFPnhBX-mSSnnkN_T6nJMgU&ll=39.58385025572299%2C-104.805972&z=14), [Colorado Special District Mapping Project](https://demography.dola.colorado.gov/CO_SpecialDistrict/)
14 | Resources | None | None
15 | Sources | None | None

## Contributing ##

The Open Water Foundation has created this story during the South Platte Data Platform project.
If you use the repository and have comments, please contact the maintainers and/or use the GitHub issues to provide feedback.

## Maintainers ##

Kristin Swaim (@kswaim, kristin.swaim@openwaterfoundation.org) is the primary maintainer at the Open Water Foundation.

Steve Malers (@smalers, steve.malers@openwaterfoundation.org) is the secondary contact.

## Contributors ##

None yet, other than OWF staff.