
import { useRouter } from 'next/navigation'
import "../styles/Signup.css";


export default function SignupPage() {
    
    const router = useRouter()
    const { msg } = router.query || {};
    return (
        <>
    
           
     <div className="signup">
     
    <h1 className="text-2xl-semi text-gry-900" style={{ fontSize: 20 }}> Signup</h1>  
   

    {msg && <p className="error-message"  style={{ fontSize: 20 }} >{msg}</p>} {/* Display error message if present */}
   
  
    
            <form action='/api/signup' method='POST'>
           
                <input minLength="3" name="username" id="username" type="text" placeholder='Get an unique name' required className="signup-input"></input><br/>
                <input minLength="5" name="password" id="password" type="password" placeholder='password' required className="signup-input"></input><br/>
                <input minLength="5" name="passwordagain" id="passwordagain" type="password" placeholder='password again' required></input><br/>
                <input type="submit" value="Create a profile" className="signup-button"/> 
                
            </form>
            
            </div> 
          
         
     
    </>
    );
}

