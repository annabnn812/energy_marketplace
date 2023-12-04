import styles from "../../styles/instructionsComponent.module.css";
import LoginSignupContainer from "../../Pages/LoginSignupContainer"
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import Image from 'next/image'


export default function InstructionsComponent() {
  const router = useRouter();
  const open = () => {
    router.push('/home');
  };
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>
            <span>Decentralized Energy Market</span>
          </h1>
          <h3>Decentralized Energy, Empowering Possibilities for a Sustainable Future.</h3>
        </div>
      </header>
      <div className={styles.container_pic}>
      <Image
      src="/bz.png"
      width={150}
      height={200}
      alt="Meter"
    />
     &nbsp;
     &nbsp;
     &nbsp;
     &nbsp;
    <Image
      src="/pr.png"
      width={150}
      height={180}
      alt="Meter"
    />
    &nbsp;
     &nbsp;
     &nbsp;
     &nbsp;
    <Image
      src="/bill.png"
      width={150}
      height={200}
      alt="Meter"
    />
    </div>
      <LoginSignupContainer/>
    
    
      
    </div>
  );
}

