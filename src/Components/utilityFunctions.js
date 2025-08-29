export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}


export const cleanDescription = (description) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, 'text/html');

    const firstStrongP = doc.querySelector('p strong');
    if (firstStrongP) {
        const pTag = firstStrongP.closest('p');
        if (pTag) {
            pTag.remove();
        }
    }
    return doc.body.innerHTML;
};

export const videoIdParser = (url) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1); // removes the leading /
    } else if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v");
    }
  } catch (err) {
    console.error("Invalid URL", url);
    return null;
  }
};


export function extractDate(isoString) {
    if (!isoString) {
    return ''
    }
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const formatDateShort = (dateString) => {
    if (!dateString) {
        dateString = '2024-01-01';
    }

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options).replace(',', '');
}

export function showStatus(status) {
    if (status === true || status === 'true') {
        return 'Active'
    } else {
        return 'Inactive'
    }
}


export const renderSafeHTML = (content) => {
    if (!content) return '';
    
    try {
        // Simple sanitization - remove potentially dangerous code blocks
        return content
            .replace(/<pre><code[^>]*>/g, '')
            .replace(/<\/code><\/pre>/g, '');
    } catch (e) {
        console.error("Error processing HTML content:", e);
        return 'Content unavailable';
    }
};

export const downloadFile = async (filename, fileUrl) => {
    try {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = filename;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('Download initiated successfully');
        
    } catch (error) {
        console.error('Download failed:', error);
        // Fallback: open in new tab
        window.open(fileUrl, '_blank');
    }
};
export const downloadFileWithProgress = async (filename, fileUrl) => {
    try {
        console.log('Starting download with progress tracking...');
        
        const response = await fetch(fileUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentLength = response.headers.get('content-length');
        const total = parseInt(contentLength, 10);
        
        const reader = response.body.getReader();
        const chunks = [];
        let loaded = 0;
        
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            chunks.push(value);
            loaded += value.length;
            
            if (total) {
                const progress = (loaded / total) * 100;
                console.log(`Download progress: ${progress.toFixed(2)}%`);
            }
        }
        
        const blob = new Blob(chunks);
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
        
        console.log('Download completed successfully');
        
    } catch (error) {
        console.error('Download with progress failed:', error);
        // Fallback to direct download
        downloadFile(filename, fileUrl);
    }
};
