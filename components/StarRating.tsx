import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // e.g. 3.5
  setRating?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  setRating,
  readOnly = false,
  size = 20,
}) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1">
      {stars.map((starIndex) => {
        // Calculate how much of this star is filled
        // If rating is 3.5:
        // starIndex 3: filled (3 <= 3.5)
        // starIndex 4: half (3.5 > 3 && 3.5 < 4) -> 0.5 remainder logic
        
        let fillPercentage = 0;
        if (rating >= starIndex) {
          fillPercentage = 100;
        } else if (rating >= starIndex - 0.5) {
          fillPercentage = 50;
        }

        return (
          <div
            key={starIndex}
            className={`relative inline-block ${!readOnly ? "cursor-pointer transition-transform active:scale-110 hover:scale-105" : ""}`}
            style={{ width: size, height: size }}
          >
            {/* Background Star (Gray/Empty) */}
            <Star
              size={size}
              className="text-gray-200 absolute inset-0 fill-gray-100"
              strokeWidth={1.5}
            />

            {/* Foreground Star (Colored/Filled) - Clipped */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star
                size={size}
                className="text-brand-500 fill-brand-500"
                strokeWidth={1.5}
              />
            </div>

            {/* Click Interaction Overlay (Split into left and right halves) */}
            {!readOnly && setRating && (
              <div className="absolute inset-0 flex">
                {/* Left Half Click Target */}
                <div
                  className="w-1/2 h-full z-10"
                  onClick={() => setRating(starIndex - 0.5)}
                />
                {/* Right Half Click Target */}
                <div
                  className="w-1/2 h-full z-10"
                  onClick={() => setRating(starIndex)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
