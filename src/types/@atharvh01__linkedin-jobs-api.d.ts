declare module '@atharvh01/linkedin-jobs-api/src/services/linkedinService.js' {
  export function fetchJobListings(keywords: string, location: string, dateSincePosted?: string): Promise<any[]>;
} 