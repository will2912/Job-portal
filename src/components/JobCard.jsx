import React, { useEffect, useState } from 'react'
import { useSession, useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Heart, MapPinIcon, Trash2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import useFetch from '@/hooks/useFetch';
import {  deleteJob, getSavedJobArray, saveJobs } from '@/api/ApiJobs';
import { BarLoader } from 'react-spinners';


const JobCard =  ({
    savedJob,
    job=savedJob.job,
    isMyJob,
    saveInit,
    onJobDelete=()=>{},
})=>{
    const [isSaved,setSaved]=useState();
    const {user} = useUser()
    const inputOptions = { alreadySaved: isSaved };
    let inputJob= {job_id: job.id, user_id: user.id,}
     const {fn: fnSavedJob,data: saveJob,loading:loadingSavedJob,}=useFetch(saveJobs);
     
    const {fn: fnSavedJobArray,data:SavedJobArray, loading: loadingSavedJobArray}=useFetch(getSavedJobArray)
    const {fn: fnDeleteJob,data:deletedJob, loading: loadingDeleteJob}=useFetch(deleteJob)
    useEffect(()=>{
        fnSavedJobArray();
        //console.log( SavedJobArray)
    },[deleteJob])
    
    const handleDelete= async()=>{
       await fnDeleteJob(undefined,{id:user.id,job_id:job.id})
        onJobDelete();
    }


    const handleClick=()=>{
        fnSavedJob(inputJob, { alreadySaved: isSaved });

        setSaved((prev)=>!prev);
    }
    
    
    useEffect(()=>{
        if(SavedJobArray){
        const Saved = SavedJobArray?.some((item) => item.job_id === job.id);
        setSaved(Saved,deleteJob)
        // console.log(Saved)
        // console.log( SavedJobArray)
    }
        
    },[SavedJobArray])

    

    
       


    
    if(loadingDeleteJob){
        return <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
    }
    return <div>
    <Card className="flex flex-col">
        
       <CardHeader className="flex">
      
            <CardTitle className="flex justify-between font-bold" >{job.title} 
                {isMyJob&&(
                <Trash2Icon fill="red" size={18} className='text-red-300 cursor-pointer' onClick={handleDelete} />
            )}
            </CardTitle>       
        </CardHeader> 
        <CardContent className="flex flex-col gap-4 flex-1">
            <div className="flex justify-between">
                {job.company&& <img src={job.company.logo_url} className='h-6' alt="" /> }
                <div className="flex gap-2 items-center">
                    <MapPinIcon size={15} /> {job.location}
                </div>
            </div>
            <hr />
        {job.description?.substring(0, job.description.indexOf("."))}.
        </CardContent>
        <CardFooter className="flex gap-2">
            <Link to={`/job/${job.id}`} className="flex-1">
            <Button variant="secondary" className="w-full">
                More Details
            </Button>
            
            </Link>
            {isSaved?<Heart size={20} fill='red' onClick={handleClick} />:<Heart size={20}  onClick={handleClick}/>}
        </CardFooter>
    </Card>
   </div>
 }


export default JobCard