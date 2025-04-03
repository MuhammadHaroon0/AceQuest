import React, { useEffect, useState } from "react";
import StudentCard from "./StudentCard";
import axiosInstance from "../../../../utils/axiosInstance";
import apiRoutes from "../../../../utils/apiRoutes";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import Spinner from "../../../common/Spinner";
interface Student {
    _id: string;
    email: string;
    image: string;
    name: string;
    subscription: string;
    jobDescriptions: string[]

}
const Students: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const getStudents = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.get(apiRoutes.getAllStudents)
            setStudents(response.data.data)
            console.log(response.data);

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
        getStudents()
    }, [])




    const handleDeleteStudent = async (id: string) => {
        setLoading(true)
        try {
            const response = await axiosInstance.delete(apiRoutes.deleteUser(id))
            enqueueSnackbar(response.data.message)
            await getStudents()
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
            <h1 className="text-2xl font-semibold text-richblack-900 mb-6">Students</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {students.map((student) => (
                    <StudentCard
                        key={student._id}
                        id={student._id}
                        name={student.name}
                        email={student.email}
                        photoUrl={student.image}
                        noOfJobDescriptions={student.jobDescriptions.length}
                        subscription={student.subscription}
                        onDelete={handleDeleteStudent}
                    />
                ))}
            </div>
        </div>
    );
};

export default Students;