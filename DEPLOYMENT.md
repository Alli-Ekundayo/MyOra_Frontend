# MyOra Frontend Deployment Guide

This guide describes how to deploy the MyOra frontend to AWS Amplify.

## Prerequisites
- AWS Account
- GitHub repository with this code pushed.

## Step 1: Push Code to GitHub
Ensure all your changes are committed and pushed to your GitHub repository.

## Step 2: Connect to AWS Amplify
1.  Log in to the [AWS Management Console](https://console.aws.amazon.com/).
2.  Navigate to **AWS Amplify**.
3.  Click **Create new app**.
4.  Select **GitHub** as your source and click **Next**.
5.  Authorize AWS Amplify to access your GitHub account.
6.  Select your repository and the `main` branch.

## Step 3: Configure Build Settings
During the setup, AWS Amplify will attempt to detect your build settings. 

1.  **App Framework**: It should detect "React".
2.  **Build Settings**:
    -   Click "Edit" on the build settings.
    -   Ensure the `amplify.yml` content matches the one in `frontend/amplify.yml`.
    -   **CRITICAL**: If you are deploying from a monorepo, set the **Base directory** to `frontend`.

## Step 4: Environment Variables
In the Amplify Console, navigate to **App settings > Environment variables**. Add the following variables:

| Variable Name | Value |
| :--- | :--- |
| `VITE_API_URL` | `https://yf04r82pbh.execute-api.us-east-1.amazonaws.com/Prod/api/v1` |
| `VITE_WS_URL` | `wss://v51v3u2e20.execute-api.us-east-1.amazonaws.com/Prod` |
| `VITE_COGNITO_USER_POOL_ID` | `us-east-1_bhTweJMJX` |
| `VITE_COGNITO_CLIENT_ID` | `57d64mf6728n64b10s0f2d2i0i` |
| `VITE_AWS_REGION` | `us-east-1` |

## Step 5: Save and Deploy
Once configured, click **Save and deploy**. Amplify will provision, build, and deploy your site.

## Troubleshooting
- **Build Fails (Path not found)**: Ensure the `baseDirectory` in `amplify.yml` is relative to where the `package.json` is. If Amplify runs from the root of the repo, you might need to change `cd frontend && npm run build`.
- **API Errors**: Double-check the `VITE_API_URL` and ensure there is no trailing slash unless required.
