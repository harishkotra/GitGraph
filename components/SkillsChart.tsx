import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { Skill, SkillCategory } from '../types';

interface SkillsChartProps {
  skills: Skill[];
  topLanguages: { name: string; percentage: number }[];
}

const COLORS = ['#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-none shadow-none text-slate-200">
        <p className="font-bold">{label || payload[0].name}</p>
        <p className="text-sm font-mono">Score: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export const SkillsChart: React.FC<SkillsChartProps> = ({ skills, topLanguages }) => {
  // Filter top 15 skills for the bar chart to avoid clutter
  const topSkills = skills.slice(0, 15);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-8">
      {/* Bar Chart: Proficiency / Usage Score */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h3 className="text-xl font-bold mb-6 text-white flex items-center">
          <span className="w-1 h-6 bg-blue-500 mr-3"></span>
          Top Tech Stack
        </h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topSkills}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#1e293b', opacity: 1}} />
              <Bar dataKey="usageScore" radius={[0, 2, 2, 0]} barSize={20}>
                {topSkills.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: Language Distribution */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h3 className="text-xl font-bold mb-6 text-white flex items-center">
          <span className="w-1 h-6 bg-purple-500 mr-3"></span>
          Language Focus
        </h3>
        <div className="h-[350px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={topLanguages}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="percentage"
                stroke="none"
                >
                {topLanguages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
            </ResponsiveContainer>
            {/* Legend Overlay */}
            <div className="absolute top-0 right-0 h-full flex flex-col justify-center text-sm space-y-2 pointer-events-none">
                {topLanguages.map((lang, idx) => (
                    <div key={lang.name} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-none" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                        <span className="text-slate-300 font-medium">{lang.name}</span>
                        <span className="text-slate-500 font-mono">{lang.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      {/* Skill Tags Cloud */}
      <div className="col-span-1 lg:col-span-2 bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h3 className="text-xl font-bold mb-4 text-white">Full Inventory</h3>
        <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
                <span 
                    key={skill.name} 
                    className={`px-3 py-1 rounded text-xs font-bold border
                    ${skill.category === SkillCategory.LANGUAGE ? 'bg-blue-950 border-blue-900 text-blue-400' : ''}
                    ${skill.category === SkillCategory.FRAMEWORK ? 'bg-teal-950 border-teal-900 text-teal-400' : ''}
                    ${skill.category === SkillCategory.TOOL ? 'bg-purple-950 border-purple-900 text-purple-400' : ''}
                    ${skill.category === SkillCategory.DATABASE ? 'bg-amber-950 border-amber-900 text-amber-400' : ''}
                    ${skill.category === SkillCategory.PLATFORM ? 'bg-pink-950 border-pink-900 text-pink-400' : ''}
                    `}
                >
                    {skill.name}
                </span>
            ))}
        </div>
        <div className="flex gap-4 mt-4 text-xs text-slate-500 justify-end font-mono">
             <span className="flex items-center"><div className="w-2 h-2 bg-blue-500 mr-1"></div> Language</span>
             <span className="flex items-center"><div className="w-2 h-2 bg-teal-500 mr-1"></div> Framework</span>
             <span className="flex items-center"><div className="w-2 h-2 bg-purple-500 mr-1"></div> Tool</span>
             <span className="flex items-center"><div className="w-2 h-2 bg-amber-500 mr-1"></div> Database</span>
        </div>
      </div>

    </div>
  );
};