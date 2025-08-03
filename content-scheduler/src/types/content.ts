export interface ContentPiece {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  title: string;
  isPublished: boolean;
  fullContent: {
    postDescription: string;
    caption: string;
  };
}

export interface ParsedWeekPlan {
  weekRange: string;
  description: string;
  content: ContentPiece[];
}