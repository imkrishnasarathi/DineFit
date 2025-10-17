import React, { useRef, useState } from "react";

export default function ImageUpload({ onImageSelect }) {
  const fileInputRef = useRef();
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();
  const [stream, setStream] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onImageSelect(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      alert("Unable to access camera: " + err.message);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      onImageSelect(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
    setStream(null);
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button
        type="button"
        className="px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded shadow hover:brightness-95"
        onClick={() => fileInputRef.current.click()}
      >
        Upload from device
      </button>
      <button
        type="button"
        className="px-4 py-2 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] rounded shadow hover:brightness-95"
        onClick={startCamera}
      >
        Use Camera
      </button>
      {showCamera && (
        <div className="flex flex-col items-center gap-2 mt-4">
          <video ref={videoRef} autoPlay playsInline className="rounded shadow w-64 h-48 object-cover" />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              className="px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded shadow hover:brightness-95"
              onClick={capturePhoto}
            >
              Capture Photo
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-[hsl(var(--muted))] text-[hsl(var(--card-foreground))] rounded shadow hover:brightness-95"
              onClick={stopCamera}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
