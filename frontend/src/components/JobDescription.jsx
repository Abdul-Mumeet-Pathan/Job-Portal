import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { setSingleJob } from '@/redux/jobSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, User, Calendar } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import JobApplicationForm from './JobApplicationForm'

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job)
    const { user } = useSelector(store => store.auth)
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false
    const [isApplied, setIsApplied] = useState(isIntiallyApplied)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const navigate = useNavigate()

    const params = useParams()
    const jobId = params.id
    const dispatch = useDispatch()

    const handleApplicationSuccess = () => {
        setIsApplied(true)
        const updatedSingleJob = {
            ...singleJob, 
            applications: [...singleJob.applications, { applicant: user?._id }]
        }
        dispatch(setSingleJob(updatedSingleJob))
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true })
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job))
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchSingleJob()
    }, [jobId, dispatch, user?._id])

    const formatRequirements = (requirements) => {
        if (!requirements) return null
        if (typeof requirements === 'string') {
            const reqs = requirements.includes('\n')
                ? requirements.split('\n')
                : requirements.split(',')
            return reqs.map((req, i) => (
                <li key={i} className="mb-2">{req.trim()}</li>
            ))
        }
        return null
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <div className="flex-1 bg-white">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 mb-6"
                    >
                        <ArrowLeft size={18} />
                        Back to Jobs
                    </Button>

                    {/* Main Job Card with gradient background */}
                    <div className='bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg overflow-hidden border border-gray-200'>
                        {/* Job Header */}
                        <div className='p-6 border-b border-gray-100'>
                            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                <div className='flex items-start gap-4'>
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={singleJob?.company?.logo} />
                                    </Avatar>
                                    <div>
                                        <h1 className='font-bold text-2xl text-gray-900'>{singleJob?.title}</h1>
                                        <p className='text-lg text-gray-600'>{singleJob?.company?.name}</p>
                                        <div className='flex flex-wrap gap-2 mt-3'>
                                            <Badge variant="outline" className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                {singleJob?.location}
                                            </Badge>
                                            <Badge variant="outline" className="flex items-center gap-1">
                                                <Briefcase className="h-4 w-4" />
                                                {singleJob?.jobType}
                                            </Badge>
                                            <Badge variant="outline" className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                Posted {singleJob?.createdAt?.split("T")[0]}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={isApplied ? null : () => setIsFormOpen(true)}
                                    disabled={isApplied}
                                    className={`h-12 text-lg ${isApplied ?
                                        'bg-gray-600 cursor-not-allowed' :
                                        'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'}`}
                                >
                                    {isApplied ? 'Already Applied' : 'Apply Now'}
                                </Button>
                            </div>
                        </div>

                        {/* Job Details */}
                        <div className='grid md:grid-cols-3 gap-8 p-6'>
                            {/* Main Description */}
                            <div className='md:col-span-2 space-y-6'>
                                <section>
                                    <h2 className='text-xl font-semibold mb-4 text-gray-800 border-b pb-2'>Job Description</h2>
                                    <div className='prose max-w-none text-gray-600'>
                                        {singleJob?.description?.split('\n').map((para, i) => (
                                            <p key={i} className='mb-4'>{para}</p>
                                        ))}
                                    </div>
                                </section>

                                {/* Requirements Section */}
                                {singleJob?.requirements && (
                                    <section>
                                        <h2 className='text-xl font-semibold mb-4 text-gray-800 border-b pb-2'>Requirements</h2>
                                        <ul className='list-disc pl-5 space-y-2 text-gray-600'>
                                            {formatRequirements(singleJob.requirements)}
                                        </ul>
                                    </section>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className='space-y-6'>
                                <div className='bg-white rounded-lg p-5 border border-gray-200 shadow-sm'>
                                    <h3 className='font-medium mb-4 text-gray-800 text-lg'>Job Overview</h3>
                                    <div className='space-y-4'>
                                        <div className='flex items-center gap-3'>
                                            <DollarSign className='h-5 w-5 text-blue-500' />
                                            <div>
                                                <p className='text-sm text-gray-500'>Salary</p>
                                                <p className='font-medium'>{singleJob?.salary}BDT</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <Briefcase className='h-5 w-5 text-blue-500' />
                                            <div>
                                                <p className='text-sm text-gray-500'>Job Type</p>
                                                <p className='font-medium'>{singleJob?.jobType}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <User className='h-5 w-5 text-blue-500' />
                                            <div>
                                                <p className='text-sm text-gray-500'>Experience</p>
                                                <p className='font-medium'>{singleJob?.experience} yrs</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <Calendar className='h-5 w-5 text-blue-500' />
                                            <div>
                                                <p className='text-sm text-gray-500'>Posted Date</p>
                                                <p className='font-medium'>{singleJob?.createdAt?.split("T")[0]}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <User className='h-5 w-5 text-blue-500' />
                                            <div>
                                                <p className='text-sm text-gray-500'>Applicants</p>
                                                <p className='font-medium'>{singleJob?.applications?.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Info */}
                                {singleJob?.company?.about && (
                                    <div className='bg-white border border-gray-200 rounded-lg p-5'>
                                        <h3 className='font-medium mb-3 text-gray-800'>About {singleJob?.company?.name}</h3>
                                        <p className='text-sm text-gray-600'>{singleJob?.company?.about}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Form Dialog */}
            <JobApplicationForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                jobId={jobId}
                onSuccess={handleApplicationSuccess}
            />

            <Footer />
        </div>
    )
}

export default JobDescription