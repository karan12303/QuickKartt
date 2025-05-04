# Fixing MongoDB Connection Issues on Vercel

This guide provides specific steps to fix the 500 server error when loading products in your Vercel deployment.

## Understanding the Issue

The 500 error when loading products is likely caused by one of these issues:

1. **MongoDB Connection Problems**: Vercel can't connect to your MongoDB database
2. **Environment Variables**: Missing or incorrectly formatted MongoDB URI
3. **Error Handling**: The application isn't properly handling database connection failures

## Step 1: Set Up MongoDB Atlas for Vercel

1. **Configure MongoDB Atlas Network Access**:
   - Log in to your MongoDB Atlas account
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Add `0.0.0.0/0` to allow access from anywhere (including Vercel's servers)
   - Click "Confirm"

2. **Verify Your MongoDB Connection String**:
   - Go to "Database" in MongoDB Atlas
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Add the database name after the hostname (e.g., `/ecommerce-cart?retryWrites=true&w=majority`)

## Step 2: Configure Environment Variables in Vercel

1. **Go to your Vercel project dashboard**

2. **Navigate to Settings > Environment Variables**

3. **Add or update the following environment variables**:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your complete MongoDB connection string (from step 1)
   - `JWT_SECRET`: Your JWT secret key
   - `PAYPAL_CLIENT_ID`: Your PayPal client ID
   - `PAYPAL_CLIENT_SECRET`: Your PayPal client secret
   - `PAYPAL_MODE`: `sandbox` or `live`

4. **Make sure to click "Save" after adding the variables**

## Step 3: Redeploy Your Application

1. **Trigger a new deployment**:
   - Go to the "Deployments" tab in your Vercel project
   - Click "Redeploy" on your latest deployment
   - Or push a new commit to your GitHub repository

2. **Monitor the deployment logs**:
   - Watch for any MongoDB connection errors
   - Look for "MongoDB Connected" messages

## Step 4: Verify the Connection

After deploying, check the logs to see if the MongoDB connection is successful:

1. **Go to your Vercel project dashboard**
2. **Click on the latest deployment**
3. **Go to "Functions" tab**
4. **Click on the `/api` function**
5. **Check the logs for MongoDB connection messages**

## Troubleshooting

If you're still experiencing issues:

1. **Check MongoDB Atlas Status**:
   - Make sure your MongoDB Atlas cluster is running
   - Verify that your database user has the correct permissions

2. **Test Your Connection String Locally**:
   - Run the `checkMongoDB.js` script locally to verify your connection string works

3. **Check for Network Restrictions**:
   - Some MongoDB Atlas tiers have network restrictions
   - Make sure your cluster allows connections from Vercel's IP ranges

4. **Verify Database Name**:
   - Make sure the database name in your connection string is correct
   - The format should be: `mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority`

5. **Check for Special Characters**:
   - If your password contains special characters, make sure they're properly URL-encoded

## Next Steps

Once the MongoDB connection is working:

1. **Test the Product Listing**:
   - Visit your deployed site and navigate to the product listing page
   - Check the browser console for any errors

2. **Test Other Database Operations**:
   - Try adding items to cart, creating orders, etc.
   - These operations also rely on the MongoDB connection

3. **Monitor Vercel Logs**:
   - Keep an eye on the function logs for any recurring issues
