'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseContentPlan } from '@/utils/parser';
import { saveContentToStorage } from '@/utils/localStorage';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGenerateSchedule = async () => {
    if (!inputText.trim()) {
      setError('Please paste your content plan text');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Parse the content plan
      const parsedPlan = parseContentPlan(inputText);
      
      // Save to localStorage
      saveContentToStorage(parsedPlan.content);
      
      // Redirect to calendar page
      router.push('/calendar');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse content plan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Content Scheduler
          </h1>
          <p className="text-gray-600">
            Paste your weekly content plan below to generate your schedule
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="content-input" className="block text-sm font-medium text-gray-700 mb-2">
              Content Plan Text
            </label>
            <textarea
              id="content-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your structured content plan here..."
              className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm font-mono"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleGenerateSchedule}
              disabled={isLoading || !inputText.trim()}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Schedule...</span>
                </div>
              ) : (
                'Generate Schedule'
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Example Format:</h3>
          <pre className="text-xs text-gray-600 overflow-x-auto">
{`🗓️ Plano de Conteúdo Semanal (02/08 a 08/08)
Aqui estão 10 ideias de posts...

💡 10 Ideias de Conteúdo Estático (Feed)
1. Post de Sábado (Foco: Geral/Comunidade)

Descrição do Post (Imagem/Arte): Foto energética...

Legenda:
Atenção: Aquele gás extra...`}
          </pre>
        </div>
      </div>
    </div>
  );
}
