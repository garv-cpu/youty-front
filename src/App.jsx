import { useState } from 'react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';


function App() {
  const [url, setUrl] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!url) {
      setError('Please enter a YouTube URL');
      return;
    }
    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/convert',
        { url, recaptchaToken },
        { responseType: 'blob' }
      );

      // Create a download link for the MP3
      const blob = new Blob([response.data], { type: 'audio/mp3' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'converted-audio.mp3';
      link.click();
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          YouTube to MP3 Converter
        </h1>
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mb-4">
          <ReCAPTCHA
            sitekey="6Lf0BlIrAAAAAJ4R_NsQsAnD3oA9J9NGjXC7rA65"
            onChange={(token) => setRecaptchaToken(token)}
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleConvert}
          disabled={loading}
          className={`w-full p-2 text-white rounded ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Converting...' : 'Generate MP3'}
        </button>
      </div>
    </div>
  );
}

export default App;