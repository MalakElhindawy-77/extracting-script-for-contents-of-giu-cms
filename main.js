async function downloadPDFs() {
  const links = document.querySelectorAll('a');
  
  for (const link of links) {
    if (link.textContent.trim() === 'Download Content') {
      // Traverse up to the closest .card-body container, then find the <strong> tag inside it
      const cardBody = link.closest('.card-body');
      const titleEl = cardBody ? cardBody.querySelector('strong') : null;
      
      // Clean the text and sanitize characters that aren't allowed in OS filenames
      const rawTitle = titleEl ? titleEl.textContent.trim() : 'document';
      const cleanTitle = rawTitle.replace(/[\/\\?%*:|"<>]/g, '-');
      const fileName = `${cleanTitle}.pdf`;
      
      try {
        const response = await fetch(link.href);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        
        // 500ms delay to prevent Chrome from blocking rapid multiple downloads
        await new Promise(res => setTimeout(res, 500));
      } catch (err) {
        console.error(`Failed to download: ${fileName}`, err);
      }
    }
  }
}

downloadPDFs();