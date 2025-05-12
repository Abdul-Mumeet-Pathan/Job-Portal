import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Search, X, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const location = useLocation();
    const [searchInput, setSearchInput] = useState('');
    const [filteredJobs, setFilteredJobs] = useState(allJobs);

    // Initialize search from URL or Redux
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('q') || '';
        setSearchInput(query);
        dispatch(setSearchedQuery(query));
    }, [location.search, dispatch]);

    // Filter jobs based on search input
    useEffect(() => {
        if (!searchInput.trim()) {
            setFilteredJobs(allJobs);
            return;
        }

        const query = searchInput.toLowerCase();
        const results = allJobs.filter(job => {
            const title = job.title?.toLowerCase() || '';
            const company = job.company?.name?.toLowerCase() || '';
            const position = job.position?.toString().toLowerCase() || '';
            const jobType = job.jobType?.toLowerCase() || '';

            return (
                title.includes(query) ||
                company.includes(query) ||
                position.includes(query) ||
                jobType.includes(query)
            );
        });
        setFilteredJobs(results);
    }, [searchInput, allJobs]);

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(setSearchedQuery(searchInput));
    };

    const clearSearch = () => {
        setSearchInput('');
        dispatch(setSearchedQuery(''));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
            <Navbar />
            
            {/* Search Section */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg p-8 mb-10 border border-gray-100"
                >
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Perfect Job</span>
                    </h1>
                    <p className="text-gray-500 mb-6">
                        Search through thousands of job listings to find your ideal position
                    </p>

                    <form onSubmit={handleSearch} className="relative">
                        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="pl-4 pr-2">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search by job title, company, or position..."
                                className="w-full py-4 px-2 outline-none text-gray-700 placeholder-gray-400 text-lg"
                            />
                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="p-2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                            <button
                                type="submit"
                                className="h-full px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium text-lg"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Popular Filters */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        {['Developer', 'Designer', 'Remote', 'Marketing', 'Engineer'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => {
                                    setSearchInput(tag);
                                    dispatch(setSearchedQuery(tag));
                                }}
                                className="px-4 py-2 bg-white hover:bg-gray-50 rounded-lg transition-all flex items-center gap-1 shadow-sm border border-gray-100 hover:border-purple-200 group"
                            >
                                <span>{tag}</span>
                                <Search className="h-4 w-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Results Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {searchInput ? `Results for "${searchInput}"` : 'All Job Listings'}
                            <span className="ml-2 text-lg text-purple-600">({filteredJobs.length})</span>
                        </h2>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-purple-600">
                            <Filter className="h-5 w-5" />
                            <span>Filters</span>
                        </button>
                    </div>

                    {filteredJobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredJobs.map((job) => (
                                <motion.div
                                    key={job._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Job job={job} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-700 mb-2">
                                No jobs found
                            </h3>
                            <p className="text-gray-500">
                                {searchInput
                                    ? `Try a different search term or browse all jobs`
                                    : 'There are currently no job listings available'}
                            </p>
                            {searchInput && (
                                <button
                                    onClick={clearSearch}
                                    className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                                >
                                    Show All Jobs
                                </button>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default Browse;