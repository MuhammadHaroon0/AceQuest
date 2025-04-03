import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import ActivityTab from "./ActivityTab";
import useAuthStore from "../../../../stores/useAuthStore";
import axiosInstance from "../../../../utils/axiosInstance";
import apiRoutes from "../../../../utils/apiRoutes";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import Spinner from "../../../common/Spinner";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


interface Profile {
    id: string;
    name: string;
    email: string;
    image: string;
    accountType: string;
    jobDescriptions?: string[];
    subscription?: string;
    createdAt?: string;
}

const Profile: React.FC = () => {
    const { user } = useAuthStore()

    const [name, setName] = useState(user?.name);

    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");

    const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
    const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
    const [profile, setProfile] = useState<Profile>();
    const [passwordError, setPasswordError] = useState('');

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const fetchProfile = async () => {
        if (!user?.id)
            return
        setLoading(true);
        try {
            const response = await axiosInstance.get(apiRoutes.getUser(user.id));
            setProfile(response.data.data);
            setName(response.data.data.name)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                enqueueSnackbar(error.response?.data?.message || 'An error occurred');
            } else {
                enqueueSnackbar('An unexpected error occurred fetching candidates');
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProfile()
    }, [user?.id])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            if (!file.type.startsWith("image/")) {
                enqueueSnackbar("Invalid file. Please upload an image.");
                return;
            }

            handleProfileSave(file);
        } else {
            enqueueSnackbar("No file selected.");
        }
    };

    const handleProfileSave = async (file?: File) => {
        if (!name || name.trim() === '') {
            enqueueSnackbar("Please enter a valid user name");
            return;
        }
        const formdata = new FormData()
        setLoading(true)
        if (file)
            formdata.append('image', file)
        formdata.append("name", name)

        try {
            const res = await axiosInstance.patch(apiRoutes.updateMe, formdata, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            });

            setIsEditingProfile(false);
            await fetchProfile()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                enqueueSnackbar(error.response?.data?.message || 'An error occurred');
            } else {
                enqueueSnackbar('An unexpected error occurred updating password');
            }
        } finally {
            setLoading(false);
        }
    };


    const validatePassword = (password: string) => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
        return regex.test(password);
    };

    const handlePasswordSave = async () => {
        if (!validatePassword(newPassword)) {
            setPasswordError('New password must contain at least one letter, one number, and one special character, and be at least 7 characters long.');
            return;
        } else {
            setPasswordError('');  // Clear error if password is valid
        }
        setLoading(true)
        try {
            await axiosInstance.patch(apiRoutes.updatePassword, { oldPassword: oldPassword, newPassword: newPassword });
            enqueueSnackbar("Password Changed")
            setIsEditingPassword(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                enqueueSnackbar(error.response?.data?.message || 'An error occurred');
            } else {
                enqueueSnackbar('An unexpected error occurred updating password');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (<div className="h-full"><Spinner /></div>)

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

            {/* Profile Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
                <div className="flex flex-col items-center space-y-4">
                    <div
                        className={
                            "md:w-36 md:h-36 lg:mb-0 w-24 h-24 rounded-full bg-blue-500 shadow-xl overflow-hidden relative group border-white border-3"
                        }
                    >
                        <img
                            src={profile?.image}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className={
                                "group-hover:opacity-100 opacity-0 transition-opacity bg-black/70 text-white absolute inset-0 flex items-center justify-center gap-x-2 font-bold text-sm"
                            }
                            disabled={loading}
                        >
                            <MdOutlineAddAPhoto size={28} /> Change
                        </button>
                        <input
                            ref={fileInputRef}
                            type='file'
                            accept='image/*'
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                    </div>
                    {isEditingProfile ? (
                        <>
                            <div className="w-full">
                                <label className="block text-lg font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-gray-300 text-gray-700 rounded-md p-2"
                                />
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleProfileSave()}
                                    className="px-4 py-2 mt-2 bg-primary text-white rounded-md hover:bg-primary/80"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setIsEditingProfile(false)}
                                    className="px-4 py-2 mt-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-gray-900">{profile?.name}</h2>
                                <p className="text-sm text-gray-500">{profile?.email}</p>
                            </div>
                            <button
                                onClick={() => setIsEditingProfile(true)}
                                className="px-4 py-2 mt-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                Edit Profile
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Update Password Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Password</h2>
                {isEditingPassword ? (
                    <div className="space-y-4">
                        <div className="relative">
                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                Old Password
                            </label>
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full border border-gray-300 text-gray-700 rounded-md p-2"
                            />
                            <span
                                onClick={() => setShowOldPassword((prev) => !prev)}
                                className="absolute right-3 top-[40px] z-[10] cursor-pointer"
                            >
                                {showOldPassword ? (
                                    <AiOutlineEyeInvisible fontSize={24} fill="#000" />
                                ) : (
                                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                                )}
                            </span>
                        </div>
                        <div className=" relative">
                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                value={newPassword}
                                type={showNewPassword ? 'text' : 'password'}

                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border border-gray-300 text-gray-700 rounded-md p-2"
                            />
                            <span
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                className="absolute right-3 top-[40px] z-[10] cursor-pointer"
                            >
                                {showNewPassword ? (
                                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                                ) : (
                                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                                )}
                            </span>
                        </div>
                        {passwordError && (
                            <p className="mt-1 text-xs text-red-500">{passwordError}</p>
                        )}
                        <div className="flex space-x-4">
                            <button
                                onClick={handlePasswordSave}
                                className="px-4 py-2 mt-2 bg-primary text-white rounded-md hover:bg-primary/80"
                            >
                                Save Password
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditingPassword(false);
                                    setOldPassword("");
                                    setNewPassword("");
                                }}
                                className="px-4 py-2 mt-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditingPassword(true)}
                        className="px-4 py-2 mt-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Change Password
                    </button>
                )}
            </div>

            {/* Activity Tab Section */}
            {
                profile && (
                    <ActivityTab
                        accountType={profile.accountType}
                        jobDescriptions={profile.jobDescriptions}
                        subscription={profile.subscription}
                        createdAt={profile.createdAt}
                    />
                )
            }
        </div >
    );

};

export default Profile;