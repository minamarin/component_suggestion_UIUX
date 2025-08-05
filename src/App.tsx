//This React App.tsx file establishes the core of a full-stack web application with dynamic routing, dark mode support, and user authentication views.
// It imports essential components including ComponentSuggester, stylesheets, Nova Design System UI elements, and React Router utilities.
import ComponentSuggester from '../components/ComponentSuggester.tsx';
import './App.css';
import './responsive-textarea.css';
//The structure includes three main pages: the homepage (which showcases the AI-powered component suggester), a login page, and a signup page;
//  all served through react-router-dom’s <Routes> and <Route> system for client-side navigation.
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Typography } from '@visa/nova-react';
import { Button } from '@visa/nova-react';
import { VisaModeDarkTiny } from '@visa/nova-icons-react';
import Login from './pages/Login';
import Signup from './pages/Signup';
//When setCount is called, the component re-renders with the new state.
//useEffect lets you run side effects, which are actions that affect things outside the component (like fetching data, updating the DOM, or storing data in localStorage).
import { useState, useEffect } from 'react';

function App() {
  //Two useState hooks track user interaction and UI preferences.
  //The logoClickCount variable is used as a key to re-render the main content when the Visa logo is clicked, offering a soft reset mechanism.
  const [logoClickCount, setLogoClickCount] = useState(0);
  //The isDarkMode state governs whether the dark theme is enabled. This is initialized in a useEffect hook that runs once when the component mounts.
  // It reads any saved preference from localStorage or falls back to the system’s dark mode preference via window.matchMedia.
  const [isDarkMode, setIsDarkMode] = useState(false);

  //When the app loads, check if the user has a saved dark mode preference. If they do, use it. If not, use their system preference.
  // Set that value into React state so we can conditionally render the dark/light theme.
  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setIsDarkMode(JSON.parse(savedTheme));
    } else {
      // Check system preference
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    //This effect doesn’t depend on any dynamic variables, so just run it once when the component first mounts, and never again.
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      //	Updates the <html> class to apply the right theme
      // A second useEffect hook watches for changes in the isDarkMode state.
      // Whenever this boolean updates, it toggles the dark class on the root <html> element—activating Tailwind’s dark mode styles—and saves the preference to localStorage.
      // This ensures the user’s theme choice persists across page reloads or sessions
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    //Saves the preference to localStorage so it persists across sessions
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    //This effect runs every time isDarkMode changes (not just on mount).
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    console.log('Dark mode toggled:', !isDarkMode); // Debug log
  };

  //JSX: JAVASCRIPT XML EXTENSIBLE MARKUP LANGUAGE
  // LETS ME WRITE UI CODE THAT LOOKS LIKE HTML INSIDE REACT COMPONENTS
  return (
    <Router>
      <div>
        {/* HEADER: The <header> contains a responsive layout with the Visa logo on the left, a flexible spacer in the middle, 
        and interactive elements (theme toggle, login, and signup buttons) on the right.  */}
        <header className='fixed top-0 left-0 w-full flex flex-col z-50'>
          {/* LOGO & BUTTONS SECTION - Responsive Flex */}
          <div
            className='flex items-center w-full py-4 justify-between px-6'
            style={{
              backgroundColor: 'transparent',
              padding: '20px 0',
              boxSizing: 'border-box',
            }}
          >
            {/* Logo aligned left:  Below the main header, two animated accent bars (blue and yellow) are rendered using inline CSS and keyframe animations defined at the bottom of the file. 
            These provide a unique visual identity tied to Visa’s branding palette, using linear-gradient fades and slide-in animations from both sides.
            This tells React to treat this <div> as a unique element when logoClickCount changes. 
            It forces React to re-render this whole section when the logo is clicked (likely used for resetting component state).*/}
            <div className='flex items-center'>
              <Link to='/' onClick={() => setLogoClickCount((c) => c + 1)}>
                <img
                  src='visa.png'
                  alt='Visa Logo'
                  style={{
                    height: '35px',
                    objectFit: 'contain',
                    cursor: 'pointer',
                  }}
                />
              </Link>
            </div>

            {/* Flexible spacer for responsiveness */}
            <div style={{ flex: 1 }}></div>

            {/* Login/Signup buttons aligned right */}
            <div className='flex items-center' style={{ gap: '12px' }}>
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className='p-2 rounded-lg bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                aria-label='Toggle dark mode'
                title={
                  isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  border: 'none',
                  background: 'transparent',
                }}
              >
                <VisaModeDarkTiny
                  style={{
                    width: '20px',
                    height: '20px',
                    color: isDarkMode ? '#fbbf24' : '#374151',
                    transition: 'color 0.3s ease',
                  }}
                />
              </button>

              <Link to='/login'>
                <Button colorScheme='secondary'>Login</Button>
              </Link>
              <Link to='/signup'>
                <Button className='button-primary'>Sign Up</Button>
              </Link>
            </div>
          </div>
          {/* LINEAR GRADIENT fades at the ends */}
          <div
            className='mx-auto center animate-slide-in-right'
            style={{
              height: '1.2rem',
              width: '100%',
              maxWidth: '1200px',
              background:
                'linear-gradient(to right, transparent, #2563EB 20%, #2563EB 80%, transparent)',
            }}
          ></div>

          {/* Spacer */}
          <div
            className='w-screen'
            style={{
              height: '0.7rem',
            }}
          ></div>

          {/* Yellow Bar with fade on both ends */}
          <div
            className='mx-auto center animate-slide-in-left'
            style={{
              height: '1.2rem',
              width: '100%',
              maxWidth: '1000px',
              background:
                'linear-gradient(to right, transparent, #facc15 20%, #facc15 80%, transparent)',
            }}
          ></div>
        </header>

        {/* MAIN CONTENT: Finally, the main application area is rendered within a div whose key is tied to the logo click count (to trigger reset effects). 
        This region conditionally renders routes depending on the URL, such as displaying the ComponentSuggester on the home page or Login and Signup pages accordingly. 
        The whole layout is styled with TailwindCSS utilities and enhanced with Nova’s design system to maintain a consistent look and feel while offering interactive and accessible UX.*/}

        {/* This uses Tailwind CSS utility classes to style the layout, spacing, and dark mode responsiveness. */}
        <div
          key={logoClickCount}
          className='mx-auto mt-28 p-4 flex flex-col items-center text-center min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300'
        >
          <Routes>
            <Route
              path='/'
              element={
                <>
                  <Typography variant='display-2'>
                    Component Suggester
                  </Typography>
                  <ComponentSuggester />
                </>
              }
            />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </div>

        {/* ANIMATIONS: ease out is for starting fast and ending slow */}
        <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.7s ease-out;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.7s ease-out;
        }
      `}</style>
      </div>
    </Router>
  );
}

export default App;
