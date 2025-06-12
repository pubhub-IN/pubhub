import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import { authService } from '../lib/auth';

const TECHNOLOGIES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  'Express',
  'Django',
  'Flask',
  'Spring Boot',
  'Laravel',
  'Rails',
  'Next.js',
  'Nuxt.js',
  'Svelte',
  'Flutter',
  'React Native',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'Google Cloud',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'GraphQL',
  'REST APIs',
  'Microservices',
  'DevOps',
  'CI/CD',
  'Git',
  'Machine Learning',
  'AI',
  'Blockchain',
  'Web3'
];

interface OnboardingProps {
  user: any;
  onComplete: (user: any) => void;
}

export default function Onboarding({ user, onComplete }: OnboardingProps) {
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleTechnology = (tech: string) => {
    setSelectedTechnologies(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const handleComplete = async () => {
    if (selectedTechnologies.length === 0) return;

    setIsLoading(true);
    try {
      const updatedUser = await authService.updateTechnologies(selectedTechnologies);
      onComplete(updatedUser);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating technologies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl shadow-lg mb-6">
            <img
              src={user.avatar_url}
              alt={user.github_username}
              className="w-12 h-12 rounded-xl"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to PubHub, {user.name || user.github_username}!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Which technologies are you currently learning or working with?
            This helps us personalize your experience.
          </p>
        </div>

        {/* Technology Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Select Your Technologies
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {TECHNOLOGIES.map((tech) => (
              <button
                key={tech}
                onClick={() => toggleTechnology(tech)}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedTechnologies.includes(tech)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <span className="font-medium text-sm">{tech}</span>
                {selectedTechnologies.includes(tech) && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
              </button>
            ))}
          </div>

          {/* Selected count */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              {selectedTechnologies.length} technologies selected
            </p>
          </div>

          {/* Continue button */}
          <div className="text-center">
            <button
              onClick={handleComplete}
              disabled={selectedTechnologies.length === 0 || isLoading}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
            >
              {isLoading ? 'Saving...' : 'Continue to Dashboard'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}