import { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

function App() {
  const [url, setUrl] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleConvert = async () => {
    if (!url) {
      setError("Please enter a YouTube URL");
      return;
    }
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA");
      return;
    }

    setLoading(true);
    setProgress(0);
    setError("");

    try {
      const { data } = await axios.post("https://youty-back.onrender.com/convert", {
        url,
        recaptchaToken,
      });

      // Trigger download via browser
      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.download = "converted-audio.mp3";
      link.click();
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-pink-500 drop-shadow">
        You are at Youty!
      </h1>

      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          
        </h2>

        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <div className="mb-4">
          <ReCAPTCHA
            sitekey="6Lf0BlIrAAAAAJ4R_NsQsAnD3oA9J9NGjXC7rA65"
            onChange={(token) => setRecaptchaToken(token)}
          />
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {loading && (
          <div className="w-full bg-gray-600 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="bg-pink-500 h-3"
              style={{ width: `${progress}%`, transition: "width 0.3s" }}
            />
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={loading}
          className={`w-full p-3 rounded-lg font-semibold transition-all ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {loading ? "Converting..." : "Generate MP3"}
        </button>
      </div>
    </div>
  );
}

export default App;
