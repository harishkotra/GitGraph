import React, { useState } from 'react';
import { SearchInput } from './components/SearchInput';
import { Dashboard } from './components/Dashboard';
import { fetchGitHubUser, fetchUserRepos } from './services/githubService';
import { analyzeProfileWithGemini } from './services/geminiService';
import { GitHubUser, DeveloperProfile, AppState } from './types';
import { Sparkles, Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [profileData, setProfileData] = useState<DeveloperProfile | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');

  const handleSearch = async (username: string) => {
    try {
      setAppState('LOADING');
      setErrorMsg(null);
      setUserData(null);
      setProfileData(null);

      // Step 1: Fetch User
      setLoadingStep('Locating developer...');
      const user = await fetchGitHubUser(username);
      setUserData(user);

      // Step 2: Fetch Repos
      setLoadingStep('Scanning repositories...');
      const repos = await fetchUserRepos(username);
      if (repos.length === 0) {
        throw new Error('This user has no public repositories.');
      }

      // Step 3: Analyze with Gemini
      setLoadingStep('Consulting 2025 Oracle...');
      
      // Create a timeout promise to race against the API call
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Analysis timed out. The profile might be too complex or the service is busy.")), 60000)
      );

      const profile = await Promise.race([
        analyzeProfileWithGemini(username, repos),
        timeoutPromise
      ]);

      setProfileData(profile);

      setAppState('SUCCESS');
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Something went wrong.');
      setAppState('ERROR');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      
      {/* Navigation / Header */}
      <header className="w-full border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-500">
            <Terminal className="w-6 h-6" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              GitGraph 2025
            </span>
          </div>
          <div className="text-xs text-slate-500 hidden sm:block">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-4 py-12 flex flex-col items-center">
        
        {/* Hero Section */}
        {appState === 'IDLE' && (
           <div className="text-center max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
                <Sparkles className="w-4 h-4" />
                <span>2025 Recap Engine</span>
             </div>
             <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
               Your 2025 <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-green-500">
                 Year in Code
               </span>
             </h1>
             <p className="text-lg text-slate-400 mb-10 leading-relaxed">
               Enter a GitHub username to visualize your languages, frameworks, and coding vibe exclusively for 2025.
             </p>
           </div>
        )}

        {/* Input Section - Always visible unless Success/Loading takes over full screen, but let's keep it sticky or central */}
        <div className={`transition-all duration-500 ${appState === 'SUCCESS' ? 'mb-12' : 'mb-0'}`}>
             {appState !== 'SUCCESS' && <SearchInput onSearch={handleSearch} isLoading={appState === 'LOADING'} />}
        </div>

        {/* Loading State */}
        {appState === 'LOADING' && (
          <div className="mt-12 flex flex-col items-center justify-center text-slate-400 animate-in fade-in duration-500">
             <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
             </div>
             <p className="text-lg font-medium text-slate-300 animate-pulse">{loadingStep}</p>
          </div>
        )}

        {/* Error State */}
        {appState === 'ERROR' && (
          <div className="mt-8 bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-md text-center text-red-200 animate-in zoom-in-95 duration-300">
            <p className="font-semibold mb-2">Analysis Failed</p>
            <p className="text-sm opacity-80">{errorMsg}</p>
            <button 
                onClick={() => setAppState('IDLE')}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded text-sm transition-colors"
            >
                Try Again
            </button>
          </div>
        )}

        {/* Success Dashboard */}
        {appState === 'SUCCESS' && userData && profileData && (
           <>
              <div className="flex justify-center w-full mb-8">
                <button 
                    onClick={() => setAppState('IDLE')}
                    className="text-slate-500 hover:text-white text-sm flex items-center gap-2 transition-colors"
                >
                    ← Analyze another profile
                </button>
              </div>
              <Dashboard user={userData} profile={profileData} />
           </>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 py-8 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} GitGraph 2025. Not affiliated with GitHub.</p>
      </footer>
    </div>
  );
};

export default App;