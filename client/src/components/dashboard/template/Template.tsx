import React, { ReactNode, useRef } from "react";
import SideMenu from "./SideMenu";
import NavBar from "./NavBar";
interface TemplateProps {
  children: ReactNode;
}

const Template: React.FC<TemplateProps> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  // const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
  //   e.preventDefault();
  //   if (contentRef.current) {
  //     contentRef.current.scrollTop = 0;
  //   }
  // };

  return (
    <div className="grid grid-cols-6 md:grid-cols-10 gap-0 h-full">
      <div className="col-span-1 md:col-span-1 lg:col-span-2">
        <SideMenu />
      </div>
      <div className="col-span-5 md:col-span-9 lg:col-span-8 h-full">
        <div className="relative">
          <NavBar />
          <div
            className="overflow-y-auto h-screen flex flex-col bg-white"
            ref={contentRef}
          >
            <div
              className="flex-shrink-0 p-5  max-md:p-3  h-full"
              style={{ marginTop: 72 }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template;
