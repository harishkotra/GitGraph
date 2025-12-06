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
      <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-2xl mb-8 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-teal-500 opacity-10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
          
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-br from-blue-400 to-teal-400">
                <img 
                    src={user.avatar_url} 
                    alt={user.login} 
                    className="w-full h-full rounded-full object-cover border-4 border-slate-800"
                />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-2 border border-slate-700">
                <Github className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">{user.name || user.login}</h1>
                <span className="text-blue-400 font-medium pb-1">@{user.login}</span>
            </div>
            
            <p className="text-slate-400 text-lg mb-4 max-w-2xl">
              {user.bio || profile.summary}
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-slate-400">
                <div className="flex items-center gap-1.5 bg-slate-700/50 px-3 py-1.5 rounded-full">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>{user.followers} followers</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-700/50 px-3 py-1.5 rounded-full">
                    <BookOpen className="w-4 h-4 text-teal-400" />
                    <span>{user.public_repos} repos</span>
                </div>
                <a 
                    href={user.html_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-slate-700/50 px-3 py-1.5 rounded-full hover:bg-slate-600 transition-colors cursor-pointer group"
                >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
            </div>
          </div>

          <div className="md:ml-auto flex flex-col items-center md:items-end justify-center">
             <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">2025 Vibe</div>
             <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text text-2xl font-bold">
                {profile.archetype}
             </div>
          </div>
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 mb-8 shadow-lg">
        <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">2025 AI Analysis</h2>
        <p className="text-slate-200 text-lg leading-relaxed font-light">
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