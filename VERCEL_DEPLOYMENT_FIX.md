# Fixing 404 NOT_FOUND Errors on Vercel Deployment

This guide provides specific steps to fix the 404 NOT_FOUND error you're encountering when deploying QuickKart to Vercel.

## Step 1: Vercel Project Configuration

When setting up your project in Vercel, use these exact settings:

1. **Framework Preset**: Select "Other" (not Next.js, Create React App, etc.)
2. **Build Command**: `npm run vercel-build`
3. **Output Directory**: `client/build`
4. **Development Command**: Leave blank

## Step 2: Environment Variables

Add these environment variables in the Vercel dashboard:

- `NODE_ENV`: `production`
- `MONGODB_URI`: Your MongoDB connection string (must be accessible from Vercel)
- `JWT_SECRET`: Your JWT secret key
- `PAYPAL_CLIENT_ID`: Your PayPal client ID
- `PAYPAL_CLIENT_SECRET`: Your PayPal client secret
- `PAYPAL_MODE`: `sandbox` or `live`

## Step 3: Deployment Troubleshooting

If you still encounter 404 errors after deploying:

1. **Check Build Logs**:
   - Go to your Vercel dashboard
   - Click on your project
   - Go to "Deployments" tab
   - Click on the latest deployment
   - Check the build logs for errors

2. **Verify Output Directory**:
   - Make sure the build process is generating files in `client/build`
   - The build logs should show files being generated in this directory

3. **Check API Routes**:
   - Test API endpoints by visiting `https://your-vercel-domain.vercel.app/api/products`
   - If this returns a 404, the API routes are not configured correctly

4. **Try a Fresh Deployment**:
   - Delete the project from Vercel
   - Create a new project with the same repository
   - Apply the settings from Step 1
   - Add the environment variables from Step 2

## Step 4: MongoDB Configuration

Make sure your MongoDB database is accessible from Vercel:

1. If using MongoDB Atlas:
   - Go to Network Access in MongoDB Atlas
   - Add `0.0.0.0/0` to the IP Access List (or use a more restrictive approach)
   - Make sure your database user has the correct permissions

## Step 5: Vercel Support

If all else fails:

1. Contact Vercel support with your error ID: `bom1::cs42s-1746348542402-573540a9092b`
2. Provide them with:
   - Your repository URL
   - The steps you've taken to troubleshoot
   - The specific error message you're seeing

## Alternative Deployment Options

If Vercel continues to be problematic, consider these alternatives:

1. **Render.com**: Similar to Vercel but with better support for full-stack applications
2. **Heroku**: Excellent for MERN stack applications
3. **Netlify + Heroku**: Deploy frontend on Netlify and backend on Heroku
