export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export const formatDateShort = (dateString) => {
    if (!dateString) {
        dateString = '2024-01-01';
    }

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options).replace(',', '');
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
    if (!url) return null; // Check if the URL is null or undefined
    const videoURL = url;
    const splited = videoURL.split("v=");

    // Ensure that the URL contains the 'v=' part
    if (splited.length < 2) return null;

    const splitedAgain = splited[1].split("&");

    // Ensure that the 'v=' is followed by some ID
    if (splitedAgain.length === 0) return null;

    const videoId = splitedAgain[0];
    return videoId;
}

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

export function showStatus(status) {
    if (status === true || status === 'true') {
        return 'Active'
    } else {
        return 'Inactive'
    }
}

