import { useEffect, useRef } from 'react';
import { ContentPiece } from '@/types/content';

import { Event } from 'react-big-calendar';

interface CalendarEvent extends Event {
  resource: ContentPiece;
}

interface ContentTooltipProps {
  event: CalendarEvent;
  position: { x: number; y: number };
  onClose: () => void;
  onMarkAsPublished: (contentId: string) => void;
}

export function ContentTooltip({ event, position, onClose, onMarkAsPublished }: ContentTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const { resource: content } = event;

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl max-w-md w-80 p-4"
      style={{
        left: position.x - 160, // Center the tooltip
        top: position.y - 10,
        transform: 'translateY(-100%)',
      }}
    >
      {/* Arrow pointing down */}
      <div
        className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"
        style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))' }}
      />

      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 text-sm pr-2">{content.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Date */}
        <div className="text-xs text-gray-500">
          {new Date(content.date).toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              content.isPublished ? 'bg-green-500' : 'bg-gray-500'
            }`}
          />
          <span className="text-xs text-gray-600">
            {content.isPublished ? 'Published' : 'Not Published'}
          </span>
        </div>

        {/* Post Description */}
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-1">Post Description:</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            {content.fullContent.postDescription}
          </p>
        </div>

        {/* Caption */}
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-1">Caption:</h4>
          <div className="max-h-32 overflow-y-auto">
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
              {content.fullContent.caption}
            </p>
          </div>
        </div>

        {/* Publish Button */}
        {!content.isPublished && (
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => onMarkAsPublished(content.id)}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-green-700 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Mark as Published</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}