#!/bin/bash
#
# Copy the site/* contents to the stories.openwaterfoundation.org website.
# - replace all the files on the web with local files
# - only copy specific website files such as index.html so as to not clobber other content loaded separately

# Set --dryrun to test before actually doing
dryrun=""
#dryrun="--dryrun"
s3Folder="s3://stories.openwaterfoundation.org/co/swsi-story-ipps-sp"

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

# Sync first, then copy specific files
aws s3 sync ../site ${s3Folder} ${dryrun} --delete --profile "$awsProfile"
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
cat ../site/index.html | sed -e "s/${customleafletcssOrig}/${customleafletcssWithVersion}/g" | sed -e "s/$mapCssOrig}/${mapCssWithVersion}/g" | sed -e "s/${styleCssOrig}/${styleCssWithVersion}/g" | sed -e "s/${exampleIppMap1JsOrig}/${exampleIppMap1JsWithVersion}/g" | sed -e "s/${exampleIppMap2JsOrig}/${exampleIppMap2JsWithVersion}/g" | sed -e "s/${ippMap1JsOrig}/${ippMap1JsWithVersion}/g" | sed -e "s/${ippMap2JsOrig}/${ippMap2JsWithVersion}/g" | sed -e "s/${ippMap3JsOrig}/${ippMap3JsWithVersion}/g" | sed -e "s/${isfMapJsOrig}/${isfMapJsWithVersion}/g" > ${tmpBuildFolder}/index.html
aws s3 cp ${tmpBuildFolder}/index.html ${s3Folder}/index.html ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/css/custom-leaflet-style.css ${s3Folder}/css/custom-leaflet-style.${version}.css ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/css/map.css ${s3Folder}/css/map.${version}.css ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/css/style.css ${s3Folder}/css/style.${version}.css ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/js/map-files/example-ipp-map-1.js ${s3Folder}/js/map-files/example-ipp-map-1.${version}.js ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/js/map-files/example-ipp-map-2.js ${s3Folder}/js/map-files/example-ipp-map-2.${version}.js ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/js/map-files/ipp-map-1.js ${s3Folder}/js/map-files/ipp-map-1.${version}.js ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/js/map-files/ipp-map-2.js ${s3Folder}/js/map-files/ipp-map-2.${version}.js ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/js/map-files/ipp-map-3.js ${s3Folder}/js/map-files/ipp-map-3.${version}.js ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/js/map-files/isf-map.js ${s3Folder}/js/map-files/isf-map.${version}.js ${dryrun} --profile "$awsProfile"
