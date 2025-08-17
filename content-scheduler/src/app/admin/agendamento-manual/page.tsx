'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentPiece } from '@/types/content';
import { loadContentFromStorage, addContentToStorage } from '@/utils/localStorage';

interface FormData {
  title: string;
  date: string;
  postDescription: string;
  caption: string;
}

interface FormErrors {
  title?: string;
  date?: string;
  postDescription?: string;
  caption?: string;
}

export default function AgendamentoManualPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    date: '',
    postDescription: '',
    caption: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'A data não pode ser anterior ao dia atual';
      }
    }

    if (!formData.postDescription.trim()) {
      newErrors.postDescription = 'Descrição do post é obrigatória';
    }

    if (!formData.caption.trim()) {
      newErrors.caption = 'Legenda é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      // Carregar conteúdo existente
      const existingContent = loadContentFromStorage();

      // Verificar se já existe um post na mesma data
      const dateExists = existingContent.some(
        content => content.date === formData.date
      );

      if (dateExists) {
        setErrors({ date: 'Já existe um post agendado para esta data' });
        setIsSubmitting(false);
        return;
      }

      // Criar novo conteúdo
      const newContent: ContentPiece = {
        id: generateId(),
        date: formData.date,
        title: formData.title,
        isPublished: false,
        fullContent: {
          postDescription: formData.postDescription,
          caption: formData.caption,
        },
      };

      // Salvar no localStorage
      addContentToStorage(newContent);

      // Mostrar mensagem de sucesso
      setSuccessMessage('Agendamento criado com sucesso!');
      
      // Limpar formulário
      setFormData({
        title: '',
        date: '',
        postDescription: '',
        caption: '',
      });

      // Redirecionar para o calendário após 2 segundos
      setTimeout(() => {
        router.push('/calendar');
      }, 2000);

    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      setErrors({ title: 'Erro ao salvar agendamento. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/calendar');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            Agendamento Manual
          </h1>
          <p className="text-gray-600 mt-1">
            Adicione um novo post manualmente ao calendário de conteúdo
          </p>
        </div>

        <div className="p-6">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex">
                <svg
                  className="w-5 h-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="ml-3 text-green-700">{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Título do Post *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: Post de Segunda-feira (Motivacional)"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Data */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Data de Publicação *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.date ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Descrição do Post */}
            <div>
              <label
                htmlFor="postDescription"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Descrição do Post (Imagem/Arte) *
              </label>
              <textarea
                id="postDescription"
                name="postDescription"
                value={formData.postDescription}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.postDescription ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Descreva o tipo de imagem, arte ou visual que acompanhará o post..."
                disabled={isSubmitting}
              />
              {errors.postDescription && (
                <p className="mt-1 text-sm text-red-600">{errors.postDescription}</p>
              )}
            </div>

            {/* Legenda */}
            <div>
              <label
                htmlFor="caption"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Legenda *
              </label>
              <textarea
                id="caption"
                name="caption"
                value={formData.caption}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.caption ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Digite a legenda completa do post..."
                disabled={isSubmitting}
              />
              {errors.caption && (
                <p className="mt-1 text-sm text-red-600">{errors.caption}</p>
              )}
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Salvando...</span>
                  </div>
                ) : (
                  'Criar Agendamento'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}