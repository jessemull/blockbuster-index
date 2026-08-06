require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.test',
});

// Only skip if running in CI and credentials are missing...

if (
  process.env.CI &&
  (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)
) {
  console.log('AWS credentials not found in CI, skipping fetch-index.');
  process.exit(0);
}

const fs = require('fs');
const path = require('path');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-west-2',
});

const streamToString = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
};

const fetchDataFromS3 = async () => {
  try {
    console.log('Fetching latest blockbuster index data from S3...');

    const bucketName = process.env.S3_BUCKET_NAME;
    if (!bucketName) {
      console.error(
        'S3_BUCKET_NAME is not set. Refusing to fetch index data without an explicit bucket.',
      );
      process.exit(1);
    }
    const dataKey = 'data/data.json';

    const response = await s3.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: dataKey,
      }),
    );

    const body = await streamToString(response.Body);
    const data = JSON.parse(body);

    const outputPath = path.join(__dirname, '../public/data/data.json');

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log(`Blockbuster index data saved to ${outputPath}...`);
  } catch (err) {
    console.error('Failed to fetch data from S3:', err);

    if (err.name === 'NoSuchBucket' || err.Code === 'NoSuchBucket') {
      console.error(
        'S3 bucket not found. Please check S3_BUCKET_NAME environment variable.',
      );
    } else if (err.name === 'NoSuchKey' || err.Code === 'NoSuchKey') {
      console.error(
        'Data file not found in S3 bucket. Please check if data/data.json exists.',
      );
    } else if (
      err.name === 'AccessDenied' ||
      err.Code === 'AccessDenied' ||
      err.name === 'CredentialsProviderError'
    ) {
      console.error(
        'Access denied to S3 bucket. Please check AWS credentials and permissions.',
      );
    }

    process.exit(1);
  }
};

fetchDataFromS3();
