# GitHub Pages Deployment Guide for EduPath

This guide explains how to deploy the EduPath project to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Git installed on your computer
3. The EduPath project files

## Step-by-Step Deployment

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon and select "New repository"
3. Name your repository (e.g., `code4cause` or `edupath-platform`)
4. Make sure it's **Public** (required for free GitHub Pages)
5. Don't initialize with README since we already have files
6. Click "Create repository"

### 2. Upload Your Code

#### Option A: Using GitHub's Web Interface
1. On your new repository page, click "uploading an existing file"
2. Drag and drop all files from the `code4cause` folder
3. Write a commit message like "Initial commit - EduPath platform"
4. Click "Commit changes"

#### Option B: Using Git Command Line
```bash
# Navigate to your project directory
cd path/to/your/code4cause

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - EduPath platform"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

### 4. Configure GitHub Pages (if needed)

The repository already includes:
- `.nojekyll` file to disable Jekyll processing
- `.github/workflows/deploy.yml` for automated deployment
- Proper relative paths throughout the project

### 5. Access Your Site

After deployment (usually takes 2-10 minutes):
- Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`
- The main EduPath application will be at: `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/edupath-5/`

## Important Notes

### API Functionality
- The project includes both a Node.js API server and fallback static data
- On GitHub Pages, only the static functionality works (which is sufficient for the main features)
- All core features (quiz, courses, colleges, scholarships, timeline) work without the API
- The application automatically falls back to demo data when the API is not available

### File Structure
```
code4cause/
├── index.html                  # Project overview page
├── edupath-5/                  # Main EduPath application
│   ├── index.html             # Landing page
│   ├── quiz.html              # Career assessment
│   ├── courses.html           # Course exploration
│   ├── colleges.html          # College information
│   ├── scholarships.html     # Scholarship portal
│   ├── timeline.html          # Timeline management
│   ├── career.html            # Career explorer
│   ├── profile.html           # User profiles
│   ├── auth.html              # Authentication
│   ├── assets/                # CSS, JS, and other assets
│   ├── api/                   # Backend API (for local development)
│   ├── .nojekyll             # GitHub Pages configuration
│   └── README.md             # Project documentation
└── .github/
    └── workflows/
        └── deploy.yml         # Automated deployment
```

### Features That Work on GitHub Pages
✅ Career assessment quiz with personalized results
✅ Interactive course exploration with filtering
✅ College database with detailed information
✅ Live scholarship listings with categories
✅ Personal timeline management
✅ Multi-language support (9 languages)
✅ Mobile-responsive design
✅ Progressive Web App features
✅ Service Worker for offline functionality
✅ Interactive maps for college locations

### Troubleshooting

**Site not loading?**
- Wait 10-15 minutes after enabling GitHub Pages
- Check that the repository is public
- Verify the branch is set to "main" in Pages settings

**Broken links or missing files?**
- All paths in the project use relative URLs, which should work correctly
- If you renamed the repository, update the README links accordingly

**Need to update the site?**
- Simply push new commits to the main branch
- GitHub Pages will automatically rebuild and deploy (takes 2-10 minutes)

## Customization

### Updating the Welcome Page
Edit `index.html` in the root directory to customize the project overview page.

### Adding Your Repository Link
Update the "View Source" button in `index.html` with your actual repository URL.

### Branding
You can update the title, colors, and branding throughout the application by modifying the CSS files in `edupath-5/assets/`.

## Support

If you encounter issues:
1. Check the GitHub Pages documentation
2. Verify all files uploaded correctly
3. Make sure the repository is public
4. Check browser console for any errors

## Local Development

To run the project locally with full API functionality:

```bash
# Install dependencies
cd edupath-5/api
npm install

# Start the API server
npm start

# In another terminal, serve the frontend
cd ../
python -m http.server 8080
# or use any other static file server
```

The local version includes live data updates and full API integration.