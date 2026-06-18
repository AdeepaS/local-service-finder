import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "👋 Hello! I'm your Service Assistant.\nDescribe your problem and I'll help you find the right service provider.",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const clearChat = () => {
    setMessages([
      {
        role: 'ai',
        content: "👋 Hello! I'm your Service Assistant.\nDescribe your problem and I'll help you find the right service provider.",
      }
    ]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input.trim() };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/ai/chat', {
        message: userMessage.content,
        history: messages.slice(1) // Exclude the initial greeting from the history sent to AI
      });

      const data = response.data.data;

      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: data.reply,
          categorySuggestion: data.categorySuggestion
        }
      ]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: "Sorry, I'm having trouble connecting right now. Please try again later."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExplore = (category) => {
    navigate(`/services?category=${encodeURIComponent(category)}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-secondary smooth-transition z-50 flex items-center justify-center focus-visible"
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col z-50 border border-gray-100 smooth-transition" style={{ height: '500px', maxHeight: 'calc(100vh - 120px)' }}>
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="font-semibold">Service Assistant</h3>
            </div>
            <button onClick={clearChat} className="text-sm text-white/80 hover:text-white" aria-label="Clear chat">
              Clear
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-none whitespace-pre-wrap'
                    }`}
                >
                  {msg.content}
                </div>

                {/* Category Suggestion Card */}
                {msg.categorySuggestion && (
                  <div className="mt-2 w-[85%] bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-500 font-medium mb-1">Suggested Service</p>
                    <p className="text-sm font-semibold text-gray-800 mb-2">{msg.categorySuggestion}</p>
                    <button
                      onClick={() => handleExplore(msg.categorySuggestion)}
                      className="w-full py-1.5 px-3 bg-primary/10 text-primary hover:bg-primary hover:text-white text-sm font-medium rounded-md transition-colors"
                    >
                      Explore Providers
                    </button>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-white text-gray-500 border border-gray-100 shadow-sm p-3 rounded-2xl rounded-tl-none flex items-center gap-1 h-10">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe your problem..."
                className="flex-1 max-h-32 min-h-[44px] p-2 resize-none rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                rows="1"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-primary text-white rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
