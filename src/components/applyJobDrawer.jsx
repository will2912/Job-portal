import React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useFetch from '@/hooks/useFetch'
import { applyJob } from '@/api/apiApplication'

const schema=z.object({
  experience:z.number().min(0,{messege: "Experience must be at least 0"}).int(),
  skills:z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),
  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      { message: "Only PDF or Word documents are allowed" }
    ),
})

export  function ApplyJobDrawer ({ user, job, fetchJob, applied = false }) {
  const {register,control,handleSubmit,formState:{errors},reset}=useForm({resolver:zodResolver(schema),defaultValues: {
    education: "Intermediate", 
  },});
  const {loading:loadingApply,error: errorApply, fn:fnApply}= useFetch(applyJob);
  const onSubmit=(data)=>{
    fnApply({
      ...data,
       job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "applied",
      resume: data.resume[0],
    }).then(() => {
      fetchJob(undefined,{job_id:job.id});
      reset();
    });
  }
  return (
    <div className=' w-full'> 
        <Drawer open={applied ? false : undefined}>
            <DrawerTrigger className="w-full">{job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}</DrawerTrigger>
            <DrawerContent >
                <DrawerHeader>
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                <DrawerDescription>This action cannot be undone.</DrawerDescription>
                <form onSubmit={handleSubmit(onSubmit)}>
                   <Input 
                    type="number"
                    placeholder="Years of Experience"
                    className="flex-1"
                    {...register("experience",{valueAsNumber:true})}
                    />
                     {errors.experience && (
                        <p className="text-red-500">{errors.experience.message}</p>
                      )}
                    <Input
                    type="text"
                    placeholder="Skills (Comma Separated)"
                    className="flex-1"
                    {...register("skills")}
                    />
                    {errors.skills && (
                      <p className="text-red-500">{errors.skills.message}</p>
                    )}
                    <Controller
                      name="education"
                      control={control}
                      render={({field})=>
                    <RadioGroup defaultValue="Intermediate" onValueChange={field.onChange} value={field.value}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Intermediate" id="intermediate" />
                          <Label htmlFor="intermediate">Intermediate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Graduate" id="graduate" />
                          <Label htmlFor="graduate">Graduate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Post Graduate" id="post-graduate" />
                          <Label htmlFor="post-graduate">Post Graduate</Label>
                        </div>
                    </RadioGroup>
                      }
                    />
                    {errors.education && (
                      <p className="text-red-500">{errors.education.message}</p>
                    )}
                    <Input 
                      type="file"
                      accept=".pdf, .doc, .docx"
                      className="flex-1 file:text-gray-500"
                      {...register("resume")}
                    />
                     {errors.resume && (
                        <p className="text-red-500">{errors.resume.message}</p>
                      )}
                       {errorApply?.message && (
                          <p className="text-red-500">{errorApply?.message}</p>
                        )}
                        <Button type="submit" className=" text-white ">Submit</Button>
                </form>
                </DrawerHeader>
                <DrawerFooter>
                
                <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    </div>
  )
}

export default ApplyJobDrawer