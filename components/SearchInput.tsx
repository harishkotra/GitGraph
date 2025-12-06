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
      <div className="relative flex items-center bg-slate-900 rounded p-2 border border-slate-700 focus-within:border-blue-500 transition-colors">
        <Search className="w-6 h-6 text-slate-500 ml-3" />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub Username..."
          className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-600 px-4 py-2 text-lg outline-none font-medium"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !username.trim()}
          className="bg-white hover:bg-slate-200 text-slate-900 rounded px-6 py-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center min-w-[100px] justify-center"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
        </button>
      </div>
    </form>
  );
};