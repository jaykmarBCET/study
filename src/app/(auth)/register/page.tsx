'use client'
import React, { useEffect } from 'react'
import { useAuthStore } from '../../store/AuthStore';
import { useRouter } from 'next/navigation';

function RegisterPage() {

    const {register,user,currentUser} = useAuthStore()
    const router = useRouter()
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = String(formData.get("name") )
        const email = String(formData.get("email") )
        const password = String(formData.get("password"))
        
        await register({name,email,password})
    };
    if(user){
        router.push("/dashboard")
    }
    useEffect(()=>{
        currentUser()
    },[])

    return (
        <div className="min-h-screen  flex items-center justify-center bg-gray-900">
            <div className=" transition-all duration-300 border hover:scale-105 border-gray-700 text-white p-8 rounded-xl shadow-lg w-96">
                <h1 className="text-center py-3 font-bold text-xl rounded-lg">
                    Register Page
                </h1>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input type="text" name="name" placeholder="Enter name"
                            className="w-full  mt-1 px-4 py-2 rounded-lg   border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" name="email" placeholder="Enter email"
                            className="w-full outline-0 mt-1 px-4 py-2 rounded-lg  border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input type="password" name="password" placeholder="Enter password"
                            className="w-full mt-1 px-4 py-2 rounded-lg  border outline-0 border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            required />
                    </div>
                    <button type="submit"
                        className="w-full border border-gray-700  text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition-all duration-300">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
