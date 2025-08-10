import { getSavedJob, getSavedJobArray } from "@/api/ApiJobs";
import JobCard from "@/components/JobCard";
import useFetch from "@/hooks/useFetch";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

function Savejob() {
    const {data:savedJob,loading:savedJobloading,error:savedJobError,fn:savedJobFn}=useFetch(getSavedJob);
    useEffect(()=>{
        savedJobFn();
    },[])
    return ( 
        

       <div>
        {savedJobloading && (
                <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
            )}
         {savedJobloading===false&&(<div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedJob?.length?(
                     savedJob.map((savedJob)=>{ return  <JobCard key={savedJob.id} savedJob={savedJob}  />})
                  ):(
                     <div>no jobs found</div>
                  )}
               </div>)}
               </div>
     );
}

export default Savejob;