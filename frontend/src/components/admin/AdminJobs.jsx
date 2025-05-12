import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer' // Added Footer import
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { Briefcase, Plus, Search, Edit2, Eye, MapPin, DollarSign, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allAdminJobs = [], searchJobByText } = useSelector(store => store.job);

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  const filteredJobs = allAdminJobs.filter(job => {
    if (!searchJobByText) return true;
    return (
      job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
      job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex flex-col">
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-grow">
        <div className='max-w-6xl mx-auto my-10'>
          <div className='flex items-center justify-between my-5'>
            <Input
              className="w-fit"
              placeholder="Filter by name, role"
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={() => navigate("/admin/jobs/create")}>
              <Plus className="h-4 w-4 mr-2" />
              New Jobs
            </Button>
          </div>

          {/* Flash Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard 
                  key={job._id}
                  job={job}
                  navigate={navigate}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-white rounded-xl shadow-md">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  {searchJobByText ? 'No matching jobs found' : 'No jobs available'}
                </h3>
                <p className="text-gray-500 mt-1">
                  {searchJobByText ? 'Try a different search' : 'Create your first job'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

const JobCard = ({ job, navigate }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all p-6"
  >
    {/* Company Info with Avatar */}
    <div className="flex items-center gap-3 mb-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={job?.company?.logo} />
        <AvatarFallback className="bg-blue-100 text-blue-600">
          {job?.company?.name?.charAt(0)?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="font-medium text-gray-800">{job?.company?.name}</h2>
        <p className="text-sm text-gray-500">{job?.location}</p>
      </div>
    </div>

    {/* Job Title - Large and prominent */}
    <h1 className="font-bold text-xl text-gray-800 mb-3">
      {job?.title}
    </h1>

    {/* Job Details Grid */}
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">{job?.location || 'Not specified'}</span>
      </div>
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">
          {job?.salary ? `BDT ${job.salary}` : 'Not specified'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">{job?.jobType || 'Not specified'}</span>
      </div>
      <div className="flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">
          {job?.createdAt.split("T")[0]}
        </span>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline"
        onClick={() => navigate(`/admin/jobs/update/${job._id}`)}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
      >
        <Edit2 className="h-4 w-4" />
        Edit
      </Button>
      <Button 
        variant="outline"
        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
        className="text-blue-600 border-blue-600 hover:bg-blue-50 flex items-center gap-2"
      >
        <Eye className="h-4 w-4" />
        Applicants
      </Button>
    </div>
  </motion.div>
)

export default AdminJobs