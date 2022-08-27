import { getSession } from "next-auth/react";
import { useEffect, useState, } from 'react';
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { encrypt, textToEmoji, embedEmoji } from './api/aes';
import {useRouter} from 'next/router'
import Head from "next/head";


export default function Home(props) {
    const { session } = props;
    const [message, setMessage] = useState("");
    const [key, setKey] = useState("");
    const [out, setOut] = useState("Filler Text (Key) too small, please add more");
    const [valid, setValid] = useState(false);
    const [copy, setCopy] = useState("Copy The Encrypted Message!");
    const [disableCopy, setDisableCopy] = useState(false);
    const [saved, setSaved] = useState(false);
    const uid = session?.user?.id?.toString();
    const router = useRouter();

    useEffect(() => {
        setValid(false);
        if (key.length < 40) {
            setOut('Filler Text (Key) too small, please add more to the Filler Text');
        } else if (message.length == 0) {
            setOut('Message Text (Message) too small, please add more to the message')
        } else {
            let sk = key.substring(0, 32);
            let encr = encrypt(sk, message);
            let encrEmoji = textToEmoji(encr);
            let encrEmojiEmbed = embedEmoji(encrEmoji, key);
            setValid(true);
            setOut(encrEmojiEmbed);
            setSaved(false);
        }
    }, [message, key]);

    const onEditMsg = async (e) => {
        const msg = e.target.value;
        if (/\r|\n/.exec(msg)) {
            return;
        }
        setMessage(msg);
    }
    const onEditKey = async (e) => {
        const fillerText = e.target.value;
        if (/\r|\n/.exec(fillerText)) {
            return;
        }
        setKey(fillerText);
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
                <title>encrypt | teardrop</title>
                <link rel="icon" href="/logo.svg"/>
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
                    value={message}
                    className="my-2 py-1 px-2 w-11/12"
                    rows={1}
                    maxLength={450}
                    id="message"
                    placeholder="super secret message here"
                    onInput={onEditMsg}
                />
                <textarea
                    value={key}
                    className="my-2 py-1 px-2 w-11/12"
                    rows={4}
                    maxLength={450}
                    id="filler"
                    placeholder="some random filler text, about a paragraph in size"
                    onInput={onEditKey}
                />
                <p>{out}</p>
                {valid && (
                    <>
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
                        {session && (
                            <div>
                                <button
                                    className={`bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 my-2 rounded-lg duration-200 ${saved ? 'cursor-not-allowed hover:bg-cyan-900 bg-cyan-900' : ''}`}
                                    onClick={() => {
                                        setSaved(true);
                                        fetch('./api/add-data', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                user: uid,
                                                encrypted: out
                                            })
                                        }).then(() => {
                                            router.push('/list')
                                        }).catch((e)=> {console.log(e)})
                                    }}
                                    disabled={saved}
                                >Save</button>
                            </div>
                        )}
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