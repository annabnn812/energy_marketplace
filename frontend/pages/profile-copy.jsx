import Layout from '../components/layout'
import { getCookie } from 'cookies-next';
import clientPromise from "../ABI/mongodb";
import Header from "./header"
import { useRouter } from 'next/navigation'; 
import Footer from "../components/instructionsComponent/navigation/footer/index"
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios'
import QCode from './QCode';


export default function ProfilePage( {username, created} ) {
    const router = useRouter();
    const open = () => {
      router.push('/profile');
    }
    const logout = () => {
        router.push('/api/logout');
      }
      

    return (
        
        <> 
        <Header />
        <Layout pageTitle="Profile">
        <h1 className="text-2xl-semi text-gry-900" style={{ display: "flex", color: "#4c5a6c" ,justifyContent: "center", fontSize: 30 }}>{username}'s  profile </h1> 
        
        <div className={styles.bill_container_pic}>
        <div className={styles.first_bill_container}>
        <button className="logout-button" type="button" onClick={logout}>Logout</button> <br />
        <p>Account created at <strong>{created}</strong></p>
        <p>Account: <strong>40614-200000-0 </strong> Prior account:<strong>0-2273-05565-00189-2 </strong></p>
        <p>Service delivered to <strong>1234 Abcd st, apt 1B </strong></p>
        <p>Next Billing Date: <strong>December 12, 2023 </strong></p>
        </div>
             <div className={styles.bill_container}>
             <h3 className="text-2xl-semi text-gry-900" style={{ display: "flex", color: "#2b7aea" ,justifyContent: "center", fontSize: 25 }}>Your account ballance - $107.24</h3>
             </div>
             </div>
             <div className={styles.bill_container_pic}>
             <div className={styles.bill_container}>
             <h1 className="text-2xl-semi text-gry-900" style={{ display: "flex", color: "#4c5a6c" ,justifyContent: "center", fontSize: 30 }}>Last billing period </h1> 
             <h3>Your billing summary as of Nov 09, 2023</h3>
             <p>Your previous charges and payments  </p>
             <p>Total charges from your last bill  $80.40</p>
             <p>Payments through Nov 08, thank you  -$80.40</p>
             <p>Balance from previous bill  $15.70</p>
             </div>
             <div className={styles.bill_container}>
             <h1 className="text-2xl-semi text-gry-900" style={{ display: "flex", color: "#4c5a6c" ,justifyContent: "center", fontSize: 30 }}>Your new charges  </h1> 
             <p>Billing period: Oct 11,2023 to Nov 08, 2023</p>
             <p>Electrocity charges - for 28 days$75.03</p>
             <p>Gas charges - for 28 days $32.23</p>
             <p> Adjustments  -$0.02</p>
             <h4>Total from this billing period $107.24</h4>
             <h2>Total amount due $107.24</h2>
             </div>
             <div className={styles.bill_container}>
             <Image
      src="/cone.png"
      width={300}
      height={300}
      alt="Meter"
    />
     </div>
     </div>
             <QCode />
          
             
           
        </Layout>
      
        <Footer /> 
        </>
    );
}

export async function getServerSideProps(context) {
    const req = context.req
    const res = context.res
    var username = getCookie('username', { req, res });
    if (username == undefined){
        return {
            redirect: {
                permanent: false,
                destination: "/"
            }
        }
    }
    const client = await clientPromise;
    const db = client.db("Users");
    const users = await db.collection("Profiles").find({"Username": username}).toArray();
    const userdoc = users[0]
    const created = userdoc['Created']
    return {
      props: {username: username, created: created},
    }
}