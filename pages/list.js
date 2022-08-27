import { collection, getDocs } from "firebase/firestore";
import { getSession } from "next-auth/react";
import { fetch_db } from '../fb/Firebase'
import { useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

export default function Home(props) {
    const { session, messages } = props;
    console.log(messages)
    return (
        <div className="flex flex-col max-w-2xl m-auto bg-teal-100 h-full min-h-screen p-3">
            <Head>
                <title>list | teardrop</title>
                <link rel="icon" />
            </Head>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="mt-5 p-3">
                <h1 className="text-center text-2xl text-cyan-800 font-bold">all saved messages</h1>
                <h3 className="text-center text-lg text-cyan-800 font-bold">
                    {session ? "in encrypted form, of course" : "you must be signed in to view this page"}
                </h3>
            </div>
            

            {session && (
                <div className="mt-5 text-center">
                    <p className="text-cyan-800 text-sm font-bold">click on a message to copy</p>
                    <p className="text-cyan-800 text-sm font-bold">hover over a message to see the date of creation</p>
                    {messages.length>0 ?  (messages.map((message, index) => {
                            
                            return (
                                <div key={index} title={message.date.slice(0,10)} className='m-3 bg-teal-50 px-4 py-2 cursor-default' onClick={()=>{
                                    navigator.clipboard.writeText(message.encrypted);
                                    toast.success('Copied');
                                }}>
                                    <p>{message.encrypted}</p>
                                </div>
                            )
                        }))
                        :
                        (
                            <p className="text-cyan-800 my-5">No Saved Messages</p>
                        )
                    }
                    <p>Signed in as {session.user.email}</p>
                </div>
            )}

        </div>
    )
}
export async function getServerSideProps(context) {
    const session = await getSession(context);
    if (session?.user !== undefined) {
        const db = fetch_db();
        const uid = session?.user?.id?.toString();
        let colRef = collection(db, uid);
        let messages = [];
        await getDocs(colRef).then((snapshot)=>{
            snapshot.docs.forEach((doc) => {
                messages.push({ ...doc.data() });
            })
        }).catch(e => {
            console.log(e)
        })
        messages.sort((a,b) => (a.date < b.date ? 1 : -1))
        return {
            props: {
                session,
                messages
            },
        };
    } else {
        let messages = [];
        return {
            props: {
                session,
                messages
            }
        }
    }
};