# Personal CV Website

A modern, responsive personal CV website built with React and Tailwind CSS. Features a clean design with navigation between CV and Work pages.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean and professional design using Tailwind CSS
- **Navigation**: Easy navigation between CV and Work pages
- **CV Page**: Comprehensive CV display with sections for:
  - Professional summary
  - Technical skills
  - Work experience
  - Education
  - Certifications
- **Work Page**: Portfolio showcase with:
  - Project grid layout
  - Technology tags
  - Live demo and GitHub links
  - Additional contributions section

## Technologies Used

- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing for navigation
- **Tailwind CSS**: Utility-first CSS framework for styling
- **PostCSS**: CSS processing
- **Create React App**: Development environment

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd personal_website
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `build` folder.

## Project Structure

```
src/
├── components/
│   ├── Navigation.js    # Navigation component with routing
│   ├── CV.js           # CV page component
│   └── Work.js         # Work/portfolio page component
├── App.js              # Main app component with routing
├── index.js            # React entry point
└── index.css           # Global styles with Tailwind imports
```

## Customization

### Updating CV Information

Edit the `src/components/CV.js` file to update your personal information:

- Name, title, and contact details
- Professional summary
- Skills and technologies
- Work experience
- Education and certifications

### Updating Portfolio Projects

Edit the `src/components/Work.js` file to update your projects:

- Project titles and descriptions
- Technology stacks
- Links to live demos and GitHub repositories
- Additional contributions

### Styling

The project uses Tailwind CSS for styling. You can customize:

- Colors in `tailwind.config.js`
- Global styles in `src/index.css`
- Component-specific styles using Tailwind classes

## Deployment

This project can be deployed to various platforms:

- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload the `build` folder to an S3 bucket

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions or suggestions, please open an issue on GitHub or contact [your-email@example.com].
