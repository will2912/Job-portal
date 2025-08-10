import { getSingleJob, updateHiringStatus } from "@/api/ApiJobs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import ApplyJobDrawer from "@/components/applyJobDrawer";

import { useSession } from "@clerk/clerk-react";
import ApplicationCard from "@/components/ui/ApplicationCard";


function Jobpage() {
    
    
    const {isLoaded, user} =useUser();
    const {id} = useParams();
    const {fn: fnJob,data:job, loading: loadingJob}=useFetch(getSingleJob)
    const {fn:fnUpdateHiring,data:updatedData,loading: loadingHiring}=useFetch(updateHiringStatus);
   
    
    const handleStatus= async(value)=>{
        let newisOpen=value==="open"?true:false;
        fnUpdateHiring(undefined,{job_id:id,isOpen:newisOpen}).then(()=>fnJob(undefined,{job_id:id,}))       
    }
    
    useEffect(()=>{       
        if(isLoaded)fnJob(undefined,{job_id:id,})        
    },[isLoaded])
    useEffect(()=>{       
        if(job){}    
    },[job])


     if (!isLoaded||loadingJob) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
    }
    return ( 
        <div>
             <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center mb-10">
                <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
                {job?.title}
                </h1>
                <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
            </div> 

             <div className="flex justify-between mb-10">
                <div className="flex gap-2">
                <MapPinIcon /> {job?.location}
                </div>
                <div className="flex gap-2">
                <Briefcase /> {job?.applications?.length} Applicants
                </div>
                <div>
                    <div className="flex gap-2">
                {job?.isOpen ? (
                    <>
                    <DoorOpen /> Open
                    </>
                ) : (
                    <>
                    <DoorClosed /> Closed
                    </>
                )}
                
                </div>
                   
                    
                </div>
                
            </div>
             <div className="mb-5">
                {job?.recruiter_id===user.id?(
                        <Select  onValueChange={handleStatus} >
                            <SelectTrigger className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}>
                                <SelectValue placeholder={`HiringStatus: ${job?.isOpen ? "Open" : "Closed"}`} />

                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                                
                            </SelectContent>
                        </Select>):<></>}
                        
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold mb-5">About the job</h2>
            <p className="sm:text-lg mb-5">{job?.description}</p>

            <h2 className="text-2xl sm:text-3xl font-bold mb-5">
                What we are looking for
            </h2> 
            <MDEditor.Markdown source={job?.requirement} className="bg-transparent sm:text-lg wnde-markdown mb-5" /> 
            {(job?.recruiter_id!==user.id)?<div className="w-full ">
                <ApplyJobDrawer 
                    job={job} user={user} fetchJob={fnJob} applied={job?.applications?.find((ap)=>ap.candidate_id===user.id)}
                />
            </div>:<></>}
            {(job?.applications?.length>0&&job.recruiter_id===user.id)&&(
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
                {job.applications.map((ap)=>{
                   return <ApplicationCard key={ap.id} application={ap}/>
                })}
            </div>)}
        </div>
     );
}

export default Jobpage;