import supabaseClient, { URL } from "@/utils/supabase";

export async function applyJob(token,_,jobData){
    
    const supabase = await supabaseClient(token);
    const random =Math.floor(Math.random()*90000);
    const fileName=`resumes-${random}-${jobData.candidate_id}`
    const {error: storageError}=await supabase.storage.from("resumes").upload(fileName,jobData.resume)
    if(storageError) console.log("error in uploading resume");
    
    const resume=`${URL}/storage/v1/object/public/resumes/${fileName}`
    const {data,error}= await supabase.from("applications").insert({
         ...jobData,
        resume,
    }).select();
    if(error){console.error("error in inserting application "+error)}
    
    return data;
}

export async function updateApplicationStatus(token,_, saveData){
    const { status, id } = saveData;
   
    const supabase=await supabaseClient(token);
    const {data, error} =await supabase.from("applications").update({status}).eq("id",id).select();
    if(error){
        console.log("error in updating application status");
    }
    
    return data;
}

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:Jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}