import React, { useRef, useEffect, useState } from 'react';

interface CameraModalProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          setError('Your browser does not support camera access.');
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError('Could not access the camera. Please check permissions.');
      }
    };

    startCamera();

    return () => {
      // Cleanup: stop the stream when the component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/png');
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Live Camera</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-md bg-gray-900"></video>
        )}
        <canvas ref={canvasRef} className="hidden"></canvas>
        <div className="flex justify-center space-x-4 mt-4">
          <button 
            onClick={handleCapture} 
            disabled={!!error}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            Capture Photo
          </button>
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;
