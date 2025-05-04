# Deploying QuickKart to Vercel

This guide provides step-by-step instructions for deploying the QuickKart MERN stack application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Git](https://git-scm.com/downloads) installed on your computer
3. A MongoDB Atlas database (or other MongoDB hosting)

## Deployment Steps

### 1. Push Your Code to GitHub

Make sure your code is pushed to a GitHub repository.

### 2. Set Up Environment Variables in Vercel

When deploying to Vercel, you'll need to set up the following environment variables:

- `NODE_ENV`: Set to `production`
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key
- `PAYPAL_CLIENT_ID`: Your PayPal client ID
- `PAYPAL_CLIENT_SECRET`: Your PayPal client secret
- `PAYPAL_MODE`: Set to `sandbox` or `live`

### 3. Deploy to Vercel

1. Log in to your Vercel account
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Root Directory: Leave as is (the root of your repository)
   - Build Command: Leave blank (Vercel will use the configuration in vercel.json)
   - Output Directory: Leave blank (Vercel will use the configuration in vercel.json)
5. Add the environment variables mentioned above
6. Click "Deploy"

### 4. Troubleshooting Common Issues

#### 404 Not Found Errors

If you're seeing 404 errors, check:
- The `vercel.json` file is correctly configured
- Your API routes are properly defined
- The build output is being generated correctly

#### API Connection Issues

If the frontend can't connect to the API:
- Check that the API base URL is configured correctly in `client/src/config/vercelConfig.js`
- Verify that the environment variables are set correctly in Vercel
- Check CORS configuration in `server/server.js`

#### Database Connection Issues

If the application can't connect to the database:
- Verify the MongoDB URI is correct
- Ensure your MongoDB Atlas cluster has the appropriate IP whitelist settings (Vercel's IPs should be allowed)

## Updating Your Deployment

To update your deployment:
1. Push changes to your GitHub repository
2. Vercel will automatically redeploy your application

## Custom Domain Setup

To use a custom domain:
1. Go to your project settings in Vercel
2. Click on "Domains"
3. Add your custom domain and follow the instructions to configure DNS settings
