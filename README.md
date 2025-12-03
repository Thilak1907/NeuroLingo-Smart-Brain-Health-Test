# NeuroLingo Brain Health Test

A multilingual cognitive assessment application designed for the diverse Indian population.

## About the Project

NeuroLingo is a web application that provides comprehensive brain health assessments in multiple Indian languages. It's designed to detect early signs of cognitive decline and provide users with insights about their brain health.

## Features

- **Multilingual Support**: Available in English, Hindi, Tamil, Telugu, and Bengali
- **Comprehensive Cognitive Testing**: Assesses memory, attention, language, and visuospatial abilities
- **User Dashboard**: Displays test results, progress tracking, and risk assessments
- **Healthcare Provider Integration**: Allows doctors to monitor their patients' brain health
- **PDF Report Generation**: Export test results as PDF documents
- **Mobile Responsive**: Works on various devices

## Directory Structure
```
neurolingo-brain-health-test
├── src
│   ├── components      # UI components
│   ├── tests           # Cognitive test implementations
│   ├── utils           # Utility functions and services
│   ├── contexts        # React contexts (Language context)
│   ├── i18n            # Internationalization files
│   ├── assets          # Static resources (styles, images)
│   └── index.js        # Main entry point
├── public
│   ├── index.html
│   └── manifest.json
├── build               # Production build (created after npm run build)
├── package.json
├── netlify.toml        # Netlify configuration
├── DEPLOYMENT.md       # Deployment instructions
├── .gitignore
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/neurolingo-brain-health-test.git
   ```
2. Navigate to the project directory:
   ```
   cd neurolingo-brain-health-test
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
To start the development server, run:
```
npm start
```
This will launch the application in your default web browser at http://localhost:3000.

## Building for Production
To create a production build, run:
```
npm run build
```

This creates an optimized build in the `build` folder that can be deployed to hosting services.

## User Types

### For Patients
- Create an account or login
- Take a comprehensive brain health test
- View your results and progress over time
- Export reports or share with your healthcare provider

### For Healthcare Providers
- Monitor multiple patients' cognitive health
- Track changes over time
- Get early warnings for potential cognitive issues

## Deployment
See the [DEPLOYMENT.md](DEPLOYMENT.md) file for detailed instructions on deploying the project to production.

## Tech Stack
- React (v17.0.2)
- Chart.js for data visualization
- jsPDF for PDF generation
- Custom CSS for styling

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.