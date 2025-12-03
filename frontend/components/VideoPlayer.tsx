import React from 'react';
import { cn } from '../utils/cn';

interface VideoPlayerProps {
    src: string;
    title: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title }) => {
    return (
        <div className={cn("relative aspect-video bg-slate-900")}>
            <iframe
                width="100%"
                height="100%"
                src={src}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};
