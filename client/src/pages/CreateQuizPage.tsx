import React from 'react';
import JobForm from '../components/JobForm';
import FadeIn from '../components/common/FadeIn';

const CreateQuizPage: React.FC = () => {
  return (
    <div className="py-8 flex items-center justify-center">
      <div className="w-full max-w-3xl p-8 shadow-lg rounded-lg">
        <FadeIn duration={200} >
          <h1 className='text-4xl font-semibold text-primary text-center'>Create assessments</h1>
        </FadeIn>
        <div className="mt-8">
          <JobForm />
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;
