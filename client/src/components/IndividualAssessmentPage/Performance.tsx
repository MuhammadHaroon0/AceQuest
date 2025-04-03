import BarCard from "../common/BarCard";
import PieCard from "../common/PieCard";
import TextCard from "../common/TextCard";

interface PerformanceProps {
  quizScore: number;
  interviewScore: number;
  confidenceScore: number;
  quizCorrectAnswers: number;

}
const Performance: React.FC<PerformanceProps> = ({ quizScore, interviewScore, confidenceScore, quizCorrectAnswers }) => {

  const totalQuizQuestions = quizScore > 0 ? Math.round((quizCorrectAnswers * 100) / quizScore) : 0;
  const wrongAnswers = totalQuizQuestions - quizCorrectAnswers;

  const quizData = [
    { name: "Correct Answers", value: quizCorrectAnswers },
    { name: "Wrong Answers", value: wrongAnswers },
  ];
  const overallScore = [
    { name: "Quiz", value: Math.round(quizScore) },
    { name: "Interview", value: (interviewScore + confidenceScore) / 2 },
  ];
  const interviewData = [
    { name: "Confidence Score", value: confidenceScore },
    { name: "Correct Answer Rate", value: interviewScore },
  ];






  return (
    <div className="flex flex-col space-y-6 h-full">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center w-full">
        <div className="md:col-span-2">

          <TextCard heading="Assessments" description="Below are the Assessment Reports" />
        </div>
        <div className="md:col-span-5">

          <TextCard heading="Most Recent Performance" description="Use below metrics to judge performance." badgeContent="optimal" />
        </div>
      </div>


      <GraphsComponent title="Assessment Report"
        components={[
          { Component: BarCard, props: { title: "Overall Score", data: overallScore } },
          { Component: BarCard, props: { title: "Interview insights", data: interviewData } },
          { Component: PieCard, props: { title: "Quiz Correction Rate", data: quizData } },
        ]}
      />


    </div>
  );
}


interface GraphComponentProps {
  // title: string;
  Component: React.FC<any>;
  props: any;
}

interface GraphsComponentProps {
  title: string;
  components: GraphComponentProps[];
}

const GraphsComponent: React.FC<GraphsComponentProps> = ({ title, components }) => {


  return (
    <div className="p-3 bg-white flex flex-col rounded-md gap-3 text-black">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">{title}</h1>

      </div>

      {/* Grid Layout for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center w-full">
        {components.map(({ Component, props }, index) => (
          <div key={index} className="w-full">
            <Component {...props} /> {/* Render the component with its props */}
          </div>
        ))}
      </div>
    </div>
  );
};



export default Performance;
