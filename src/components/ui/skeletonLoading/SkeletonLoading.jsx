import React from "react";

import CategoryTag from "../../../features/messages/components/CategoryTag/CategoryTag";
import TextPreview from "../../../features/messages/components/TextPreview/TextPreview";
const SkeletonLoading = () => {
  return (
    <div
      className={`w-[436px] max-sm:w-full border-solid border border-black border-opacity-[0.1] rounded-[30px]
         bg-white shadow-0 shadow-md shadow-2 shadow-opacity-10 mx-3 my-10 animate-pulse`}
      style={{
        position: "relative",
        zIndex: "1",
      }}
    >
      <div className="flex flex-col p-[15px] relative  ">
        <div className="rounded-[20px] h-[195px] object-cover bg-slate-400 "></div>

        <div className="flex flex-col flex-1 mt-[10px]">
          <h1 className=" h-8 bg-slate-400 "></h1>

          <h1 className="my-2 h-32 bg-slate-400 "></h1>

          <section className="flex items-center">
            <div className=" rounded-full bg-slate-400 h-10 w-10"></div>
            <div className=" mr-2 my-2 h-8 w-1/2 bg-slate-400 "></div>
          </section>
          <div className="flex items-end justify-between">
            <section className="flex w-fit">
              <h1 className=" h-8 w-16 bg-slate-400 "></h1>

              <h1 className="mx-2 h-8 w-16 bg-slate-400 "></h1>
            </section>
            <CategoryTag
              category={{
                title: "ראשי",
                color: "skeleton",
                isInSkeleton: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoading;
