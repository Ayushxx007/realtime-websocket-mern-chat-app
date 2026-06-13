export const login=async(req,res,next)=>{

     console.log("login");
    res.send({message:"login"});

}

export const signup=async(req,res,next)=>{
     console.log("signup");
    res.send({message:"signup"});

}

export const logout=async(req,res,next)=>{
     console.log("logout");
    res.send({message:"logout"});

}

export const check=async(req,res,next)=>{
     console.log("check");
    res.send({message:"check"});

}

