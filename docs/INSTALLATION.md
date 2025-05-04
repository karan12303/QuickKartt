# Documentation Tools Installation Guide

This guide explains how to set up the tools needed to work with the QuickKart project documentation.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation Steps

1. Navigate to the docs directory:
   ```
   cd docs
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

## Converting Documentation

### Convert Markdown Presentation to PowerPoint

To convert the Markdown presentation to PowerPoint format:

```
npm run convert-pptx
```

This will generate a file named `QuickKart_Presentation.pptx` in the docs directory.

### Convert Markdown Documents to PDF

To convert the project report and synopsis to PDF format:

```
npm run convert-pdf
```

This will generate `QuickKart_Project_Report.pdf` and `QuickKart_Project_Synopsis.pdf` in the docs directory.

## Manual Conversion Options

If the automated scripts don't meet your needs, here are some alternative methods:

### For PowerPoint Conversion:
1. Copy and paste the content from `QuickKart_Presentation.md` into PowerPoint slides
2. Use online tools like Slides.com or GitPitch which support Markdown imports

### For PDF Conversion:
1. Use VS Code with the "Markdown PDF" extension
2. Use online converters like Dillinger.io or StackEdit
3. Use Pandoc with a command like:
   ```
   pandoc -s QuickKart_Project_Report.md -o QuickKart_Project_Report.pdf
   ```

## Customizing the Output

### PowerPoint Customization
To customize the PowerPoint output, edit the `convert_to_pptx.js` file. You can modify:
- Slide layouts
- Font sizes and colors
- Slide backgrounds
- Text positioning

### PDF Customization
For PDF customization, you can:
1. Create a custom CSS file
2. Update the conversion command in package.json to include your CSS
3. Adjust margins, fonts, and other styling as needed

## Troubleshooting

If you encounter issues with the conversion process:

1. Ensure all dependencies are correctly installed
2. Check that your Node.js version is compatible
3. Verify that the Markdown syntax in the source files is correct
4. For PowerPoint conversion issues, try manually copying content into slides
5. For PDF conversion issues, try alternative tools like Pandoc or online converters
