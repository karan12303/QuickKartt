const fs = require('fs');
const path = require('path');
const pptxgenjs = require('pptxgenjs');

// This is a simple script to convert the Markdown presentation to PowerPoint
// To use this script, you need to install pptxgenjs:
// npm install pptxgenjs

// Function to convert markdown to PowerPoint
async function convertToPPTX() {
  try {
    // Read the markdown file
    const markdownContent = fs.readFileSync(
      path.join(__dirname, 'QuickKart_Presentation.md'),
      'utf8'
    );

    // Split the content by slide separator
    const slides = markdownContent.split('---');

    // Create a new PowerPoint presentation
    const pres = new pptxgenjs();

    // Set the presentation properties
    pres.layout = 'LAYOUT_16x9';
    pres.author = 'QuickKart Team';
    pres.title = 'QuickKart E-Commerce Platform';

    // Process each slide
    slides.forEach((slideContent) => {
      if (slideContent.trim() === '') return;

      // Create a new slide
      const slide = pres.addSlide();

      // Extract the slide title (first heading)
      const titleMatch = slideContent.match(/^#\s+(.+)$/m) || 
                         slideContent.match(/^##\s+(.+)$/m);
      
      const title = titleMatch ? titleMatch[1].trim() : 'Slide';

      // Add the title to the slide
      slide.addText(title, {
        x: 0.5,
        y: 0.5,
        w: '90%',
        h: 1,
        fontSize: 36,
        bold: true,
        color: '363636'
      });

      // Process the content (excluding the title)
      let content = slideContent
        .replace(/^#\s+.+$/m, '')  // Remove the first heading
        .replace(/^##\s+.+$/m, '') // Remove the second heading if it was used as title
        .trim();

      // Add the content to the slide
      if (content) {
        slide.addText(content, {
          x: 0.5,
          y: 1.7,
          w: '90%',
          h: 4,
          fontSize: 18,
          bullet: { type: 'bullet' },
          color: '363636'
        });
      }
    });

    // Save the presentation
    const outputPath = path.join(__dirname, 'QuickKart_Presentation.pptx');
    await pres.writeFile({ fileName: outputPath });
    
    console.log(`Presentation saved to ${outputPath}`);
  } catch (error) {
    console.error('Error converting to PowerPoint:', error);
  }
}

// Run the conversion
convertToPPTX();

// Note: This is a basic conversion script and may need adjustments
// For a more sophisticated conversion, consider using professional tools
// or services that specialize in Markdown to PowerPoint conversion.
