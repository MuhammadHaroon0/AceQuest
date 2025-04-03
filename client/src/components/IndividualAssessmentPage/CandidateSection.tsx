import React, { useEffect, useState } from 'react'
import InviteCandidates from './InviteCandidates'
import AllCandidates from './AllCandidates'
import axiosInstance from '../../utils/axiosInstance';
import apiRoutes from '../../utils/apiRoutes';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
interface CandidateSectionProps {
    assessmentId?: string;
}
interface Candidate {
    _id: string;
    email: string;
    name: string;
    performance?: string;
    createdAt: string;
}
const CandidateSection: React.FC<CandidateSectionProps> = React.memo(({ assessmentId }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [candidates, setCandidates] = useState<Candidate[]>([]);


    const fetchCandidates = async () => {
        if (!assessmentId)
            return
        setLoading(true);
        try {
            const response = await axiosInstance.get(apiRoutes.getCandidatesBasedOnJobDescription(assessmentId));
            setCandidates(response.data.data);


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
        fetchCandidates()
    }, [assessmentId])

    return (
        <div>

            <InviteCandidates assessmentId={assessmentId} refreshCandidates={fetchCandidates} />
            <AllCandidates candidates={candidates} loading={loading} />
        </div>
    )
}
)
export default CandidateSection
