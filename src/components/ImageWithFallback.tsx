import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#ECE8DF] ${className}`}>
      {!error && src ? (
        <img
          src={src}
          alt={alt || 'კერძის ფოტო'}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-all duration-300 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
          }`}
          {...props}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#EFECE5] text-[#6F6A62]">
          <svg
            className="w-8 h-8 mb-2 opacity-50 text-[#7C8B70]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span className="text-xs font-medium text-[#6F6A62]">{fallbackTitle || alt || 'კერძის ფოტო'}</span>
        </div>
      )}
    </div>
  );
};
