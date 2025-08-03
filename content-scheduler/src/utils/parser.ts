import { ContentPiece, ParsedWeekPlan } from '@/types/content';

// Portuguese day names to numbers (0 = Sunday, 1 = Monday, etc.)
const dayNameToNumber: { [key: string]: number } = {
  'domingo': 0,
  'segunda': 1, 'segunda-feira': 1,
  'terça': 2, 'terça-feira': 2,
  'quarta': 3, 'quarta-feira': 3,
  'quinta': 4, 'quinta-feira': 4,
  'sexta': 5, 'sexta-feira': 5,
  'sábado': 6,
};

function parseWeekRange(headerText: string): { startDate: Date; endDate: Date } {
  // Extract date range from header like "(02/08 a 08/08)"
  const dateRangeMatch = headerText.match(/\((\d{2}\/\d{2})\s+a\s+(\d{2}\/\d{2})\)/);
  
  if (!dateRangeMatch) {
    throw new Error('Could not parse date range from header');
  }

  const [, startDateStr, endDateStr] = dateRangeMatch;
  const currentYear = new Date().getFullYear();
  
  // Parse DD/MM format
  const [startDay, startMonth] = startDateStr.split('/').map(Number);
  const [endDay, endMonth] = endDateStr.split('/').map(Number);
  
  const startDate = new Date(currentYear, startMonth - 1, startDay);
  const endDate = new Date(currentYear, endMonth - 1, endDay);
  
  return { startDate, endDate };
}

function findDateForDay(dayName: string, startDate: Date): string {
  const normalizedDayName = dayName.toLowerCase().trim();
  const targetDayNumber = dayNameToNumber[normalizedDayName];
  
  if (targetDayNumber === undefined) {
    throw new Error(`Unknown day name: ${dayName}`);
  }
  
  // Find the date within the week that matches the target day
  const weekStart = new Date(startDate);
  const startDayNumber = weekStart.getDay();
  
  // Calculate days to add to get to target day
  let daysToAdd = targetDayNumber - startDayNumber;
  if (daysToAdd < 0) {
    daysToAdd += 7; // Next week
  }
  
  const targetDate = new Date(weekStart);
  targetDate.setDate(weekStart.getDate() + daysToAdd);
  
  // Return in YYYY-MM-DD format
  return targetDate.toISOString().split('T')[0];
}

function extractContentFromSection(section: string, postNumber: number, startDate: Date): ContentPiece {
  // Extract title from the first line (e.g., "1. Post de Sábado (Foco: Geral/Comunidade)")
  const lines = section.trim().split('\n');
  const titleLine = lines[0];
  
  // Extract day name from title
  const dayMatch = titleLine.match(/Post de (\w+(?:-\w+)?)/i);
  if (!dayMatch) {
    throw new Error(`Could not extract day from title: ${titleLine}`);
  }
  
  const dayName = dayMatch[1];
  const date = findDateForDay(dayName, startDate);
  
  // Extract post description (after "Descrição do Post (Imagem/Arte):")
  let postDescription = '';
  let caption = '';
  let currentSection = '';
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('Descrição do Post (Imagem/Arte):')) {
      currentSection = 'description';
      postDescription = line.replace('Descrição do Post (Imagem/Arte):', '').trim();
    } else if (line.startsWith('Legenda:')) {
      currentSection = 'caption';
      // Skip the "Legenda:" line itself
    } else if (currentSection === 'description' && line && !line.startsWith('Legenda:')) {
      postDescription += (postDescription ? ' ' : '') + line;
    } else if (currentSection === 'caption' && line) {
      caption += (caption ? '\n' : '') + line;
    }
  }
  
  return {
    id: `content-${postNumber}`,
    date,
    title: titleLine.replace(/^\d+\.\s*/, ''), // Remove number prefix
    isPublished: false,
    fullContent: {
      postDescription: postDescription.trim(),
      caption: caption.trim()
    }
  };
}

export function parseContentPlan(text: string): ParsedWeekPlan {
  const lines = text.split('\n');
  
  // Find the main header
  const headerLine = lines.find(line => line.includes('Plano de Conteúdo Semanal'));
  if (!headerLine) {
    throw new Error('Could not find content plan header');
  }
  
  const { startDate } = parseWeekRange(headerLine);
  
  // Find the description (usually the second line)
  const description = lines[1]?.trim() || '';
  
  // Split content by numbered posts
  const contentSections: string[] = [];
  let currentSection = '';
  let inContentSection = false;
  
  for (const line of lines) {
    // Check if this is a numbered post (e.g., "1. Post de Sábado")
    if (/^\d+\.\s+Post de/.test(line.trim())) {
      if (currentSection) {
        contentSections.push(currentSection);
      }
      currentSection = line;
      inContentSection = true;
    } else if (inContentSection) {
      currentSection += '\n' + line;
    }
  }
  
  // Add the last section
  if (currentSection) {
    contentSections.push(currentSection);
  }
  
  // Parse each content section
  const content: ContentPiece[] = [];
  contentSections.forEach((section, index) => {
    try {
      const contentPiece = extractContentFromSection(section, index + 1, startDate);
      content.push(contentPiece);
    } catch (error) {
      console.warn(`Failed to parse content section ${index + 1}:`, error);
    }
  });
  
  return {
    weekRange: headerLine,
    description,
    content
  };
}