# React Flow Interface

An interactive node-based interface built with React Flow, allowing users to create and manipulate different types of nodes and connections between them.

## Features

- Multiple node types (Entity, Metric, Basic Card)
- Interactive connections between nodes
- Node duplication and deletion
- Custom edge styling with labels
- Dark theme UI with Chakra UI

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages. Follow these steps:

1. **Update the homepage URL**:
   In `package.json`, replace `YOURUSERNAME` in the homepage URL with your actual GitHub username:
   ```
   "homepage": "https://YOURUSERNAME.github.io/react-flow-interface"
   ```

2. **Deploy to GitHub Pages**:
   Run the following command to build and deploy the app:
   ```
   npm run deploy
   ```

3. **Configure GitHub Repository**:
   - Go to your GitHub repository settings
   - Navigate to the "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Select the "gh-pages" branch and "/ (root)" folder
   - Click "Save"

4. **View your deployed application**:
   After a few minutes, your application will be available at:
   ```
   https://YOURUSERNAME.github.io/react-flow-interface
   ```

## Troubleshooting

If your deployed application shows a blank page or doesn't load correctly:

1. Open browser developer tools (F12) and check for errors
2. Verify that the homepage URL in package.json exactly matches your GitHub Pages URL
3. Make sure the gh-pages branch contains a `.nojekyll` file in the root
4. Check if all assets are loading correctly (no 404 errors)

## Local Development

To run the project locally:

```
npm install
npm start
```

This will start the development server at http://localhost:3000 