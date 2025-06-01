import { useState, useEffect } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { ThemeToggle } from './ThemeToggle';

function App() {
  const [theme, setTheme] = useState(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }

    // Save theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Pipeline Builder</h1>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </header>

      <main className="app-main">
        <PipelineToolbar />
        <PipelineUI />
      </main>

      <SubmitButton />
    </div>
  );
}

export default App;
