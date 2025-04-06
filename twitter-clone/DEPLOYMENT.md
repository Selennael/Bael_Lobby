# GitHub Pages Deployment Instructions

To deploy this Twitter-style web application to GitHub Pages, follow these steps:

## 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click on the "+" icon in the top-right corner and select "New repository"
3. Name your repository `twitter-clone`
4. Choose whether to make it public or private
5. Click "Create repository"

## 2. Initialize Git and Push Code

```bash
# Navigate to your project directory
cd /path/to/twitter-clone

# Initialize git repository
git init

# Add all files to git
git add .

# Commit the changes
git commit -m "Initial commit"

# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/twitter-clone.git

# Push the code to GitHub
git push -u origin main
```

## 3. Update Configuration

Before deploying, make sure to:

1. Update the `homepage` field in `package.json` with your GitHub username
2. Ensure the `base` path in `vite.config.js` matches your repository name

## 4. Deploy to GitHub Pages

```bash
# Run the deploy script
npm run deploy
```

## 5. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. For the source, select the `gh-pages` branch
5. Click "Save"

Your application will be available at: `https://YOUR_USERNAME.github.io/twitter-clone/`

## 6. Updating Your Application

Whenever you make changes to your application:

1. Make your changes locally
2. Commit them to git
3. Run `npm run deploy` to update the deployed version
