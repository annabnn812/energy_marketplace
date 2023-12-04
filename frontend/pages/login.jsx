import { useRouter } from 'next/navigation';
import styles from "../styles/Login.css";

export default function LoginPage() {
  const router = useRouter();
  const { loginMsg } = router.query || {};
  const decodedLoginMsg = loginMsg ? decodeURIComponent(loginMsg) : '';

  return (
    <>
      <div className="login">
        <h1 className="text-2xl-semi text-gry-900" style={{ fontSize: 20 }}>Login</h1>
  
        {decodedLoginMsg && <p className={styles["error-message"]}>{decodedLoginMsg}</p>}
        
        <br />
        <form action='/api/login' method='POST'>
          <input minLength="3" name="username" id="username" type="text" placeholder='username' required></input><br />
          <input minLength="5" name="password" id="password" type="password" placeholder='password' required></input><br />
          <input type="submit" value="Sign in" className="login-button"/> 
        </form>
      </div>
    </>
  );
}
