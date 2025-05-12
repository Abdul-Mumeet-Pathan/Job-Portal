import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Building2, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, {companyName}, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res?.data?.success){
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex flex-col">
            <Navbar />
            
            {/* Main Content */}
            <div className="flex-grow">
                <div className='flex items-center justify-center py-10'>
                    <div className='w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-10 transform transition duration-500 hover:scale-[1.01] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]'>
                        {/* Header Section */}
                        <div className="flex items-center gap-4 mb-8">
                            <Button 
                                onClick={() => navigate("/admin/companies")} 
                                variant="outline" 
                                size="icon"
                                className="rounded-full"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <h1 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
                                <Building2 className="h-6 w-6" />
                                Create New Company
                            </h1>
                        </div>

                        {/* Form Content */}
                        <div className="space-y-6">
                            <div className="mb-6">
                                <h2 className="text-lg font-medium text-gray-800 mb-1">
                                    Your Company Name
                                </h2>
                                <p className="text-gray-500">
                                    What would you like to name your company? You can change this later.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-gray-700">
                                    <Building2 className="h-4 w-4" />
                                    Company Name
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="JobHunt, Microsoft etc."
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="bg-white border-gray-300 focus:border-blue-500 p-3 rounded-xl"
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-6">
                                <Button 
                                    variant="outline" 
                                    onClick={() => navigate("/admin/companies")}
                                    className="px-6 py-3 rounded-xl border-gray-300 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={registerNewCompany}
                                    disabled={!companyName}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    )
}

export default CompanyCreate