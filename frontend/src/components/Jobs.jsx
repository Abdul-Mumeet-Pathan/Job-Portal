import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Footer from './shared/Footer';
import { setFilteredJobs } from '@/redux/jobSlice';

const Jobs = () => {
    const { allJobs, filters, searchedQuery } = useSelector(store => store.job);
    const dispatch = useDispatch();

    // Function to filter jobs based on selected filters
    const filterJobList = () => {
        let filtered = [...allJobs]; // Create a copy of allJobs

        // Filter by location
        if (filters.locations.length > 0) {
            filtered = filtered.filter(job =>
                filters.locations.includes(job.location)
            );
        }

        // Filter by industry - make sure job.industry exists and matches
        // In your filterJobList function in Jobs.jsx, replace the industry filter section with this:
if (filters.industries.length > 0) {
    filtered = filtered.filter(job => {
        // Check if job has industry property and matches any selected industries
        return job.industry && filters.industries.some(selectedIndustry => 
            job.industry.toLowerCase().includes(selectedIndustry.toLowerCase())
        );
    });
}

        // Filter by salary range - ensure job.salary exists and is a number
        if (filters.salaryRange) {
            filtered = filtered.filter(job => {
                const jobSalary = Number(job.salary);
                return !isNaN(jobSalary) && 
                       jobSalary >= filters.salaryRange.min && 
                       jobSalary <= filters.salaryRange.max;
            });
        }

        // Filter by search query
        if (searchedQuery) {
            const query = searchedQuery.toLowerCase();
            filtered = filtered.filter(job => {
                return (
                    (job.title && job.title.toLowerCase().includes(query)) ||
                    (job.description && job.description.toLowerCase().includes(query)) ||
                    (job.location && job.location.toLowerCase().includes(query))
                );
            });
        }

        // Update filtered jobs in Redux
        dispatch(setFilteredJobs(filtered));
    };

    useEffect(() => {
        filterJobList();
    }, [filters, searchedQuery, allJobs]);

    // Get filteredJobs from Redux store
    const { filteredJobs } = useSelector(store => store.job);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto mt-5 w-full px-4">
                <div className="flex gap-5">
                    <div className="w-64 flex-shrink-0">
                        <FilterCard />
                    </div>

                    {filteredJobs.length <= 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                            <span className="text-gray-500">No jobs found</span>
                        </div>
                    ) : (
                        <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
                            <div className="grid grid-cols-2 gap-4">
                                {filteredJobs.map((job) => (
                                    <motion.div
                                        key={job?._id}
                                        className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow"
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Jobs;