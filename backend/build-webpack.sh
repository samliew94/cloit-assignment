echo "Building Webpack for AWS Lambda..."
echo "deleting archives..."
rm -rf ./dist
rm -f function.zip
echo "building..."
nest build --webpack
echo "built"
cd dist
zip ../function.zip -r .
echo "zipped"
cd ..
echo "uploading to AWS Lambda..."
aws lambda update-function-code --function-name cloit-assignment --zip-file fileb://function.zip --no-cli-pager &
echo "done"

