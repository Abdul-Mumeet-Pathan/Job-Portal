import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex flex-col">
            <Navbar />
            
            {/* Main content container with padding bottom */}
            <div className="flex-grow pb-10">
                {/* Profile card */}
                <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl mt-5 mb-6 p-8'>
                    <div className='flex justify-between'>
                        <div className='flex items-center gap-4'>
                            <Avatar className="h-24 w-24">
                                <AvatarImage 
                                    src={user?.profile?.profilePhoto} alt="avatar" />
                            </Avatar>
                            <div>
                                <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                                <p>{user?.profile?.bio}</p>
                            </div>
                        </div>
                        <Button 
                            onClick={() => setOpen(true)} 
                            className="text-right bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                            <Pen className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className='my-5'>
                        <div className='flex items-center gap-3 my-2'>
                            <Mail />
                            <span>{user?.email}</span>
                        </div>
                        <div className='flex items-center gap-3 my-2'>
                            <Contact />
                            <span>{user?.phoneNumber}</span>
                        </div>
                    </div>
                    <div className='my-5'>
                        <h1 className="font-medium">Skills</h1>
                        <div className='flex items-center gap-1 mt-2'>
                            {
                                user?.profile?.skills?.length > 0 ? 
                                user.profile.skills.map((item, index) => (
                                    <Badge key={index}>{item}</Badge>
                                )) : 
                                <span className="text-gray-500">No skills added</span>
                            }
                        </div>
                    </div>
                    <div className='grid w-full max-w-sm items-center gap-1.5'>
                        <Label className="text-md font-bold">Resume</Label>
                        {
                            isResume ? (
                                <a 
                                    target='_blank' 
                                    rel='noopener noreferrer' 
                                    href={user?.profile?.resume} 
                                    className='text-blue-500 w-full hover:underline cursor-pointer'
                                >
                                    {user?.profile?.resumeOriginalName}
                                </a>
                            ) : (
                                <span className="text-gray-500">No resume uploaded</span>
                            )
                        }
                    </div>
                </div>

                {/* Applied Jobs section with scrollable container */}
                <div className='max-w-4xl mx-auto bg-white rounded-2xl mb-10'>
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Your Job Applications</h2>
                        <div className="max-h-[500px] overflow-y-auto pr-2">
                            <AppliedJobTable />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer positioned at bottom */}
            <Footer />
            
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile