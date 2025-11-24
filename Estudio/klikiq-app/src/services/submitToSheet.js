// Replace this URL with the one you get after deploying the Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby_ezv28xNJhGn5vLS9VCg1EjBTjvhqApDGuAM8EPfy6fWt4W3RF97ZwBnFanFhAcmj/exec';

export const submitToGoogleSheet = async (formData) => {
    try {
        // We use 'no-cors' mode because Google Scripts don't support CORS headers easily for simple POSTs
        // This means we won't get a readable response, but the data will be sent.
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        return true;
    } catch (error) {
        console.error('Error submitting to Google Sheet:', error);
        return false;
    }
};
