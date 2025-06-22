require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.test',
});

const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

const noRefresh = process.argv.includes('--no-refresh');

if (noRefresh) {
  process.exit(0);
} else {
  console.log('Calculating latest blockbuster index data...');
}

const lambdaName = process.env.MCP_LAMBDA_NAME;

if (!lambdaName) {
  console.error('Missing MCP_LAMBDA_NAME environment variable!');
  process.exit(1);
}

const lambda = new AWS.Lambda({
  region: process.env.AWS_REGION || 'us-west-2',
});

const fetchData = async () => {
  try {
    const response = await lambda
      .invoke({
        FunctionName: lambdaName,
        InvocationType: 'RequestResponse',
      })
      .promise();

    if (response.FunctionError) {
      console.error('Lambda function error: ', response.Payload);
      process.exit(1);
    }

    const parsed = JSON.parse(response.Payload);
    const data = JSON.parse(parsed.body);
    const outputPath = path.join(__dirname, '../public/data/data.json');

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log(`Blockbuster index data saves to ${outputPath}...`);
  } catch (err) {
    console.error('Failed to invoke MCP Lambda: ', err);
    process.exit(1);
  }
};

fetchData();
