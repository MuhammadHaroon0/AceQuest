import React, { useState } from 'react';
import Button from '../Button';
import axiosInstance from '../../utils/axiosInstance';
import apiRoutes from '../../utils/apiRoutes';
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';

interface InviteCandidatesProps {
    assessmentId?: string;
    refreshCandidates: () => void;
}

const InviteCandidates: React.FC<InviteCandidatesProps> = ({ assessmentId, refreshCandidates }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        countryCode: '+92',
        phoneNumber: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.name || !formData.phoneNumber) {
            enqueueSnackbar('Please fill out all required fields');
            return;
        }

        const requestData = {
            candidateEmail: formData.email,
            candidateName: formData.name,
            phoneNumber: `${formData.countryCode}${formData.phoneNumber}`,
            jobDescription: assessmentId, // Pass assessmentId if available
        };

        setLoading(true);
        try {
            await axiosInstance.patch(apiRoutes.addCandidateToJob, requestData);
            enqueueSnackbar('Candidate added successfully!');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                enqueueSnackbar(error.response?.data?.message || 'An error occurred');
            } else {
                enqueueSnackbar('An unexpected error occurred');
            }
        } finally {
            refreshCandidates()
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-lg font-semibold mb-4">Invite Candidates</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address *"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            name="name"
                            placeholder="Name *"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleInputChange}
                            className="bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="+92">+92</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                            {/* Add other country codes */}
                        </select>
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone number *"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button type="secondary" disabled={loading} onClickBtn={(e) => handleFormSubmit(e)}>
                            {loading ? 'Adding...' : 'Add'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteCandidates;
