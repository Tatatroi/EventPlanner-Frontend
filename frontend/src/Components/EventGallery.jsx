import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EventGallery.css";

function EventGallery() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const photoBaseUrl = "http://localhost:8081/api/photos/files/";

  useEffect(() => {
    fetch(`http://localhost:8081/api/photos/event/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPhotos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const openLightbox = (photo) => setSelectedImage(photo);
  const closeLightbox = () => setSelectedImage(null);

  const handleDownload = async (photoId) => {
      setIsDownloading(true);
      try {
          const imageUrl = `${photoBaseUrl}${photoId}`;
          const response = await fetch(imageUrl);
          const blob = await response.blob();

          const blobUrl = window.URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = `event_photo_${photoId}.jpg`; 
          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
          console.error("Download failed:", error);
          alert("Failed to download image.");
      } finally {
          setIsDownloading(false);
      }
  };

  if (loading) return <div className="gallery-loading">Loading album...</div>;

  return (
    <div className="gallery-container">
      {selectedImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <img 
                    src={`${photoBaseUrl}${selectedImage.idPhoto}`} 
                    alt="Full Screen View" 
                />
                
                {/* --- MODIFICARE 1: BUTON X SVG FINUȚ --- */}
                <button className="lightbox-close-btn" onClick={closeLightbox} title="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                
                <button 
                    className="lightbox-download-btn" 
                    onClick={() => handleDownload(selectedImage.idPhoto)}
                    disabled={isDownloading}
                >
                    {isDownloading ? "Downloading..." : "Download"}
                </button>
            </div>
        </div>
      )}

      <header className="gallery-header">
          <button className="back-link" onClick={() => navigate(`/event/${id}`)}>← Back to Event</button>
          <h1>Event Album</h1>
      </header>

      <div className="album-grid">
        {photos.length > 0 ? (
            photos.map((photo) => (
            <div key={photo.idPhoto} className="album-item" onClick={() => openLightbox(photo)}>
                <img
                src={`${photoBaseUrl}${photo.idPhoto}`}
                alt="Event moment"
                loading="lazy"
                />
            </div>
            ))
        ) : (
            <p className="no-photos-message">No photos have been added to this album yet.</p>
        )}
      </div>
    </div>
  );
}

export default EventGallery;