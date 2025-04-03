import TextCard from "../../../common/TextCard";
import UseCasesCard from "../../../common/UseCasesCard";
import PieCard from "../../../common/PieCard";
import LineCard from "../../../common/LineCard";


function Analytics() {
  const accuracyData = [
    { name: "Correct", value: 50 },
    { name: "Wrong", value: 80 },
  ];


  const responseData = [
    {
      name: 'Q1',
      uv: 20,

    },
    {
      name: 'Q2',
      uv: 3000,
    },
    {
      name: 'Q3',
      uv: 2000,
    },


  ];
  return (
    <div className="flex flex-col space-y-6 ">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center w-full">
        <div className="md:col-span-2">

          <TextCard heading="Assessments" description="Below are the Assessment Reports" />
        </div>
        <div className="md:col-span-5">

          <TextCard heading="Most Recent Performance" description="Use below metrics to judge your performance." badgeContent="optimal" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-center w-full">
        <div className="lg:col-span-2">
          <UseCasesCard />
        </div>
        <div className="lg:col-span-5 flex flex-col md:flex-row gap-4 text-black" >
          <PieCard title="Accuracy Rate" data={accuracyData} />
          <LineCard title="Response Time" data={responseData} />
        </div>
      </div>
      <GraphsComponent title="Interview Report"
        components={[
          { Component: LineCard, props: { title: "Confidence Score", data: responseData } },
          { Component: LineCard, props: { title: "Response time", data: responseData } },
          { Component: PieCard, props: { title: "Accuracy Rate", data: accuracyData } },
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center w-full">
        {components.map(({ Component, props }, index) => (
          <div key={index} className="w-full">
            <Component {...props} /> {/* Render the component with its props */}
          </div>
        ))}
      </div>
    </div>
  );
};



export default Analytics;
