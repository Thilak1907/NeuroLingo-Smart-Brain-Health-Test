# Deploying NeuroLingo Brain Health Test to Netlify

This guide provides step-by-step instructions for deploying the NeuroLingo Brain Health Test application to Netlify.

## Prerequisites
- A GitHub account
- A Netlify account
- Git installed on your computer

## Option 1: Deploy via Netlify Dashboard (Recommended for beginners)

1. **Push your code to GitHub**
   - Create a new repository on GitHub
   - Initialize Git in your project folder (if not already done):
     ```
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/neurolingo-brain-health-test.git
     git push -u origin main
     ```

2. **Deploy on Netlify**
   - Go to [Netlify](https://app.netlify.com/) and log in
   - Click "New site from Git"
   - Select GitHub and authenticate
   - Select your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
   - Click "Deploy site"

3. **Configure domain settings (optional)**
   - In the Netlify dashboard, go to "Site settings" > "Domain management"
   - You can use the free Netlify subdomain or set up a custom domain

## Option 2: Deploy via Netlify CLI

1. **Login to Netlify from the terminal**
   ```
   netlify login
   ```

2. **Deploy your site**
   ```
   cd c:\Users\Thilak\Desktop\Projects\Neuro-lingo\neurolingo-brain-health-test
   netlify deploy
   ```

3. **Follow the prompts**
   - Select "Create & configure a new site"
   - Choose your team
   - Enter a site name (optional)
   - When asked for the deploy path, enter: `build`

4. **Verify the preview and deploy to production**
   ```
   netlify deploy --prod
   ```

## Post-Deployment

1. **Test your deployed application**
   - Make sure all features work correctly
   - Test the language selector
   - Check the responsiveness on different devices

2. **Set up continuous deployment (optional)**
   - With your site connected to GitHub, any changes pushed to your main branch will automatically trigger a new deployment

3. **Monitor site performance**
   - Use the Netlify dashboard to monitor your site's performance and usage

## Troubleshooting

If you encounter any issues with routing (404 errors when refreshing pages):
- Verify that the `netlify.toml` file is in the root directory with the correct redirect rules
- Check that `homepage: "."` is set in your package.json

## Security Considerations

- Ensure there are no sensitive API keys or credentials in your code
- Consider setting environment variables for any API endpoints or services you connect to