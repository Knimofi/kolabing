import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  testimonialAuthor: string;
}

const VideoModal = ({ isOpen, onClose, videoUrl, testimonialAuthor }: VideoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[90vw] p-0 bg-background border-border">
        <DialogHeader className="sr-only">
          <DialogTitle>Video Recap - {testimonialAuthor}</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            aria-label="Close video"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="aspect-[9/16] w-full max-w-[360px] mx-auto bg-black rounded-lg overflow-hidden">
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-cover"
              poster=""
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;