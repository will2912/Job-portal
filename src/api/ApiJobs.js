import supabaseClient from "@/utils/supabase";


export async function getJobs(token,{location,company_id, search_query}){
    
    const supabase = await supabaseClient(token);
    let query =  supabase.from("Jobs").select("*,company:companies(name,logo_url)");
    if(location){
        query=query.eq("location",location);
    }
    if(company_id){
        query=query.eq("company_id",company_id);
    }
    if(search_query){
        console.log("Filtering title by:", search_query);
        query = query.ilike("title", `%${search_query}%`);
    }
    const {data, error} = await query;
    if (error){
        console.error("erorr in jobListing", error);
        return null;
    }
    //console.log(data)
    return data;
}

export async function saveJobs(token,{alreadySaved},saveData){
    const supabase = await supabaseClient(token);
    // console.log(supabase)
    if (alreadySaved) {
  const { data, error: deleteError } = await supabase
    .from("saved_jobs")
    .delete()
    .eq("job_id", saveData.job_id)
    .eq("user_id", saveData.user_id); // 🔥 Important!

  if (deleteError) {
    console.error("error in deleting", deleteError);
    return null;
  }
  return data;


    }else{
        const {data, error:insertError} = await supabase.from("saved_jobs").insert([saveData]).select();
        if(insertError){
            console.error("error in inserting", insertError)
            return null;
        }
        return data;
    }    
    
}

export async function getSavedJobArray (token){
    const supabase = await supabaseClient(token);
    let query= supabase.from("saved_jobs").select("*");
    const {data, error} = await query;
    if (error){
        console.error("erorr in jobListing", error);
        return null;
    }
    
    return data;

}

export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("Jobs")
    .select(
      "*, company: companies(name,logo_url), applications: applications(*)"
    )
    .eq("id", job_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  return data;
}

export async function updateHiringStatus(token,{job_id,isOpen}){
    
    
    const supabase = await supabaseClient(token);
    let query = supabase.from("Jobs").update({isOpen}).eq("id",job_id).select();
    const {data, error}= await query;
    if(error){
        console.error("error in updating");
    }
    return data;
}

export async function postJob(token,_,saveData) {
  
    const supabase = await supabaseClient(token);
    const query= await supabase.from("Jobs").insert([saveData]).select()
    const {data,error}=query;
    if(error){
      console.log(error)
    }
    return data;
}

export async function getSavedJob (token){
    const supabase = await supabaseClient(token);
    let query= supabase.from("saved_jobs").select("*, job: Jobs(*, company: companies(name,logo_url))");
    const {data, error} = await query;
    if (error){
        console.error("erorr in savedJob", error);
        return null;
    }
    //console.log(data)
    return data;

}

export async function getCreatedJobs(token,{id}){
  
  const supabase = await supabaseClient(token);
  let query =await  supabase.from("Jobs").select("*,company:companies(name,logo_url)").eq("recruiter_id",id);
  const {data, error} = query;
  if (error){
        console.log("erorr in jobListing", error);
    }
    return data;
}
export async function deleteJob(token,{id,job_id}){
  console.log(id);
  const supabase = await supabaseClient(token);
  let query =await  supabase.from("Jobs").delete().eq("recruiter_id",id) .eq("id", job_id).select();
  const {data, error} = query;
  if (error){
        console.log("erorr in deleting", error);
    }
    console.log("success", data);
    return data;
}