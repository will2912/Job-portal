import { getApplications } from "@/api/apiApplication";
import { getCreatedJobs } from "@/api/ApiJobs";
import JobCard from "@/components/JobCard";
import ApplicationCard from "@/components/ui/ApplicationCard";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

function Myjobs() {
    const {user,isLoaded}=useUser()
     const {fn: fnApplications,data:applications, loading: loadingApplications}=useFetch(getApplications)
     const {fn: fnJobs,data:jobs, loading: loadingJobs}=useFetch(getCreatedJobs)
     useEffect(()=>{       
             if(isLoaded)fnApplications(undefined,{user_id:user.id})
             if(isLoaded)fnJobs(undefined,{id:user.id})           
         },[isLoaded])
    return ( 
        <div>
            {<h1 className="gradient-title font-extrabold sm:text-7xl text-center pb-8">
                {user?.unsafeMetadata?.role === "candidate"?("Applied Applications"):"Created Jobs"}
            </h1>}
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user?.unsafeMetadata?.role === "candidate"?applications?.map((ap)=>{
                   return <ApplicationCard key={ap.id} application={ap} isCandidate={true}/>
                }):jobs?.map((job)=>{
                    return <JobCard key={job.id} job={job} isMyJob={job.recruiter_id===user.id?true:false } onJobDelete={() => fnJobs(undefined, { id: user.id })} />
                })
                }
        </div>
        </div>
     );
}

export default Myjobs;