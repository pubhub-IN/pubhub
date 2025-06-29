import { X, Linkedin, Twitter, Copy, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  repoName: string;
  content: string;
}

export function ShareModal({
  isOpen,
  onClose,
  repoName,
  content,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  // Extract the platform and text from content string
  const getPlatformAndText = () => {
    if (!content) return { platform: "", text: "" };

    const colonIndex = content.indexOf(":");
    if (colonIndex < 0) return { platform: "", text: content.trim() };

    return {
      platform: content.substring(0, colonIndex).trim(),
      text: content.substring(colonIndex + 1).trim(),
    };
  };

  const { platform, text } = getPlatformAndText();

  // Reset copied state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.href
    )}&title=${encodeURIComponent(
      `Sharing my project: ${repoName}`
    )}&summary=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "width=600,height=600");
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Share {repoName} on socials
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Close modal"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Generated Content {platform && `(Optimized for ${platform})`}
            </label>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm">
              {text}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Share on
            </label>
            <div className="flex gap-3">
              <button
                onClick={handleLinkedInShare}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </button>
              <button
                onClick={handleTwitterShare}
                className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
              >
                <Twitter className="w-4 h-4" />X (Twitter)
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-600 transition-colors ml-auto"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/30 px-6 py-3 flex justify-end border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-green-300 dark:border-green-600 rounded-md text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
