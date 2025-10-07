const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = require('docx');

/**
 * Generate DOCX file from resume data
 * @param {object} resumeData - Resume content and customization
 * @returns {Buffer} - DOCX file buffer
 */
const generateDocx = async (resumeData) => {
  const { content, customization } = resumeData;
  const sections = [];

  // Helper function to create a heading
  const createHeading = (text) => {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      thematicBreak: true
    });
  };

  // Helper function to create a subheading
  const createSubheading = (text) => {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 }
    });
  };

  // Helper function to create normal text
  const createText = (text) => {
    return new Paragraph({
      text: text,
      spacing: { after: 100 }
    });
  };

  // Helper function to create bold text
  const createBoldText = (label, value) => {
    return new Paragraph({
      children: [
        new TextRun({ text: label, bold: true }),
        new TextRun({ text: `: ${value}` })
      ],
      spacing: { after: 100 }
    });
  };

  // Title - Personal Info
  if (content.personal) {
    const p = content.personal;

    // Name
    sections.push(new Paragraph({
      text: p.fullName || '',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }));

    // Contact info
    const contactInfo = [];
    if (p.email) contactInfo.push(p.email);
    if (p.phone) contactInfo.push(p.phone);
    if (p.location) contactInfo.push(p.location);

    if (contactInfo.length > 0) {
      sections.push(new Paragraph({
        text: contactInfo.join(' | '),
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }));
    }

    // Links
    const links = [];
    if (p.linkedin) links.push(`LinkedIn: ${p.linkedin}`);
    if (p.website) links.push(`Website: ${p.website}`);

    if (links.length > 0) {
      sections.push(new Paragraph({
        text: links.join(' | '),
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }));
    }

    // Summary
    if (p.summary) {
      sections.push(createHeading('SUMMARY'));
      sections.push(createText(p.summary));
      sections.push(new Paragraph({ text: '' })); // Spacer
    }
  }

  // Experience
  if (content.experience && content.experience.length > 0) {
    sections.push(createHeading('EXPERIENCE'));

    content.experience.forEach(exp => {
      // Job title and company
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: exp.jobTitle || '', bold: true, size: 24 }),
          new TextRun({ text: exp.company ? ` - ${exp.company}` : '', size: 24 })
        ],
        spacing: { before: 200, after: 50 }
      }));

      // Location and dates
      const details = [];
      if (exp.location) details.push(exp.location);
      if (exp.startDate) {
        const dateRange = exp.current ?
          `${exp.startDate} - Present` :
          `${exp.startDate} - ${exp.endDate || ''}`;
        details.push(dateRange);
      }

      if (details.length > 0) {
        sections.push(new Paragraph({
          children: [
            new TextRun({ text: details.join(' | '), italics: true })
          ],
          spacing: { after: 100 }
        }));
      }

      // Description
      if (exp.description) {
        sections.push(createText(exp.description));
      }
    });

    sections.push(new Paragraph({ text: '' })); // Spacer
  }

  // Education
  if (content.education && content.education.length > 0) {
    sections.push(createHeading('EDUCATION'));

    content.education.forEach(edu => {
      // Degree and school
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: edu.degree || '', bold: true, size: 24 }),
          new TextRun({ text: edu.school ? ` - ${edu.school}` : '', size: 24 })
        ],
        spacing: { before: 200, after: 50 }
      }));

      // Location, dates, and GPA
      const details = [];
      if (edu.location) details.push(edu.location);
      if (edu.startDate) {
        details.push(`${edu.startDate} - ${edu.endDate || ''}`);
      }
      if (edu.gpa) details.push(`GPA: ${edu.gpa}`);

      if (details.length > 0) {
        sections.push(new Paragraph({
          children: [
            new TextRun({ text: details.join(' | '), italics: true })
          ],
          spacing: { after: 100 }
        }));
      }

      // Description
      if (edu.description) {
        sections.push(createText(edu.description));
      }
    });

    sections.push(new Paragraph({ text: '' })); // Spacer
  }

  // Skills
  if (content.skills) {
    sections.push(createHeading('SKILLS'));

    if (content.skills.technical && content.skills.technical.length > 0) {
      sections.push(createBoldText('Technical', content.skills.technical.join(', ')));
    }

    if (content.skills.soft && content.skills.soft.length > 0) {
      sections.push(createBoldText('Soft Skills', content.skills.soft.join(', ')));
    }

    if (content.skills.languages && content.skills.languages.length > 0) {
      sections.push(createBoldText('Languages', content.skills.languages.join(', ')));
    }

    sections.push(new Paragraph({ text: '' })); // Spacer
  }

  // Projects
  if (content.projects && content.projects.length > 0) {
    sections.push(createHeading('PROJECTS'));

    content.projects.forEach(proj => {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: proj.name || '', bold: true, size: 24 })
        ],
        spacing: { before: 200, after: 50 }
      }));

      if (proj.technologies) {
        sections.push(createBoldText('Technologies', proj.technologies));
      }

      if (proj.startDate) {
        const dateRange = `${proj.startDate} - ${proj.endDate || 'Present'}`;
        sections.push(createBoldText('Duration', dateRange));
      }

      if (proj.link) {
        sections.push(createBoldText('Link', proj.link));
      }

      if (proj.description) {
        sections.push(createText(proj.description));
      }
    });

    sections.push(new Paragraph({ text: '' })); // Spacer
  }

  // Certificates
  if (content.certificates && content.certificates.length > 0) {
    sections.push(createHeading('CERTIFICATIONS'));

    content.certificates.forEach(cert => {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: cert.name || '', bold: true, size: 24 })
        ],
        spacing: { before: 200, after: 50 }
      }));

      const details = [];
      if (cert.issuer) details.push(cert.issuer);
      if (cert.date) details.push(cert.date);

      if (details.length > 0) {
        sections.push(new Paragraph({
          children: [
            new TextRun({ text: details.join(' | '), italics: true })
          ],
          spacing: { after: 100 }
        }));
      }

      if (cert.link) {
        sections.push(createBoldText('Credential', cert.link));
      }

      if (cert.description) {
        sections.push(createText(cert.description));
      }
    });

    sections.push(new Paragraph({ text: '' })); // Spacer
  }

  // Activities
  if (content.activities && content.activities.length > 0) {
    sections.push(createHeading('ACTIVITIES'));

    content.activities.forEach(act => {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: act.title || '', bold: true, size: 24 }),
          new TextRun({ text: act.organization ? ` - ${act.organization}` : '', size: 24 })
        ],
        spacing: { before: 200, after: 50 }
      }));

      if (act.startDate) {
        const dateRange = `${act.startDate} - ${act.endDate || 'Present'}`;
        sections.push(new Paragraph({
          children: [
            new TextRun({ text: dateRange, italics: true })
          ],
          spacing: { after: 100 }
        }));
      }

      if (act.description) {
        sections.push(createText(act.description));
      }
    });
  }

  // Create document
  const doc = new Document({
    sections: [{
      properties: {},
      children: sections
    }]
  });

  // Generate buffer
  const buffer = await Packer.toBuffer(doc);
  return buffer;
};

module.exports = { generateDocx };
