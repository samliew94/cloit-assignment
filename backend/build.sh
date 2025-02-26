echo "Deleting Archives..."
rm -rf ./dist
rm -f function.zip

echo "Building..."
nest build

echo "Creating deployment package..."
mv package.json dist/
cd dist
npm i --omit=dev

echo "Zipping..."
zip -r ../function.zip .
cd ..

echo "uploading to AWS Lambda..."
aws lambda update-function-code --function-name cloit-assignment --zip-file fileb://function.zip --no-cli-pager &
echo "done"

