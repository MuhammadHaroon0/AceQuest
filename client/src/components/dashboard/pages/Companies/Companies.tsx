import React, { useEffect, useState } from "react";
import CompanyCard from "./CompanyCard";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../../utils/axiosInstance";
import apiRoutes from "../../../../utils/apiRoutes";
import Spinner from "../../../common/Spinner";
import axios from "axios";
interface User {
    _id: string;
    email: string;
    image: string;
    name: string;
    jobDescriptions: string;
}
interface Company {
    _id: string;
    name: string;
    userId: User
    website: string;
    candidates: string[]
}
const Companies: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const getCompanies = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.get(apiRoutes.getAllCompanies)
            setCompanies(response.data.data)

        } catch (error) {
            if (axios.isAxiosError(error)) {
                enqueueSnackbar(error.response?.data?.message || 'An error occurred');
            } else {
                enqueueSnackbar('An unexpected error occurred');
            }
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getCompanies()
    }, [])


    const handleDeleteCompany = async (id: string) => {
        setLoading(true)
        try {
            const response = await axiosInstance.delete(apiRoutes.deleteUser(id))
            enqueueSnackbar(response.data.message)
            await getCompanies()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                enqueueSnackbar(error.response?.data?.message || 'An error occurred');
            } else {
                enqueueSnackbar('An unexpected error occurred');
            }
        }
        finally {
            setLoading(false)
        }
    };


    if (loading)
        return <div className="h-full"><Spinner /></div>

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold text-richblack-900 mb-6">Companies</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {companies.map((company) => (
                    <CompanyCard
                        key={company.userId._id}
                        id={company.userId._id}
                        email={company.userId.email}
                        username={company.userId.name}
                        logo={company.userId.image}
                        name={company.name}
                        website={company.website}
                        noOfJobDescriptions={company.userId.jobDescriptions.length}
                        onDelete={handleDeleteCompany}
                        noOfCandidatesInvited={company.candidates.length}
                    />
                ))}
            </div>
        </div>
    );
};

export default Companies;