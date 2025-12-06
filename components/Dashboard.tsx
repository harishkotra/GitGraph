import React from 'react';
import { GitHubUser, DeveloperProfile } from '../types';
import { SkillsChart } from './SkillsChart';
import { ShareableCard } from './ShareableCard';
import { Github, ExternalLink, MapPin, Users, BookOpen } from 'lucide-react';

interface DashboardProps {
  user: GitHubUser;
  profile: DeveloperProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, profile }) => {
  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
      
      {/* Header Profile Card */}
      <div className="bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-800 mb-8">
        
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
          
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 bg-slate-800">
                <img 
                    src={user.avatar_url} 
                    alt={user.login} 
                    className="w-full h-full rounded-full object-cover border-4 border-slate-950"
                />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-slate-950 rounded-full p-2 border border-slate-800">
                <Github className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">{user.name || user.login}</h1>
                <span className="text-slate-500 font-mono text-sm pb-1">@{user.login}</span>
            </div>
            
            <p className="text-slate-400 text-lg mb-4 max-w-2xl">
              {user.bio || profile.summary}
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-slate-400 font-medium">
                <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded">
                    <Users className="w-4 h-4 text-slate-300" />
                    <span>{user.followers} followers</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded">
                    <BookOpen className="w-4 h-4 text-slate-300" />
                    <span>{user.public_repos} repos</span>
                </div>
                <a 
                    href={user.html_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer group"
                >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
            </div>
          </div>

          <div className="md:ml-auto flex flex-col items-center md:items-end justify-center">
             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">2025 Vibe</div>
             <div className="text-white text-2xl font-bold tracking-tight">
                {profile.archetype}
             </div>
          </div>
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <h2 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-2">2025 AI Analysis</h2>
        <p className="text-slate-300 text-lg leading-relaxed font-light">
          "{profile.summary}"
        </p>
      </div>

      {/* Charts */}
      <SkillsChart skills={profile.skills} topLanguages={profile.topLanguages} />
      
      {/* Shareable Card Section */}
      <ShareableCard user={user} profile={profile} />

    </div>
  );
};