import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { youtubers, categories, getYoutubersByCategory, type YouTuber } from '../data/youtubers';

export default function Youtube() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const fuse = useMemo(() => {
        const options = {
            keys: ['name', 'description', 'category'],
            includeScore: true,
            threshold: 0.4,
        };
        return new Fuse(youtubers, options);
    }, []);

    const filteredYoutubers = selectedCategory
        ? getYoutubersByCategory(selectedCategory)
        : youtubers;

    const searchFilteredYoutubers = useMemo(() => {
        if (!searchTerm) {
            return filteredYoutubers;
        }

        if (selectedCategory) {
            const categoryFuse = new Fuse(filteredYoutubers, {
                keys: ['name', 'description', 'category'],
                includeScore: true,
                threshold: 0.4,
            });
            return categoryFuse.search(searchTerm).map(result => result.item);
        }

        return fuse.search(searchTerm).map(result => result.item);
    }, [searchTerm, filteredYoutubers, fuse, selectedCategory]);

    const YouTuberCard = ({ youtuber }: { youtuber: YouTuber }) => (
        <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="relative">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="p-6 relative z-10">
                    <div className="flex items-start space-x-4">
                        <div className="relative">
                            <img
                                src={youtuber.avatarUrl}
                                alt={`${youtuber.name} avatar`}
                                className="w-20 h-20 rounded-2xl flex-shrink-0 border-4 border-white dark:border-gray-700 shadow-lg group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    // Use correct public path for default avatar
                                    e.currentTarget.src = '/pubhub.png';
                                }}
                            />
                            {/* Online indicator */}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white dark:border-gray-800 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                    {youtuber.name}
                                </h3>
                                <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full font-medium shadow-sm">
                                    {youtuber.category.split(' ')[0]}
                                </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                {youtuber.description}
                            </p>
                            
                            <div className="mb-5">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21 16V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM10.5 8.67L8.25 7.5v2.34l2.25-1.17zm7.5 3.83H16l-1.5-1.5L16 9.5h2v2.5z"/>
                                    </svg>
                                    Featured Playlists
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {youtuber.playlists.slice(0, 3).map((playlist, index) => (
                                        <a
                                            key={index}
                                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(youtuber.name + ' ' + playlist)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            {playlist}
                                        </a>
                                    ))}
                                    {youtuber.playlists.length > 3 && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-1 rounded-full border border-dashed border-gray-300 dark:border-gray-600">
                                            +{youtuber.playlists.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <a
                                href={youtuber.channelUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                            >
                                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                                Visit Channel
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 text-white">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                            Awesome YouTubers
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
                            Discover amazing YouTube channels that teach technology, programming, and more. 
                            Learn from the best content creators in the tech community.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                                <div className="text-2xl font-bold">{youtubers.length}+</div>
                                <div className="text-sm text-white/80">YouTubers</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                                <div className="text-2xl font-bold">{categories.length}+</div>
                                <div className="text-sm text-white/80">Categories</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                                <div className="text-2xl font-bold">{youtubers.reduce((acc, yt) => acc + yt.playlists.length, 0)}+</div>
                                <div className="text-sm text-white/80">Playlists</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search and Filter Section */}
                <div className="mb-12">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Search Bar */}
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search YouTubers, categories, or descriptions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg transition-all duration-200"
                                    />
                                </div>
                            </div>
                            
                            {/* Category Dropdown */}
                            <div className="lg:w-80">
                                <select
                                    value={selectedCategory || ''}
                                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                                    className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-lg transition-all duration-200"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* View Mode Toggle */}
                            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                        viewMode === 'grid'
                                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-md'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                        viewMode === 'list'
                                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-md'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Category Tags */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                                        selectedCategory === null
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
                                    }`}
                                >
                                    All ({youtubers.length})
                                </button>
                                {categories.map((category) => {
                                    const count = getYoutubersByCategory(category).length;
                                    return (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                                                selectedCategory === category
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
                                            }`}
                                        >
                                            {category} ({count})
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Counter */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Showing <span className="font-semibold text-gray-900 dark:text-white">{searchFilteredYoutubers.length}</span> of <span className="font-semibold text-gray-900 dark:text-white">{youtubers.length}</span> YouTubers
                            {selectedCategory && <span className="text-blue-600 dark:text-blue-400"> in {selectedCategory}</span>}
                            {searchTerm && <span className="text-purple-600 dark:text-purple-400"> matching "{searchTerm}"</span>}
                        </p>
                    </div>
                </div>

                {/* YouTubers Grid */}
                {searchFilteredYoutubers.length > 0 ? (
                    <div className={`grid gap-8 ${
                        viewMode === 'grid' 
                            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                            : 'grid-cols-1 max-w-4xl mx-auto'
                    }`}>
                        {searchFilteredYoutubers.map((youtuber, index) => (
                            <div
                                key={index}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <YouTuberCard youtuber={youtuber} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                No YouTubers Found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                We couldn't find any YouTubers matching your search criteria. Try adjusting your search term or category filter.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Clear Search
                                </button>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}