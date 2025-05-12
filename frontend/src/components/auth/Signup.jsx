import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });

    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
            <Navbar />
            <div className='flex items-center justify-center py-10'>
                <form onSubmit={submitHandler} className='w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-10 transform transition duration-500 hover:scale-[1.01] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]'>
                    <h1 className='font-bold text-3xl mb-6 text-center text-indigo-700'>Sign Up</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                        <div>
                            <Label>Full Name</Label>
                            <Input type="text" value={input.fullname} name="fullname" onChange={changeEventHandler} placeholder="Your full name" className="mt-1 p-3 rounded-xl border border-gray-300 shadow-inner" />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input type="email" value={input.email} name="email" onChange={changeEventHandler} placeholder="you@example.com" className="mt-1 p-3 rounded-xl border border-gray-300 shadow-inner" />
                        </div>
                        <div>
                            <Label>Phone Number</Label>
                            <Input type="text" value={input.phoneNumber} name="phoneNumber" onChange={changeEventHandler} placeholder="01XXXXXXXXX" className="mt-1 p-3 rounded-xl border border-gray-300 shadow-inner" />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input type="password" value={input.password} name="password" onChange={changeEventHandler} placeholder="Your password" className="mt-1 p-3 rounded-xl border border-gray-300 shadow-inner" />
                        </div>
                    </div>
                    <div className='flex justify-between items-center mt-6 flex-wrap gap-4'>
                        <RadioGroup className="flex gap-6">
                            <div className="flex items-center space-x-2">
                                <Input type="radio" name="role" value="student" checked={input.role === 'student'} onChange={changeEventHandler} className="cursor-pointer" />
                                <Label>Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input type="radio" name="role" value="recruiter" checked={input.role === 'recruiter'} onChange={changeEventHandler} className="cursor-pointer" />
                                <Label>Recruiter</Label>
                            </div>
                        </RadioGroup>
                        <div className='flex items-center gap-2'>
                            <Label>Profile</Label>
                            <Input accept="image/*" type="file" onChange={changeFileHandler} className="cursor-pointer" />
                        </div>
                    </div>
                    {
                        loading
                            ? <Button className="w-full mt-8 py-3 rounded-xl bg-indigo-600 text-white flex justify-center items-center"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button>
                            : <Button type="submit" className="w-full mt-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg">Signup</Button>
                    }
                    <p className='text-sm text-center mt-4'>Already have an account? <Link to="/login" className='text-blue-600 hover:underline'>Login</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Signup;
