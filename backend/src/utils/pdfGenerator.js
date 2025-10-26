const PDFDocument = require('pdfkit');
const axios = require('axios');

/**
 * Generate PDF file from resume data with photo support and template layouts
 * @param {object} resumeData - Resume content, customization, and template
 * @returns {Buffer} - PDF file buffer
 */
const generatePdf = async (resumeData) => {
  const { content, customization, template } = resumeData;

  return new Promise(async (resolve, reject) => {
    try {
      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      // Buffer to store PDF
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Get layout type from customization or template
      const layoutType = customization?.layout || template?.layout?.type || 'single-column';
      
      // Color scheme based on customization or template
      const colorSchemes = {
        blue: '#3B82F6',
        purple: '#8B5CF6',
        green: '#10B981',
        red: '#EF4444',
        orange: '#F59E0B',
        teal: '#14B8A6',
        pink: '#EC4899',
        gray: '#6B7280'
      };
      const primaryColor = template?.colors?.primary || colorSchemes[customization?.colorScheme] || '#3B82F6';
      const secondaryColor = template?.colors?.secondary || '#1E40AF';

      // Font setup
      const fontSize = customization?.fontSize === 'small' ? 10 : customization?.fontSize === 'large' ? 13 : 11;

      let yPosition = 50;
      
      // Download photo if exists
      let photoBuffer = null;
      if (content.personal?.photo) {
        try {
          const photoUrl = content.personal.photo;
          if (photoUrl.startsWith('http')) {
            const response = await axios.get(photoUrl, { responseType: 'arraybuffer' });
            photoBuffer = Buffer.from(response.data);
          } else if (photoUrl.startsWith('data:image')) {
            const base64Data = photoUrl.split(',')[1];
            photoBuffer = Buffer.from(base64Data, 'base64');
          }
        } catch (err) {
          console.warn('Failed to load photo for PDF:', err.message);
        }
      }

      // NOTE: PDF rendering uses linear layout for simplicity and compatibility
      // Complex layouts (two-column, timeline, etc) are simplified to single-column
      // but maintain template colors, fonts, and styling for consistency
      // For exact layout matching, users should use the web preview
      
      // Apply spacing multiplier based on customization
      const spacingMultiplier = customization?.spacing === 'compact' ? 0.8 : 
                               customization?.spacing === 'relaxed' ? 1.2 : 1.0;

      // Helper function to add heading
      const addHeading = (text, color = primaryColor) => {
        doc.fontSize(16)
          .fillColor(color)
          .font('Helvetica-Bold')
          .text(text, 50, yPosition);
        yPosition += 25;

        // Add line under heading
        doc.moveTo(50, yPosition)
          .lineTo(545, yPosition)
          .strokeColor(color)
          .stroke();
        yPosition += 15;
      };

      // Helper function to add subheading
      const addSubheading = (text) => {
        doc.fontSize(fontSize + 2)
          .fillColor('#111827')
          .font('Helvetica-Bold')
          .text(text, 50, yPosition);
        yPosition += 18;
      };

      // Helper function to add text
      const addText = (text, indent = 0) => {
        if (!text) return;
        const maxWidth = 495 - indent;
        doc.fontSize(fontSize)
          .fillColor('#374151')
          .font('Helvetica')
          .text(text, 50 + indent, yPosition, { width: maxWidth, align: 'left' });
        yPosition += doc.heightOfString(text, { width: maxWidth }) + 5;
      };

      // Helper function to add bullet point
      const addBullet = (text) => {
        doc.fontSize(fontSize)
          .fillColor('#374151')
          .font('Helvetica')
          .text('•', 60, yPosition);

        const bulletText = text.replace(/^[•\-\*]\s*/, '');
        doc.text(bulletText, 75, yPosition, { width: 470, align: 'left' });
        yPosition += doc.heightOfString(bulletText, { width: 470 }) + 3;
      };

      // Helper to check if new page needed
      const checkNewPage = (spaceNeeded = 50) => {
        if (yPosition + spaceNeeded > 750) {
          doc.addPage();
          yPosition = 50;
          return true;
        }
        return false;
      };

      // HEADER - Personal Information
      if (content.personal) {
        const { fullName, email, phone, location, linkedin, website, summary } = content.personal;

        // Add photo if available (top-right corner)
        if (photoBuffer) {
          try {
            doc.image(photoBuffer, 480, 50, { 
              width: 65, 
              height: 65,
              fit: [65, 65]
            });
          } catch (err) {
            console.warn('Failed to add photo to PDF:', err.message);
          }
        }

        // Name
        if (fullName) {
          doc.fontSize(24)
            .fillColor(primaryColor)
            .font('Helvetica-Bold')
            .text(fullName, 50, yPosition, { align: photoBuffer ? 'left' : 'center', width: photoBuffer ? 400 : 495 });
          yPosition += 30;
        }

        // Contact info
        const contactInfo = [];
        if (email) contactInfo.push(email);
        if (phone) contactInfo.push(phone);
        if (location) contactInfo.push(location);

        if (contactInfo.length > 0) {
          doc.fontSize(fontSize)
            .fillColor('#6B7280')
            .font('Helvetica')
            .text(contactInfo.join(' | '), 50, yPosition, { align: photoBuffer ? 'left' : 'center', width: photoBuffer ? 400 : 495 });
          yPosition += 15;
        }

        // Links
        const links = [];
        if (linkedin) links.push(linkedin);
        if (website) links.push(website);

        if (links.length > 0) {
          doc.fontSize(fontSize)
            .fillColor(primaryColor)
            .text(links.join(' | '), 50, yPosition, { align: photoBuffer ? 'left' : 'center', link: linkedin || website, width: photoBuffer ? 400 : 495 });
          yPosition += 20;
        }
        
        // Ensure we're below the photo if it exists
        if (photoBuffer && yPosition < 130) {
          yPosition = 130;
        }

        // Summary
        if (summary) {
          yPosition += 10;
          addHeading('PROFESSIONAL SUMMARY');
          addText(summary);
          yPosition += 10;
        }
      }

      // EXPERIENCE
      if (content.experience && content.experience.length > 0) {
        checkNewPage(100);
        addHeading('WORK EXPERIENCE');

        content.experience.forEach((job, index) => {
          checkNewPage(80);

          // Job title and company
          if (job.jobTitle) {
            addSubheading(job.jobTitle);
          }

          if (job.company) {
            const jobLine = [job.company];
            if (job.location) jobLine.push(job.location);
            doc.fontSize(fontSize)
              .fillColor('#6B7280')
              .font('Helvetica-Oblique')
              .text(jobLine.join(' | '), 50, yPosition);
            yPosition += 15;
          }

          // Dates
          if (job.startDate) {
            const endDate = job.current ? 'Present' : (job.endDate || '');
            const dateStr = `${job.startDate} - ${endDate}`;
            doc.fontSize(fontSize - 1)
              .fillColor('#9CA3AF')
              .font('Helvetica')
              .text(dateStr, 50, yPosition);
            yPosition += 15;
          }

          // Description
          if (job.description) {
            const lines = job.description.split('\n').filter(line => line.trim());
            lines.forEach(line => {
              if (line.trim().match(/^[•\-\*]/)) {
                addBullet(line);
              } else {
                addText(line, 10);
              }
            });
          }

          yPosition += 5;
        });
      }

      // EDUCATION
      if (content.education && content.education.length > 0) {
        checkNewPage(100);
        yPosition += 10;
        addHeading('EDUCATION');

        content.education.forEach((edu) => {
          checkNewPage(60);

          if (edu.degree) {
            addSubheading(edu.degree);
          }

          if (edu.school) {
            const eduLine = [edu.school];
            if (edu.location) eduLine.push(edu.location);
            doc.fontSize(fontSize)
              .fillColor('#6B7280')
              .font('Helvetica-Oblique')
              .text(eduLine.join(' | '), 50, yPosition);
            yPosition += 15;
          }

          if (edu.startDate) {
            const endDate = edu.endDate || '';
            const dateStr = `${edu.startDate}${endDate ? ' - ' + endDate : ''}`;
            doc.fontSize(fontSize - 1)
              .fillColor('#9CA3AF')
              .text(dateStr, 50, yPosition);
            yPosition += 15;
          }

          if (edu.gpa) {
            doc.fontSize(fontSize)
              .fillColor('#374151')
              .font('Helvetica')
              .text(`GPA: ${edu.gpa}`, 50, yPosition);
            yPosition += 12;
          }

          if (edu.description) {
            addText(edu.description, 10);
          }

          yPosition += 5;
        });
      }

      // SKILLS
      if (content.skills) {
        const { technical, soft, languages } = content.skills;
        const hasSkills = (technical && technical.length > 0) ||
                         (soft && soft.length > 0) ||
                         (languages && languages.length > 0);

        if (hasSkills) {
          checkNewPage(100);
          yPosition += 10;
          addHeading('SKILLS');

          if (technical && technical.length > 0) {
            doc.fontSize(fontSize)
              .fillColor('#111827')
              .font('Helvetica-Bold')
              .text('Technical:', 50, yPosition);
            yPosition += 12;
            addText(technical.join(', '), 10);
            yPosition += 5;
          }

          if (soft && soft.length > 0) {
            doc.fontSize(fontSize)
              .fillColor('#111827')
              .font('Helvetica-Bold')
              .text('Soft Skills:', 50, yPosition);
            yPosition += 12;
            addText(soft.join(', '), 10);
            yPosition += 5;
          }

          if (languages && languages.length > 0) {
            doc.fontSize(fontSize)
              .fillColor('#111827')
              .font('Helvetica-Bold')
              .text('Languages:', 50, yPosition);
            yPosition += 12;
            addText(languages.join(', '), 10);
          }
        }
      }

      // PROJECTS
      if (content.projects && content.projects.length > 0) {
        checkNewPage(100);
        yPosition += 10;
        addHeading('PROJECTS');

        content.projects.forEach((project) => {
          checkNewPage(60);

          if (project.name) {
            addSubheading(project.name);
          }

          if (project.technologies) {
            doc.fontSize(fontSize - 1)
              .fillColor('#6B7280')
              .font('Helvetica-Oblique')
              .text(`Technologies: ${project.technologies}`, 50, yPosition);
            yPosition += 15;
          }

          if (project.link) {
            doc.fontSize(fontSize - 1)
              .fillColor(primaryColor)
              .text(project.link, 50, yPosition, { link: project.link });
            yPosition += 15;
          }

          if (project.description) {
            addText(project.description, 10);
          }

          yPosition += 5;
        });
      }

      // CERTIFICATES
      if (content.certificates && content.certificates.length > 0) {
        checkNewPage(100);
        yPosition += 10;
        addHeading('CERTIFICATIONS');

        content.certificates.forEach((cert) => {
          checkNewPage(50);

          if (cert.name) {
            addSubheading(cert.name);
          }

          const certLine = [];
          if (cert.issuer) certLine.push(cert.issuer);
          if (cert.date) certLine.push(cert.date);

          if (certLine.length > 0) {
            doc.fontSize(fontSize)
              .fillColor('#6B7280')
              .font('Helvetica')
              .text(certLine.join(' | '), 50, yPosition);
            yPosition += 12;
          }

          if (cert.link) {
            doc.fontSize(fontSize - 1)
              .fillColor(primaryColor)
              .text(cert.link, 50, yPosition, { link: cert.link });
            yPosition += 12;
          }

          if (cert.description) {
            addText(cert.description, 10);
          }

          yPosition += 5;
        });
      }

      // ACTIVITIES
      if (content.activities && content.activities.length > 0) {
        checkNewPage(100);
        yPosition += 10;
        addHeading('ACTIVITIES & LEADERSHIP');

        content.activities.forEach((activity) => {
          checkNewPage(50);

          if (activity.title) {
            addSubheading(activity.title);
          }

          if (activity.organization) {
            doc.fontSize(fontSize)
              .fillColor('#6B7280')
              .font('Helvetica-Oblique')
              .text(activity.organization, 50, yPosition);
            yPosition += 12;
          }

          if (activity.startDate) {
            const endDate = activity.endDate || 'Present';
            doc.fontSize(fontSize - 1)
              .fillColor('#9CA3AF')
              .text(`${activity.startDate} - ${endDate}`, 50, yPosition);
            yPosition += 12;
          }

          if (activity.description) {
            addText(activity.description, 10);
          }

          yPosition += 5;
        });
      }

      // Finalize PDF
      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePdf };
