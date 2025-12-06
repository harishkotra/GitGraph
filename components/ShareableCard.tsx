import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Github, Share2 } from 'lucide-react';
import { GitHubUser, DeveloperProfile } from '../types';

interface ShareableCardProps {
  user: GitHubUser;
  profile: DeveloperProfile;
}

export const ShareableCard: React.FC<ShareableCardProps> = ({ user, profile }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    
    try {
      // Small delay to ensure styles are applied
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0f172a', // Match slate-900
        scale: 2, // Retina quality
        useCORS: true, // Allow loading cross-origin images (avatar)
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${user.login}-2025-recap.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
      alert("Could not generate image. Please try screenshotting manually!");
    } finally {
      setIsGenerating(false);
    }
  };

  // Get top 3 skills for the card
  const topSkills = profile.skills.slice(0, 3);
  const topLang = profile.topLanguages[0]?.name || 'Code';

  return (
    <div className="flex flex-col items-center gap-6 mt-12 mb-12 w-full">
      
      <div className="flex items-center gap-2 text-slate-400 text-sm uppercase tracking-wider font-medium">
        <Share2 className="w-4 h-4" />
        <span>Share Your 2025 Era</span>
      </div>

      {/* The Card Container */}
      <div className="relative group perspective-1000">
          <div 
            ref={cardRef}
            className="w-[400px] h-[500px] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-2xl"
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[60px] -ml-16 -mb-16 pointer-events-none"></div>
            
            {/* 2025 Badge */}
            <div className="absolute top-6 right-6 flex flex-col items-end">
                <span className="text-4xl font-extrabold text-white/10 select-none">2025</span>
                <span className="text-xs text-blue-400 font-bold uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">Recap</span>
            </div>

            {/* User Info */}
            <div className="mt-8 flex flex-col items-center text-center z-10">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-teal-400 mb-4 shadow-lg">
                    <img 
                        src={user.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover border-4 border-slate-900 bg-slate-800"
                        crossOrigin="anonymous" 
                    />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{user.name || user.login}</h2>
                <p className="text-slate-400 text-sm">@{user.login}</p>
            </div>

            {/* Archetype */}
            <div className="mt-6 text-center z-10 flex-grow flex flex-col justify-center">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">My 2025 Vibe</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent px-4 leading-tight">
                    {profile.archetype}
                </div>
            </div>

            {/* Stats/Skills Footer */}
            <div className="mt-auto pt-6 border-t border-slate-800 z-10">
                 <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-500">Top Tech</span>
                        <div className="flex gap-2">
                            {topSkills.map(s => (
                                <span key={s.name} className="w-2 h-2 rounded-full bg-blue-500" title={s.name}></span>
                            ))}
                            <span className="text-xs text-slate-300 font-mono">
                                {topSkills.map(s => s.name).join(' • ')}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-50">
                        <Github className="w-4 h-4 text-white" />
                        <span className="text-[10px] text-white font-medium">GitGraph 2025</span>
                    </div>
                 </div>
            </div>
          </div>
      </div>

      <button 
        onClick={handleDownload}
        disabled={isGenerating}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-blue-500/10 border border-slate-700"
      >
        {isGenerating ? (
            <span className="animate-pulse">Capturing...</span>
        ) : (
            <>
                <Download className="w-4 h-4" />
                Download Card
            </>
        )}
      </button>

    </div>
  );
};
