import { LessonContent } from '../../types/course';
import CodeBlock from '../ui/code-block';

interface LessonContentRendererProps {
  content: LessonContent;
}

export default function LessonContentRenderer({ content }: LessonContentRendererProps) {
  switch (content.type) {
    case 'text':
      return (
        <div className="prose prose-green dark:prose-invert max-w-none mb-4">
          {content.content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('- ')) {
              return <li key={index}>{paragraph.slice(2)}</li>;
            }
            
            // Handle Markdown-style headings
            if (paragraph.startsWith('##')) {
              return <h2 key={index} className="text-xl font-bold mt-4 mb-2">{paragraph.slice(2).trim()}</h2>;
            }
            
            if (paragraph.startsWith('#')) {
              return <h1 key={index} className="text-2xl font-bold mt-6 mb-3">{paragraph.slice(1).trim()}</h1>;
            }
            
            // Handle bold text with Markdown ** syntax
            const boldRegex = /\*\*(.*?)\*\*/g;
            let parts = paragraph.split(boldRegex);
            
            if (parts.length > 1) {
              return (
                <p key={index} className="mb-2">
                  {parts.map((part, i) => {
                    // Even indices are regular text, odd indices are bold text
                    return i % 2 === 0 ? part : <strong key={i}>{part}</strong>;
                  })}
                </p>
              );
            }
            
            return <p key={index} className="mb-2">{paragraph}</p>;
          })}
        </div>
      );
    
    case 'code':
      return (
        <CodeBlock 
          language={content.language || 'javascript'} 
          code={content.content} 
        />
      );
    
    case 'image':
      return (
        <figure className="my-4">
          <img 
            src={content.content} 
            alt={content.caption || 'Course image'} 
            className="rounded-lg max-w-full h-auto"
          />
          {content.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {content.caption}
            </figcaption>
          )}
        </figure>
      );
    
    case 'video':
      return (
        <figure className="my-4">
          <video 
            src={content.content}
            controls
            className="rounded-lg w-full"
            poster={content.caption ? undefined : content.content.replace(/\.[^.]+$/, '.jpg')}
          />
          {content.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {content.caption}
            </figcaption>
          )}
        </figure>
      );
    
    default:
      return null;
  }
}
