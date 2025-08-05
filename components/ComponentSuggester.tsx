/*
ComponentSuggester.tsx
------------------------
A React component that allows users to describe a UI they'd like to build and receive relevant Visa design system components as suggestions. These suggestions come from either:
1. Local keyword matching against a component list
2. AI-generated suggestions via an external backend API

It also includes typewriter-style placeholder UX, chat history, code copy-to-clipboard, file attachment previews, and a live component preview.
*/


// Import necessary React hooks and dependencies
import { useState, useEffect } from 'react';
import { Button } from '@visa/nova-react';
import { VisaCopyLow, VisaAttachmentTiny } from '@visa/nova-icons-react';
import axios from 'axios';
import ComponentPreview from './ComponentPreview';
import { ClickableMessageCard } from './MessageComponent';

//TYPE DEFINITIONS: Structure for component data from backend
// Define TypeScript type for individual component suggestion
// Contains name, description, keywords, and code snippet string
// used for local suggestions
type ComponentType = {
  name: string;
  description: string;
  keywords: string[];
  codeSnippet: string;
};

// ✅ Typewriter placeholder phrases
const phrases = [
  'Type here for VISA components suggestion…',
  'Describe the UI you’d like to build…',
  'What would you like to create today?',
  'Start typing to discover relevant Visa components…',
];


/*
    ====== STATE OVERVIEW ======
    input: string = current user input
    chatHistory: any[] = chronological messages, includes AI/local entries
    components: ComponentType[] = all components fetched from backend
    copied: string|null = track what snippet was copied (for UI feedback)

    === Typewriter placeholder ===
    typedText: string = current visible placeholder animation
    charIndex: number = where we are in the current phrase
    currentPhraseIndex: number = which phrase in phrases[] is active

    === AI Response ===
    aiComponentName/code = the AI-suggested component (for live preview)

    === Autocomplete ===
    inputHistory: previous user inputs saved to localStorage
    suggestions: current matching autocomplete options
    selectedSuggestionIndex: which suggestion is highlighted
*/

