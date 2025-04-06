# Twitter-Style Personal Web Application

A minimalist Twitter-style UI for personal use, hosted on GitHub Pages. This application allows you to post status updates, manage projects, and filter posts by project tags.

![Twitter Clone Screenshot](screenshot.png)

## Features

### Core Features
- **Twitter-like UI** with teal and gold colors instead of Twitter's blue
- **Post status updates** with optional project tags
- **View posts** in chronological order
- **Projects page** with a clean grid view of personal projects
- **Project filtering** to view posts related to specific projects
- **GitHub-based storage** for posts and projects data

### Bonus Features
- **Dark/light mode toggle** for comfortable viewing in any environment
- **Markdown support** in posts (bold, italic, links)
- **Search functionality** to filter posts by content
- **Local draft saving** to prevent losing your work

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- pnpm (v7 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/twitter-clone.git
cd twitter-clone
```

2. Install dependencies
```bash
pnpm install
```

3. Start the development server
```bash
pnpm run dev
```

4. Open your browser and navigate to `http://localhost:5173/twitter-clone/`

## Usage

### Creating Posts
1. Use the "New Post" button in the sidebar or the post form at the top of the feed
2. Write your content (supports markdown: **bold**, *italic*, [links](url))
3. Optionally select a project to tag the post with
4. Click "Post" to publish

### Managing Projects
1. Navigate to the Projects page using the sidebar
2. Click "New Project" to create a new project
3. Fill in the project details (title, description)
4. Click "Create Project" to save

### Filtering Posts
- On the Home page, use the project filter buttons to view posts for specific projects
- Use the search box to filter posts by content
- On a Project detail page, you'll automatically see only posts related to that project

### Using Dark/Light Mode
- Click the sun/moon icon in the top-right corner of the sidebar to toggle between dark and light modes

## Deployment

This application is configured for GitHub Pages deployment. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Technologies Used

- **Frontend**: React, React Router, Tailwind CSS
- **Storage**: GitHub API (via Octokit) with localStorage fallback
- **Hosting**: GitHub Pages

## Project Structure

```
twitter-clone/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React context providers
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main application component
│   └── index.css       # Global styles
├── public/             # Static assets
├── DEPLOYMENT.md       # Deployment instructions
└── README.md           # Project documentation
```

## Customization

### Changing Colors
The primary colors can be modified in the `tailwind.config.js` file:

```js
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#14b8a6', // teal-500 (change this for main color)
        light: '#5eead4',   // teal-300
        dark: '#0f766e',    // teal-700
      },
      accent: {
        DEFAULT: '#eab308', // amber-500 (change this for accent color)
        light: '#fde047',   // amber-300
        dark: '#b45309',    // amber-700
      },
    },
  },
},
```

## License

This project is open source and available under the [MIT License](LICENSE).
