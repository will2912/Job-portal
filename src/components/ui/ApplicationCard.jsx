import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Boxes, BriefcaseBusiness, Download, Eye, School } from 'lucide-react'
import useFetch from '@/hooks/useFetch';
import { updateApplicationStatus } from '@/api/apiApplication';

function ApplicationCard  ({application,isCandidate=false}) {
    const {data:fnData,loading:fnLoading,error:fnError,fn:fnUpdating}=useFetch(updateApplicationStatus)
    const handleView=()=>{
        const link=document.createElement("a");
        link.href=application?.resume;
        link.target="_blank";
        link.click();
    }

    const handleStatusChange= (status)=>{
        fnUpdating({id:application.id,status}).then(()=>{
            if(fnData){
                console.log(data)
            }
        })

    }

  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between font-bold"><h2>{isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application.name}</h2> 
            <div className='flex gap-2' >
                <Eye
                size={18}
                className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer" 
                onClick={handleView}
                />
            <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"     
          />
          </div>
          </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-9 ">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={15} /> {application?.experience} years of
            experience
          </div>
          <div className="flex gap-2 items-center">
            <School size={15} />
            {application?.education}
          </div>
          <div className="flex gap-2 items-center">
            <Boxes size={15} /> Skills: {application?.skills.substring(0, application.skills.indexOf("-"))}
          </div>
        </div>
        <hr />
      </CardContent>
            <CardFooter className="flex justify-between">
                <span>{new Date(application?.created_at).toLocaleString()}</span>
                    {isCandidate?<span className="capitalize font-bold"> Status: {application.status} </span>:
                    (
                        <Select
                            onValueChange={handleStatusChange}
                            defaultValue={application.status}
                        >
                            <SelectTrigger className="w-52">
                            <SelectValue placeholder="Application Status" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="applied">Applied</SelectItem>
                            <SelectItem value="interviewing">Interviewing</SelectItem>
                            <SelectItem value="hired">Hired</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
            </CardFooter>
        </Card>
    </div>
  )
}

export default ApplicationCard