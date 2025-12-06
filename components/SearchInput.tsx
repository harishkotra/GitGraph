import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchInputProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative flex items-center bg-slate-800 rounded-lg p-2 border border-slate-700 shadow-xl">
        <Search className="w-6 h-6 text-slate-400 ml-3" />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub Username..."
          className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-2 text-lg outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !username.trim()}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-md px-6 py-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center min-w-[100px] justify-center"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
        </button>
      </div>
    </form>
  );
};
