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
    
    // Track download event
    if (typeof window.gtag === 'function') {
        window.gtag('event', 'download_card', { 
            event_category: 'engagement',
            event_label: user.login 
        });
    }

    setIsGenerating(true);
    
    try {
      // Small delay to ensure styles are applied
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#020617', // Match Slate 950
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
  
  return (
    <div className="flex flex-col items-center gap-6 mt-12 mb-12 w-full">
      
      <div className="flex items-center gap-2 text-slate-500 text-sm uppercase tracking-wider font-bold">
        <Share2 className="w-4 h-4" />
        <span>Share Your 2025 Era</span>
      </div>

      {/* The Card Container - Flat Design */}
      <div className="relative group">
          <div 
            ref={cardRef}
            className="w-[400px] h-[500px] bg-slate-900 border border-slate-700 rounded-none p-8 flex flex-col relative overflow-hidden"
          >
            {/* 2025 Badge */}
            <div className="absolute top-6 right-6 flex flex-col items-end">
                <span className="text-4xl font-extrabold text-slate-800 select-none">2025</span>
            </div>

            {/* User Info */}
            <div className="mt-8 flex flex-col items-center text-center z-10">
                <div className="w-24 h-24 rounded-full bg-slate-800 mb-4">
                    <img 
                        src={user.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover border-2 border-slate-700 bg-slate-800"
                        crossOrigin="anonymous" 
                    />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{user.name || user.login}</h2>
                <p className="text-slate-500 text-sm font-mono">@{user.login}</p>
            </div>

            {/* Archetype */}
            <div className="mt-6 text-center z-10 flex-grow flex flex-col justify-center">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-bold">My 2025 Vibe</div>
                <div className="text-3xl font-black text-white px-4 leading-tight">
                    {profile.archetype}
                </div>
            </div>

            {/* Stats/Skills Footer */}
            <div className="mt-auto pt-6 border-t border-slate-800 z-10">
                 <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-slate-500 font-bold uppercase">Top Tech</span>
                        <div className="flex gap-2">
                            {topSkills.map(s => (
                                <span key={s.name} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs font-mono rounded-sm border border-slate-700">
                                  {s.name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-60">
                        <Github className="w-4 h-4 text-white" />
                        <span className="text-xs text-white font-bold tracking-tight">GitGraph</span>
                    </div>
                 </div>
            </div>
          </div>
      </div>

      <button 
        onClick={handleDownload}
        disabled={isGenerating}
        className="flex items-center gap-2 bg-white hover:bg-slate-200 text-slate-900 px-6 py-3 rounded font-bold transition-all shadow-none border border-transparent"
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