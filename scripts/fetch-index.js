require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.test',
});

const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  region: process.env.AWS_REGION || 'us-west-2',
});

const fetchDataFromS3 = async () => {
  try {
    console.log('Fetching latest blockbuster index data from S3...');

    // Get the bucket name from environment or use a default...

    const bucketName =
      process.env.S3_BUCKET_NAME || 'blockbuster-index-client-dev';
    const dataKey = 'data/data.json';

    const params = {
      Bucket: bucketName,
      Key: dataKey,
    };

    const response = await s3.getObject(params).promise();
    const data = JSON.parse(response.Body.toString());

    const outputPath = path.join(__dirname, '../public/data/data.json');

    // Ensure the directory exists...

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Write the data to local file...

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log(`Blockbuster index data saved to ${outputPath}`);
    console.log(`Data contains ${Object.keys(data).length} states`);

    // Log a sample of the data structure...

    const sampleState = Object.keys(data)[0];
    if (sampleState) {
      console.log(`Sample data for ${sampleState}:`, data[sampleState]);
    }
  } catch (err) {
    console.error('Failed to fetch data from S3:', err);

    if (err.code === 'NoSuchBucket') {
      console.error(
        'S3 bucket not found. Please check S3_BUCKET_NAME environment variable.',
      );
    } else if (err.code === 'NoSuchKey') {
      console.error(
        'Data file not found in S3 bucket. Please check if data/data.json exists.',
      );
    } else if (err.code === 'AccessDenied') {
      console.error(
        'Access denied to S3 bucket. Please check AWS credentials and permissions.',
      );
    }

    process.exit(1);
  }
};

fetchDataFromS3();
