import React from 'react';
import Modal from './Modal';

export default function VideoModal({ isOpen, onClose, videoUrl, title }) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || "Course Video"} maxWidth="max-w-4xl">
      <div className="w-full aspect-video bg-crmisa-darkNavy rounded-lg overflow-hidden mt-4">
        {videoUrl ? (
          <video 
            src={videoUrl} 
            controls 
            autoPlay
            controlsList="nodownload"
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white flex-col">
            <span className="text-2xl font-bold mb-2">No Video Found</span>
            <span className="text-slate-400 text-sm">This course does not have an associated video.</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
