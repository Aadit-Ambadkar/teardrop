import { getSession } from "next-auth/react";
import { useEffect, useState, } from 'react'
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { decrypt, emojiToText, extractEmoji } from './api/aes';
import Head from "next/head";


export default function Home(props) {
    const { session } = props;
    const [input, setInput] = useState("");
    const [out, setOut] = useState("Filler Text (Key) too small, please add more");
    const [valid, setValid] = useState(false);
    const [copy, setCopy] = useState("Copy The Encrypted Message!");
    const [disableCopy, setDisableCopy] = useState(false);

    useEffect(() => {
        setValid(false);
        const [ ems, filler ] = extractEmoji(input);
        if (ems==="" || filler.length < 40) {
            return;
        }
        const textEncr = emojiToText(ems);
        const decrypted = decrypt(filler.substring(0, 32), textEncr);
        setValid(true);
        setOut(decrypted);
    }, [input]);
    const onEditInput = async (e) => {
        const fillerText = e.target.value;
        if (/\r|\n/.exec(fillerText)) {
            toast.error('No newline (enter) characters allowed');
            return;
        }
        setInput(fillerText);
    }

    const onCopy = async () => {
        setDisableCopy(true);
        navigator.clipboard.writeText(out);

        setTimeout(() => {
            setDisableCopy(false);
        }, 2000)
    }

    return (
        <div className="flex flex-col max-w-2xl m-auto bg-teal-100 h-full min-h-screen p-3">
            <Head>
                <title>decrypt | teardrop</title>
                <link rel="icon" />
            </Head>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="mt-5 p-3">
                <h1 className="text-center text-2xl text-cyan-800 font-bold">teardrop</h1>
                <h3 className="text-center text-lg text-cyan-800 font-bold">
                    a next level encryption service, but it&apos;s all emojis
                </h3>
            </div>
            <div className="text-center">
                <textarea
                    value={input}
                    className="my-2 py-1 px-2 w-11/12"
                    rows={4}
                    id="input"
                    placeholder="the encrypted message you got"
                    onInput={onEditInput}
                />
                {valid && (
                    <>  
                        <div className='m-3 bg-teal-50 px-4 py-2'>
                            <p>{out}</p>
                        </div>
                        <button
                            className={`bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 my-2 rounded-lg duration-200 ${disableCopy ? 'cursor-not-allowed hover:bg-cyan-900 bg-cyan-900' : ''}`}
                            onClick={()=>{
                                onCopy();
                                toast.success('Copied')
                            }}
                            disabled={disableCopy}
                        >
                            {copy}
                        </button>
                    </>
                )}
            </div>

            {session && (
                <div className="mt-5 text-center">
                    <p>Signed in as {session.user.email}</p>
                </div>
            )}

        </div>
    )
}
export async function getServerSideProps(context) {
    const session = await getSession(context);
    return {
        props: {
            session,
        },
    };
};