# The Blockbuster Index

The AI-powered **Blockbuster Index Project** is a playful exploration of how consumer buying habits have shifted from traditional brick-and-mortar stores to digital purchases across the United States. Inspired by the nostalgic decline of physical video rental stores like Blockbuster, this project creates a unique index that scores each state based on various signals reflecting the balance of online versus in-person purchases.

The **Blockbuster Index** website visualizes these scores and trends, providing users with an engaging way to see how retail behaviors vary geographically, combining humor and data-driven insights.

This repository is part of the **Blockbuster Index Project** which includes the following repositories:

- **[Blockbuster Index MCP Lambda](https://github.com/jessemull/blockbuster-index-mcp-lambda)**: The **Blockbuster Index** MCP lambda.
- **[Blockbuster Index Project Client](https://github.com/jessemull/blockbuster-index)**: The **Blockbuster Index** NextJS client.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Environments](#environments)
   - [Test Environment](#test-environment)
   - [Production Environment](#production-environment)
3. [Tech Stack](#tech-stack)
4. [Setup Instructions](#setup-instructions)
5. [Static Site Regeneration](#static-site-regeneration)
6. [Commits & Commitizen](#commits--commitizen)
   - [Making a Commit](#making-a-commit)
7. [Linting & Formatting](#linting--formatting)
   - [Linting Commands](#linting-commands)
   - [Formatting Commands](#formatting-commands)
   - [Pre-Commit Hook](#pre-commit-hook)
8. [Unit Tests & Code Coverage](#unit-tests--code-coverage)
   - [Unit Tests](#unit-tests)
   - [Code Coverage](#code-coverage)
9. [Error & Performance Metrics](#error--performance-metrics)
   - [Configuration](#configuration)
   - [Source Maps](#source-maps)
10. [Development Website Proxy](#development-website-proxy)

- [Environment Variables](#environment-variables)
- [Running The Proxy](#running-the-proxy)

11. [E2E Tests](#e2e-tests)
    - [Configuration](#configuration)
    - [Running E2E Tests - Development](#running-e2e-tests---development)
    - [Running E2E Tests - Test](#running-e2e-tests---test)
    - [Running E2E Tests - Production](#running-e2e-tests---production)
12. [Lighthouse](#lighthouse)
    - [Configuration](#configuration-1)
    - [Running Lighthouse - Development](#running-lighthouse---development)
    - [Running Lighthouse - Test](#running-lighthouse---test)
    - [Running Lighthouse - Production](#running-lighthouse---production)
    - [Code Coverage](#code-coverage-1)
13. [Accessibility](#accessibility)
14. [Deep Linking & Cognito Authentication](#deep-linking--cognito-authentication)
    - [Deep Linking](#deep-linking)
15. [Build](#build)
    - [Environment Variables](#environment-variables-1)
    - [Pre-build Script](#pre-build-script)
    - [Post-build script](#post-build-script)
    - [Build](#build-1)
    - [Building The Development Server](#building-the-development-server)
16. [Deployment Pipelines](#deployment-pipelines)
    - [Deployment Strategy](#deployment-strategy)
    - [Tools Used](#tools-used)
    - [Pull Request](#pull-request)
    - [Deploy](#deploy-on-merge)
    - [Deploy On Merge](#deploy-on-merge)
    - [Rollback](#rollback)
17. [Connecting to the Bastion Host](#connecting-to-the-bastion-host)
    - [Environment Variables](#environment-variables-2)
18. [License](#license)

## Project Overview

This project uses a NextJS static export to an S3 bucket behind AWS Cloudfront. All read data is calculated and fetched at build time from the **Blockbuster Index MCP Lambda** and then refreshed periodically using static site regeneration.

## Environments

The **Blockbuster Index Project** operates in multiple environments to ensure smooth development, testing, and production workflows. Each environment includes custom DNS and a separate cloudfront distribution.

### Test Environment

The test environment is protected via signed cookies and is inaccessible to the public.

- `https://dev.blockbusterindex.com`
- `https://www.dev.blockbusterindex.com`

### Production Environment

The production environment is open to the public.

- `https://blockbusterindex.com`
- `https://www.blockbusterindex.com`

## Tech Stack

The **Blockbuster Index Project Website** is built using modern web technologies to ensure a fast, scalable and cost-effective site.

- **AWS CloudFormation**: Infrastructure as Code (IaC) is used to define and provision AWS resources like S3, CloudFront and IAM roles in a consistent and repeatable manner.

- **AWS CloudWatch Events**: Triggers scheduled executions of the MCP to refresh data periodically.

- **LLM Integration (OpenAI)**: Powers natural language reasoning, classification or synthesis of signals, interpreting economic indicators, summarizing trends or generating explanations.

- **External APIs**: Fetches supporting data such as retail foot traffic, e-commerce adoption rates or census statistics used to compute the index.

- **Next.js**: A React-based framework used to build the website, providing server-side rendering (SSR), static site generation (SSG), and optimized performance for SEO and fast load times.

- **AWS CloudFront**: A content delivery network (CDN) used to distribute the website globally, reducing latency and improving load times by caching static assets close to users.

- **AWS S3**: Hosts the statically generated website, ensuring high availability, durability, and cost-efficient storage for the project's front-end assets.

- **GitHub Actions**: A CI/CD pipeline automating the deployment process, including build verification, static analysis, and rollback capabilities in case of failed deployments.

- **Cypress**: An end-to-end (E2E) testing framework that ensures the website functions correctly across different user flows by simulating real interactions with the UI.

- **Lighthouse**: A performance and accessibility auditing tool that evaluates site speed, best practices, and SEO, helping optimize the user experience.

- **Jest**: A JavaScript testing framework used for unit and integration testing, ensuring code reliability and preventing regressions.

- **ESLint & Prettier**: Linting and formatting tools that enforce code consistency, reduce syntax errors, and improve maintainability across the codebase.

- **Commitizen**: A tool for enforcing a standardized commit message format, improving version control history and making collaboration more structured.

- **HTTP Proxy**: Used to sign cookies and securely proxy requests to the development website, enabling local testing and authentication workflows.

- **AWS Lambda@Edge**: Provides request routing logic at CloudFront's edge locations, enabling low-latency deep-linking.

- **Sentry.io**: Monitors the website for runtime errors and performance issues in production, helping quickly identify and fix bugs that occur in users' browsers.

This tech stack ensures that the **Blockbuster Index** website remains performant, secure, and easily maintainable while leveraging AWS infrastructure for scalability and reliability.

## Setup Instructions

To clone the repository, install dependencies, and run the project locally follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/jessemull/blockbuster-index.git
   ```

2. Navigate into the project directory:

   ```bash
   cd blockbuster-index
   ```

3. Install the root dependencies:

   ```bash
   npm install
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. The following environment variables must be set in `.env.local` and `.env.test` and `env.production` files in the root of the project:

   ```
   CLOUDFRONT_DOMAIN - The cloudfront distribution domain.
   CLOUDFRONT_KEY_PAIR_ID - Key pair ID for running the proxy server with signed cookies.
   CLOUDFRONT_PRIVATE_KEY - The cloudfront private key. Used during the GitHub actions deployment pipeline.
   CLOUDFRONT_PRIVATE_KEY_PATH - Path to the private key pair. Used during local builds.
   MCP_LAMBDA_NAME - The name of the lambda to invoke for the pre-build step that fetches the index data.
   NEXT_PUBLIC_SENTRY_ENVIRONMENT - The Sentry environment development/test/production.
   SENTRY_AUTH_TOKEN_SOURCE_MAPS - Token to upload Sentry.io source maps.
   SENTRY_ORG - The Sentry.io organzation.
   SENTRY_PROJECT - The Sentry.io project.
   SSH_HOST - The bastion host IP.
   SSH_PRIVATE_KEY_PATH - Path to the bastion host private SSH key.
   SSH_USER - THe bastion host username.
   ```

## Commits & Commitizen

This project uses **Commitizen** to ensure commit messages follow a structured format and versioning is consistent. Commit linting is enforced via a pre-commit husky hook.

### Making a Commit

To make a commit in the correct format, run the following command. Commitzen will walk the user through the creation of a structured commit message and versioning:

```bash
npm run commit
```

## Linting & Formatting

This project uses **ESLint** and **Prettier** for code quality enforcement. Linting is enforced during every CI/CD pipeline to ensure consistent standards.

### Linting Commands

Run linting:

```bash
npm run lint
```

### Formatting Commands

Format using prettier:

```bash
npm run format
```

### Pre-Commit Hook

**Lint-staged** is configured to run linting before each commit. The commit will be blocked if linting fails, ensuring code quality at the commit level.

## Unit Tests & Code Coverage

### Unit Tests

This project uses **Jest** for testing. Code coverage is enforced during every CI/CD pipeline. The build will fail if any tests fail or coverage drops below **80%**.

Run tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Code Coverage

Coverage thresholds are enforced at **80%** for all metrics. The build will fail if coverage drops below this threshold.

## Error & Performance Metrics

This project uses **Sentry.io** for client-side error and performance monitoring. Since the website is statically built with Next.js, only the browser runtime is instrumented.

### Configuration

Sentry is initialized in the browser with environment-specific settings. Errors and performance data are reported to Sentry’s **test** or **production** environments based on the active deployment stage.

### Source Maps

Sourcemaps are uploaded during the build process to allow for readable stack traces in the Sentry dashboard. NextJS static export requires manual upload.

## Development Website Proxy

The development/test website environment is protected via signed cookies. The proxy server signs cookies and then proxies to the development domain.

### Environment Variables

The following environment variables must be set in a `.env.local` file in the root of the project to run the proxy:

```
CLOUDFRONT_DOMAIN - The cloudfront distribution domain.
CLOUDFRONT_KEY_PAIR_ID - Key pair ID for running the proxy server with signed cookies.
CLOUDFRONT_PRIVATE_KEY - The cloudfront private key. Used during the GitHub actions deployment pipeline.
CLOUDFRONT_PRIVATE_KEY_PATH - Path to the private key pair. Used during local builds.
```

### Running The Proxy

To run the proxy and access the test website:

```bash
npm run proxy
```

## E2E Tests

This project uses **Cypress** for end to end testing. The build will fail on end to end test failure.

### Configuration

Lighthouse tests for the development/test domain must be run through the proxy server with the appropriate environment variables set (see running the proxy).

In order to have the proxy work as expected and not impact performance, throttling has been set to devtools in the lighthouse config and the proxy is set up to cache files and use a temporary redirect after setting signed cookies (307).

### Running E2E Tests - Development

Start the dev server:

```bash
npm run dev
```

Run E2E tests:

```bash
npm run e2e
```

### Running E2E Tests - Test

Start the proxy server:

```bash
npm run proxy
```

Run E2E tests:

```bash
NODE_ENV=test npm run e2e
```

### Running E2E Tests - Production

Run E2E tests:

```bash
NODE_ENV=production npm run e2e
```

## Lighthouse

Lighthouse is used for performance, SEO and accessibility metrics. It is fully integrated into the CI/CD pipeline and runs on pull-request, merge and deployment.

### Configuration

Lighthouse tests for the development/test domain must be run through the proxy server with the appropriate environment variables set (see running the proxy).

In order to have the proxy work as expected and not impact performance, throttling has been set to devtools in the lighthouse config and the proxy is set up to cache files and use a temporary redirect after setting signed cookies (307).

### Running Lighthouse - Development

Start the dev server:

```bash
npm run dev
```

Run lighthouse:

```bash
npm run lighthouse
```

### Running Lighthouse - Test

Start the proxy server:

```bash
npm run proxy
```

Run lighthouse:

```bash
NODE_ENV=test npm run lighthouse
```

### Running Lighthouse - Production

Run lighthouse:

```bash
NODE_ENV=production npm run lighthouse
```

### Code Coverage

Coverage thresholds are enforced at **80%** for all metrics. The build will fail if coverage drops below this threshold.

## Accessibility

Accessibility metrics are measured using lighthouse. All components are unit tested using the jest-axe library.

## Deep Linking & Cognito Authentication

This project uses **Lambda@Edge** to enable deep linking and redirects.

### Deep Linking

Lambda at Edge allows direct access to routes, enabling deep linking without redirects. The function runs at CloudFront edge locations to reduce latency.

## Build

This project uses a static export of NextJS. Prior to the build step, a pre-build script is run to fetch signal data from the MCP lambda. A post build script uses next-sitemap to generate robots.txt and site maps. The actual build is run using NextJS internals.

### Environment Variables

The following environment variables must be set in `.env.test` and `env.production` files in the root of the project:

```
CLOUDFRONT_DOMAIN - The cloudfront distribution domain.
CLOUDFRONT_KEY_PAIR_ID - Key pair ID for running the proxy server with signed cookies.
CLOUDFRONT_PRIVATE_KEY - The cloudfront private key. Used during the GitHub actions deployment pipeline.
CLOUDFRONT_PRIVATE_KEY_PATH - Path to the private key pair. Used during local builds.
MCP_LAMBDA_NAME - The name of the lambda to invoke for the pre-build step that fetches the index data.
NEXT_PUBLIC_SENTRY_ENVIRONMENT - The Sentry environment development/test/production.
SENTRY_AUTH_TOKEN_SOURCE_MAPS - Token to upload Sentry.io source maps.
SENTRY_ORG - The Sentry.io organzation.
SENTRY_PROJECT - The Sentry.io project.
SSH_HOST - The bastion host IP.
SSH_PRIVATE_KEY_PATH - Path to the bastion host private SSH key.
SSH_USER - THe bastion host username.
```

### Pre-build Script

The pre-build script fetches blockbuster index data from the MCP lambda and writes to a static file public/data/data.json.

To run the pre-build script:

```bash
npm run prebuild
```

### Post-build script

The post-build script uses the next-sitemap package to generate sitemaps and robots.txt for SEO purposes and uploads Sentry source maps.

To run the post-build script:

```bash
npm run postbuild
```

### Build

To build the project using the test environment:

```bash
NODE_ENV=test npm run build
```

To build the project using the production environment:

```bash
NODE_ENV=production npm run build
```

### Building The Development Server

The development server has a predev script that will check for static data loaded during the build at public/data/data.json. If the file is missing, the script will fetch the data and write it.

The following environment variables must be set in `.env.test` and `env.production` files in the root of the project:

```
MCP_LAMBDA_NAME - The name of the lambda to invoke for the pre-build step that fetches the index data.
NEXT_PUBLIC_SENTRY_ENVIRONMENT - The Sentry environment development/test/production.
SENTRY_AUTH_TOKEN_SOURCE_MAPS - Token to upload Sentry.io source maps.
SENTRY_ORG - The Sentry.io organzation.
SENTRY_PROJECT - The Sentry.io project.
```

To run the pre-dev script:

```bash
npm run predev
```

To run the development server:

```bash
npm run dev
```

## Deployment Pipelines

This project uses automated deployment pipelines to ensure a smooth and reliable deployment process utilizing AWS CloudFormation, GitHub Actions and S3.

### Deployment Strategy

The deployment process for this project ensures reliability and consistency through a combination of versioned artifacts, automated deployments, and rollback mechanisms. The strategy involves the following key components:

- **Versioned Artifacts:** Every deployment is tied to a unique timestamped backup stored in Amazon S3. These backups allow for easy restoration and rollback to a previous state if necessary.
- **GitHub Actions Pipelines:** Automated deployment workflows are used to manage the build, test, and deployment processes. These workflows ensure that each change is properly validated, tested, and deployed to either the `test` or `production` environment based on user input. Manual deployment and rollback are also supported through GitHub Actions.

- **CloudFormation:** Infrastructure management is handled via AWS CloudFormation, which enables version-controlled deployments and updates. This tool helps ensure that infrastructure changes, such as bucket configurations or IAM roles, are consistently applied across environments.

- **Backup and Rollback:** Each deployment to S3 includes a backup of the previous state, enabling easy rollback if any issues arise. If Lighthouse performance tests fail after deployment, the previous version is automatically restored from the backup, and CloudFront cache is invalidated to immediately reflect the changes.

- **Manual and Automated Triggers:** Deployments are typically triggered by pushes to the `main` branch, but manual triggers (via GitHub Actions) are also available for both deployments and rollbacks. This provides flexibility in controlling the deployment process based on the current needs of the team or project.

This strategy ensures that the deployment process is automated, reliable, and easy to manage, with robust rollback options to handle any issues that may arise during deployment.

### Tools Used

- **AWS CLI**: Configures the AWS environment for deployments.
- **GitHub Actions**: Automates and schedules the deployment and rollback pipelines.
- **CloudFormation**: Orchestrates infrastructure changes, including deployments and rollbacks.
- **S3**: Stores function packages for deployment and rollback.

### Pull Request

This pipeline automates the validation process for pull requests targeting the `main` branch. It ensures that new changes are properly built, linted, tested and evaluated for performance before merging.

The pipeline performs the following steps:

1. **Build Next.js** – Checks out the code, installs dependencies, builds the Next.js application, and archives the output.
2. **Lint Code** – Runs ESLint to check for syntax and style issues.
3. **Run Unit Tests** – Executes Jest tests, uploads a coverage report, and ensures test coverage meets the required threshold.
4. **Run E2E & Lighthouse Tests** – Starts a local server, runs Cypress end-to-end tests, and performs Lighthouse performance checks.

This pipeline is defined in the `.github/workflows/pull-request.yml` file.

### Deploy

This pipeline automates the deployment of the Next.js application to an S3 bucket using a static export. It supports deployment to either the test or production environment based on user input.

The pipeline performs the following steps:

1. **Build Next.js** – Checks out the code, installs dependencies, builds the Next.js application, and archives the output.
2. **Run Unit Tests** – Executes Jest tests, uploads a coverage report, and ensures test coverage meets the required threshold.
3. **Backup S3** – Creates a timestamped backup of the existing deployment in S3 before deploying new changes.
4. **Deploy to S3** – Downloads the built application and syncs it to the designated S3 bucket.

This workflow is triggered manually via GitHub Actions using `workflow_dispatch`, allowing users to specify the target environment. The pipeline is defined in the `.github/workflows/deploy.yml` file.

### Deploy On Merge

This workflow runs automatically when changes are pushed to the `main` branch. It builds, tests, deploys the Next.js application to an S3 bucket, and runs end-to-end (E2E) and Lighthouse tests. If Lighthouse tests fail, the deployment is rolled back.

The workflow performs the following steps:

1. **Build Next.js** – Checks out the code, installs dependencies, builds the application, and archives the output.
2. **Run Unit Tests** – Executes Jest tests, uploads a coverage report, and ensures test coverage meets the required threshold.
3. **Backup S3** – Creates a timestamped backup of the current deployment before uploading the new build.
4. **Deploy to S3** – Downloads the archived build output, syncs it to the S3 bucket, and invalidates the CloudFront cache.
5. **Run E2E Tests** – Executes Cypress tests against the deployed site.
6. **Run Lighthouse Tests** – Performs performance and accessibility audits using Lighthouse.
7. **Rollback Deployment** – If Lighthouse tests fail, the workflow restores the previous deployment from the backup.

This workflow is defined in the `.github/workflows/merge.yml` file.

### Rollback Deployment

This workflow allows manual rollback of a deployed Next.js application by restoring a selected backup from S3. It is triggered via GitHub Actions' **workflow dispatch** and requires specifying a backup timestamp and environment.

The workflow performs the following steps:

1. **Restore Selected Backup** – Synchronizes the selected backup from the S3 backup bucket to the main deployment bucket, deleting any newer files.
2. **Invalidate CloudFront Cache** – Clears the CloudFront cache to ensure users receive the restored version immediately.

This workflow is defined in the `.github/workflows/rollback.yml` file.

## Cognito Access Token

All write routes are protected via Cognito User Pools. A valid access token is required to use these endpoints and access the UI.

## Connecting to the Bastion Host

To connect to the AWS EC2 bastion host and access AWS resources, you can use the following command:

```bash
npm run bastion
```

### Environment Variables

The following environment variables must be set in a `.env.local` file in the root of the project:

```
SSH_PRIVATE_KEY_PATH=/path/to/your/private/key
SSH_USER=your-ssh-username
SSH_HOST=your-ec2-instance-hostname-or-ip
```

Ensure you have the appropriate permissions set on your SSH key for secure access.

## License

    Apache License
    Version 2.0, January 2004
    http://www.apache.org/licenses/

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

---
