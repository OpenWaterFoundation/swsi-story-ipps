#!/bin/bash
#
# Copy the site/* contents to the stories.openwaterfoundation.org website.
# - replace all the files on the web with local files
# - only copy specific website files such as index.html so as to not clobber other content loaded separately

# Set --dryrun to test before actually doing
dryrun=""
#dryrun="--dryrun"
s3Folder="s3://stories.openwaterfoundation.org/co/swsi-story-ipps-sp"
# runMode indicates what the script should do
# - upload = prep and upload to Amazon S3,
#   used when uploading to OWF website
# - prepUpload = prep the site for upload but don't do it,
#   used when creating the site folder for southplattebasin.com
runMode="upload"

# Make sure that this is being run from the build-util folder
pwd=`pwd`
dirname=`basename ${pwd}`
if [ ! ${dirname} = "build-util" ]
        then
        echo "Must run from build-util folder"
        exit 1
fi

if [ "$1" == "" ]
	then
	echo ""
	echo "Usage:  $0 AmazonConfigProfile"
	echo ""
	echo "Copy the site files to the Amazon S3 static website folder:  $s3Folder"
	echo ""
	exit 0
fi

if [ "$1" == "prep-upload" ]
        then
        # Prep the website for upload in the tmp-build folder but do not actually do the upload.
        # - the site can then be uploaded to southplattebasin.com
        # - don't actually do the upload
        runMode="prepUpload"
fi

awsProfile="$1"

# Get the version to append to files
versionFile="../site/VERSION.txt"
version=`cat "${versionFile}"`
if [ -z "${version}" ]
        then
        echo ""
        echo "No ${versionFile} version file to modify filenames for caching- cannot continue."
        exit 1
fi

# Folder used for temporary files, mainly renamed files to prevent caching
tmpBuildFolder="tmp-build"
if [ ! -e "${tmpBuildFolder}" ]
        then
        echo ""
        echo "No temporary build folder ${tmpBuildFolder} - cannot continue."
        exit 1
fi

# First clean out the contents of the "tmp-build" folder
echo "Remove files from ${tmpBuildFolder}"
rm -rf ${tmpBuildFolder}/*

# Copy the entire site into the "tmp-build" folder
echo "Copy ../site to ${tmpBuildFolder}"
cp -r ../site/* ${tmpBuildFolder}

# Update content of index.html to use versioned files
# css/
customleafletcssOrig='custom-leaflet-style.css'
customleafletcssWithVersion="custom-leaflet-style.${version}.css"
mapCssOrig='map.css'
mapCssWithVersion="map.${version}.css"
styleCssOrig='style.css'
styleCssWithVersion="style.${version}.css"
# js/map-files/
exampleIppMap1JsOrig='example-ipp-map-1.js'
exampleIppMap1JsWithVersion="example-ipp-map-1.${version}.js"
exampleIppMap2JsOrig='example-ipp-map-2.js'
exampleIppMap2JsWithVersion="example-ipp-map-2.${version}.js"
ippMap1JsOrig='ipp-map-1.js'
ippMap1JsWithVersion="ipp-map-1.${version}.js"
ippMap2JsOrig='ipp-map-2.js'
ippMap2JsWithVersion="ipp-map-2.${version}.js"
ippMap3JsOrig='ipp-map-3.js'
ippMap3JsWithVersion="ipp-map-3.${version}.js"
isfMapJsOrig='isf-map.js'
isfMapJsWithVersion="isf-map.${version}.js"
#
# Replace references in index.html with files that have versions
echo "Update index.html with versioned references"
cat ../site/index.html | sed -e "s/${customleafletcssOrig}/${customleafletcssWithVersion}/g" | sed -e "s/${mapCssOrig}/${mapCssWithVersion}/g" | sed -e "s/${styleCssOrig}/${styleCssWithVersion}/g" | sed -e "s/${exampleIppMap1JsOrig}/${exampleIppMap1JsWithVersion}/g" | sed -e "s/${exampleIppMap2JsOrig}/${exampleIppMap2JsWithVersion}/g" | sed -e "s/${ippMap1JsOrig}/${ippMap1JsWithVersion}/g" | sed -e "s/${ippMap2JsOrig}/${ippMap2JsWithVersion}/g" | sed -e "s/${ippMap3JsOrig}/${ippMap3JsWithVersion}/g" | sed -e "s/${isfMapJsOrig}/${isfMapJsWithVersion}/g" > ${tmpBuildFolder}/index.html

#Copy the original files and add version to the filename
echo "Copy versioned files to ${tmpBuildFolder}"

cp ../site/css/custom-leaflet-style.css ${tmpBuildFolder}/css/custom-leaflet-style.${version}.css
cp ../site/css/map.css ${tmpBuildFolder}/css/map.${version}.css
cp ../site/css/style.css ${tmpBuildFolder}/css/style.${version}.css

cp ../site/js/map-files/example-ipp-map-1.js ${tmpBuildFolder}/js/map-files/example-ipp-map-1.${version}.js
cp ../site/js/map-files/example-ipp-map-2.js ${tmpBuildFolder}/js/map-files/example-ipp-map-2.${version}.js
cp ../site/js/map-files/ipp-map-1.js ${tmpBuildFolder}/js/map-files/ipp-map-1.${version}.js
cp ../site/js/map-files/ipp-map-2.js ${tmpBuildFolder}/js/map-files/ipp-map-2.${version}.js
cp ../site/js/map-files/ipp-map-3.js ${tmpBuildFolder}/js/map-files/ipp-map-3.${version}.js
cp ../site/js/map-files/isf-map.js ${tmpBuildFolder}/js/map-files/isf-map.${version}.js

# Create zip folder if runMode = prepUpload
if [ "$runMode" == "prepUpload" ]
        then
        # Zip files using 7zip
        echo "Zip site files"
        7z a -tzip swsi-story-ipps.zip ${tmpBuildFolder}/*
fi

if [ "$runMode" == "upload" ]
        then
        # Sync the tmp-build folder to Amazon S3
        aws s3 sync ${tmpBuildFolder} ${s3Folder} ${dryrun} --delete --profile "$awsProfile"
fi