const ComponentSuggester = () => {
  const [input, setInput] = useState('');
  // Chronological chat history: each entry is { type: 'ai' | 'local', ...props }
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [components, setComponents] = useState<ComponentType[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  // const [aiSuggestion, setAiSuggestion] = useState<string>('');

  // ✅ Typewriter states
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  const [aiComponentName, setAiComponentName] = useState('');
  const [aiComponentCode, setAiComponentCode] = useState('');
  const [previewCode, setPreviewCode] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // ✅ Autocomplete functionality
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // ✅ Fetch components.json from backend
  useEffect(() => {
    // .get('http://localhost:4000/api/components')
    axios
      .get('https://visa-component-backend-1.onrender.com/api/components')
      .then((res) => setComponents(res.data))
      .catch((err) => console.error('Failed to fetch components:', err));
  }, []);

  // ✅ Load input history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('componentSuggesterHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setInputHistory(parsedHistory);
      } catch (error) {
        console.error('Failed to parse input history:', error);
      }
    }
  }, []);

  // ✅ Typewriter effect
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    if (charIndex < currentPhrase.length) {
      const typingTimeout = setTimeout(() => {
        setTypedText(currentPhrase.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(typingTimeout);
    } else {
      const pauseTimeout = setTimeout(() => {
        setCharIndex(0);
        setTypedText('');
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, 2000);
      return () => clearTimeout(pauseTimeout);
    }
  }, [charIndex, currentPhraseIndex]);

  // ✅ Handle input changes with autocomplete
  const handleInputChange = (value: string) => {
    setInput(value);
    
    if (value.trim().length > 0) {
      // Filter suggestions based on input history and current input
      const filteredSuggestions = inputHistory
        .filter(historyItem => 
          historyItem.toLowerCase().includes(value.toLowerCase()) && 
          historyItem !== value
        )
        .slice(0, 5); // Limit to 5 suggestions
      
      // Also add some default suggestions if no history exists
      const defaultSuggestions = [
        'Password input field with show/hide option',
        'Clickable button to add an item to cart',
        'Remember me checkbox below login form',
        'Search input with autocomplete',
        'Toggle switch for settings'
      ].filter(suggestion => 
        suggestion.toLowerCase().includes(value.toLowerCase()) && 
        suggestion !== value &&
        !filteredSuggestions.includes(suggestion)
      ).slice(0, 5 - filteredSuggestions.length);
      
      const allSuggestions = [...filteredSuggestions, ...defaultSuggestions];
      setSuggestions(allSuggestions);
      setShowSuggestions(allSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedSuggestionIndex(-1);
  };

  // ✅ Save input to history
  const saveToHistory = (inputText: string) => {
    if (inputText.trim().length === 0) return;
    
    const updatedHistory = [
      inputText,
      ...inputHistory.filter(item => item !== inputText)
    ].slice(0, 50); // Keep only last 50 entries
    
    setInputHistory(updatedHistory);
    localStorage.setItem('componentSuggesterHistory', JSON.stringify(updatedHistory));
  };

  // ✅ Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          setInput(suggestions[selectedSuggestionIndex]);
          setShowSuggestions(false);
          setSelectedSuggestionIndex(-1);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // ✅ Select suggestion
  const selectSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // ✅ Local keyword-based suggestion
  const handleSuggest = () => {
    if (input.length > 500) {
      alert('word count exceeded');
      return;
    }
    
    // Save input to history
    saveToHistory(input);
    
    const lowerInput = input.toLowerCase();
    const matches = components.filter((component) =>
      component.keywords.some((keyword) => lowerInput.includes(keyword))
    );
    if (matches.length === 0) {
      alert('no components found');
      return;
    }
    // Add each local suggestion to chat history
    setChatHistory((prev) => [
      ...prev,
      ...matches.map((component) => ({
        type: 'local',
        name: component.name,
        description: component.description,
        codeSnippet: component.codeSnippet,
      })),
    ]);
  };

  const fetchAISuggestion = async () => {
    if (input.length > 500) {
      alert('word count exceeded');
      return;
    }
    
    // Save input to history
    saveToHistory(input);
    
    try {
      const res = await axios.post(
        'https://visa-component-backend-1.onrender.com/api/suggest',
        { input }
      );
      const { componentName, componentCode } = res.data;
      setAiComponentName(componentName);
      setAiComponentCode(componentCode);
      setPreviewCode(componentCode);
      // Add AI suggestion to chat history
      setChatHistory((prev) => [
        ...prev,
        {
          type: 'ai',
          name: componentName,
          codeSnippet: componentCode,
        },
      ]);
    } catch (err) {
      console.error('AI Suggestion error:', err);
    }
  };

  // ✅ Copy code snippet
  const handleCopy = async (snippet: string, name: string) => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(name);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // ✅ Handle file upload
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setAttachedFiles((prev) => [...prev, ...files]);
      console.log(
        'Files attached:',
        files.map((f) => f.name)
      );
    }
    // Reset the input value to allow selecting the same file again
    event.target.value = '';
  };

  const removeAttachedFile = (fileToRemove: File) => {
    setAttachedFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  const triggerFileUpload = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '2rem',
        textAlign: 'center',
      }}
    >
      {/* Hidden file input */}
      <input
        id='fileInput'
        type='file'
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept='.js,.jsx,.ts,.tsx,.html,.css,.json,.md,.txt,.py,.java,.cpp,.c,.php,.rb,.go,.rs,.swift,.kt'
        multiple
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      ></div>

      {/* Chat box: suggestion cards above, textarea and buttons at the bottom */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          width: '100%',
          maxWidth: '600px',
          minHeight: '200px',
          maxHeight: '600px',
          background: 'rgba(255,255,255,0.7)',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          padding: '2rem 1rem',
          position: 'relative',
          margin: '0 auto',
        }}
      >
        {/* Suggestion cards scrollable area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            marginBottom: '1rem',
            maxHeight: '350px',
          }}
        >
          {/* Render chatHistory in order: oldest at top, newest at bottom */}
          {chatHistory.map((entry, idx) => {
            if (entry.type === 'ai') {
              // Only show live preview for the most recent AI suggestion
              const isLatestAI =
                chatHistory.filter((e) => e.type === 'ai').slice(-1)[0] ===
                entry;
              return (
                <ClickableMessageCard
                  key={`ai-${idx}-${entry.name}`}
                  headline={entry.name}
                  subtitle={'AI Suggested Component'}
                  description={
                    <>
                      <div>
                        <strong>Code Snippet:</strong>
                      </div>
                      <pre
                        style={{
                          backgroundColor: '#e5e7eb',
                          padding: '1rem',
                          borderRadius: '8px',
                          overflowX: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <code style={{ flex: 1 }}>{entry.codeSnippet}</code>
                        <VisaCopyLow
                          aria-label='Copy to clipboard'
                          style={{
                            cursor: 'pointer',
                            width: '24px',
                            height: '24px',
                            flexShrink: 0,
                          }}
                          onClick={() =>
                            handleCopy(entry.codeSnippet, entry.name)
                          }
                        />
                      </pre>
                      {copied === entry.name && (
                        <span style={{ fontSize: '0.8rem', color: 'green' }}>
                          Copied!
                        </span>
                      )}
                      {isLatestAI && (
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Live Preview:</strong>
                          <ComponentPreview code={entry.codeSnippet} />
                        </div>
                      )}
                    </>
                  }
                />
              );
            } else {
              return (
                <ClickableMessageCard
                  key={`local-${idx}-${entry.name}`}
                  headline={entry.name}
                  subtitle={'Suggested Component'}
                  description={
                    <>
                      <div>{entry.description}</div>
                      <pre
                        style={{
                          backgroundColor: '#f7f7f7ff',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          overflowX: 'auto',
                          marginTop: '0.5rem',
                        }}
                      >
                        <code>{entry.codeSnippet}</code>
                        <VisaCopyLow
                          aria-label='Copy to clipboard'
                          style={{
                            marginLeft: '8px',
                            cursor: 'pointer',
                            width: '24px',
                            height: '24px',
                          }}
                          onClick={() =>
                            handleCopy(entry.codeSnippet, entry.name)
                          }
                        />
                      </pre>
                      {copied === entry.name && (
                        <span style={{ fontSize: '0.8rem', color: 'green' }}>
                          Copied!
                        </span>
                      )}
                    </>
                  }
                />
              );
            }
          })}
        </div>
        {/* Textarea and buttons at the bottom */}
        <div style={{ width: '100%' }}>
          {/* Attached files display */}
          {attachedFiles.length > 0 && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: '#374151',
                }}
              >
                Attached Files ({attachedFiles.length}):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {attachedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      border: '1px solid #d1d5db',
                    }}
                  >
                    <span>{file.name}</span>
                    <button
                      onClick={() => removeAttachedFile(file)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        fontSize: '1rem',
                        padding: '0',
                        lineHeight: '1',
                      }}
                      title='Remove file'
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ position: 'relative', width: '100%' }}>
            <textarea
              placeholder={typedText}
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                // Delay hiding suggestions to allow clicks
                setTimeout(() => setShowSuggestions(false), 150);
              }}
              onFocus={() => {
                if (input.trim().length > 0 && suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              className='responsive-textarea'
              style={{
                width: '100%',
                maxWidth: '100%',
                minWidth: '200px',
                minHeight: '100px',
                maxHeight: '300px',
                padding: '1.5rem',
                paddingRight: '3.5rem', // Extra space for attachment icon
                fontSize: '1.1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                outline: 'none',
                resize: 'both',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.07)',
                marginBottom: '0.5rem',
                boxSizing: 'border-box',
              }}
            />

            {/* Autocomplete suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  right: '0',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  marginTop: '0.25rem',
                }}
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion}
                    onClick={() => selectSuggestion(suggestion)}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      borderBottom: index < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                      backgroundColor: selectedSuggestionIndex === index ? '#f3f4f6' : 'white',
                      fontSize: '0.9rem',
                      color: '#374151',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}

            {/* Attachment icon positioned inside textarea at top-right */}
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                display: 'inline-block',
              }}
              onMouseEnter={() => setShowUploadModal(true)}
              onMouseLeave={() => setShowUploadModal(false)}
            >
              <button
                type='button'
                onClick={() => {
                  console.log('Attachment button clicked');
                  triggerFileUpload();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s ease',
                  width: '36px',
                  height: '36px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label='Attach file'
              >
                <VisaAttachmentTiny
                  style={{
                    width: '18px',
                    height: '18px',
                    color: '#6b7280',
                  }}
                />
              </button>

              {/* Upload Modal */}
              {showUploadModal && (
                <div
                  style={{
                    position: 'absolute',
                    top: '3rem',
                    right: '0',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    padding: '1rem',
                    zIndex: 1000,
                    minWidth: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                  onMouseEnter={() => setShowUploadModal(true)}
                  onMouseLeave={() => setShowUploadModal(false)}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      color: '#374151',
                      textAlign: 'center',
                    }}
                  >
                    Do you want to attach files? “Suggest with AI” will scan
                    uploaded front-end files, recommend relevant VPDS
                    components, and offer refactored versions.
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      onClick={() => {
                        console.log('User clicked Yes');
                        setShowUploadModal(false);
                        triggerFileUpload();
                      }}
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.4rem 0.8rem',
                        minWidth: 'auto',
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      alternate
                      onClick={() => {
                        console.log('User clicked No');
                        setShowUploadModal(false);
                      }}
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.4rem 0.8rem',
                        minWidth: 'auto',
                      }}
                    >
                      No
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0.5rem 0' }}
          >
            {input.length}/500
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '0.5rem',
            }}
          >
            <Button
              onClick={handleSuggest}
              disabled={attachedFiles.length > 0}
              style={{
                opacity: attachedFiles.length > 0 ? 0.5 : 1,
                cursor: attachedFiles.length > 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Suggest Components
            </Button>
            <Button alternate onClick={fetchAISuggestion}>
              Suggest with AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentSuggester;
