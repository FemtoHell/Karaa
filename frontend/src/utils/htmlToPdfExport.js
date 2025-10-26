export const captureResumePreviewHtml = (previewRef) => {
  if (!previewRef || !previewRef.current) {
    throw new Error('Preview ref not available');
  }

  const previewElement = previewRef.current;
  
  const styles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        return Array.from(styleSheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n');
      } catch (e) {
        console.warn('Could not access stylesheet:', e);
        return '';
      }
    })
    .join('\n');

  const inlineStyles = `
    .resume-preview-page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 20mm;
      background: white;
      box-sizing: border-box;
    }
    
    .resume-preview-page * {
      box-sizing: border-box;
    }
    
    @page {
      size: A4;
      margin: 0;
    }
    
    @media print {
      .resume-preview-page {
        margin: 0;
        padding: 20mm;
      }
    }
  `;

  const html = previewElement.outerHTML;
  const css = styles + '\n' + inlineStyles;

  return { html, css };
};

export const exportResumeAsHtmlPdf = async (resumeId, previewRef, authToken) => {
  try {
    const { html, css } = captureResumePreviewHtml(previewRef);

    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/resumes/${resumeId}/export/pdf-html`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      credentials: 'include',
      body: JSON.stringify({ html, css })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to export PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true };
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
};
