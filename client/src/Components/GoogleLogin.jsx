import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

 export default  function GoogleLoginx (){

     async function onGoogleLogin(credentialResponse) {
         try {
             const res = await axios.post(
                 "http://localhost:3001/api/auth/google",
                 {
                     credential: credentialResponse.credential
                 },
                 { withCredentials: true }
             );

             console.log(res.data);
         } catch (err) {
             console.error("Login request failed:", err);
         }
     }

   return (<div>
       <GoogleLogin
           onSuccess={onGoogleLogin}
                    onError={() => {
                        console.log("Login Failed");
                    }}
       />
   </div>);

}