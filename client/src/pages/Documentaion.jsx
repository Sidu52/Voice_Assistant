import React, { useState, useEffect } from 'react'
import Card from './component/card';
import './component/card.scss';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { BiLogoLinkedin, BiLogoYoutube, BiLogoInstagram, BiLogoWhatsapp, } from 'react-icons/bi';
import './Documentation.scss';
import { docData } from '../data/docData';
import leftbackgroundimg from '../assets/image/leftgradin.webp';
import rightbackgroundimg from '../assets/image/rightgradin.webp';
import VsCodeimg from '../assets/image/vsCode.webp';
import { GiMusicSpell } from 'react-icons/gi';
import { LuListTodo } from 'react-icons/lu';
import { MdOutlineRoundaboutRight } from 'react-icons/md';
import { TbBrandFunimation, TbDeviceGamePad, TbLanguage } from 'react-icons/tb';
import { CiTimer } from 'react-icons/ci';

export default function Documentaion() {
    const [scrollY, setScrollY] = useState(0);

    // Update the scrollY value as the user scrolls
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 650) {
                setScrollY(window.scrollY);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <div className='flex flex-col items-center justify-center gap-1.5 '>
            <div
                className='transition-all duration-100 ease-linear transform absolute top-0 left-0 w-full flex items-center '
                style={{ transform: `translateY(${scrollY}px)`, zIndex: scrollY >= 550 ? "1" : "auto" }}
            >
                <img src={leftbackgroundimg} alt="" className='absolute top-0 left-0 w-11/12' style={{ width: "1023px", height: "1052px" }} />
                <img src={rightbackgroundimg} alt="" className='absolute top-0 right-0 w-11/12' style={{ width: "1023px", height: "1052px" }} />
            </div>
            <div className='text-center py-16 text-white border-t-8 border-teal-400 w-full'>

                <div className=' mt-24'>
                    <div className='flex flex-row items-center justify-center gap-1.5 text-4xl mb-5 '>
                        <HiOutlineClipboardDocumentList />
                        <h3 className='font-bold text-6xl'><span className='text-teal-400'>ALSTON</span>DOCS</h3>
                    </div>
                    <div className='leading-normal text-sm font-semibold mb-5'>
                        <p className='font-bold text-lg text-zinc-400'>Full Documation for guid how to use Application</p>
                        <p className='font-bold text-lg text-zinc-400'>Full Documation for Application</p>
                    </div>
                    <div className='mb-5'>
                        <input className='w-96 text-sm rounded-xl p-3 text-black outline-none border-none' type="search" placeholder='Enter Command and find command cate' />
                    </div>
                    <div className='flex flex-row items-center justify-center mb-5'>
                        <button className="btn_hovering w-36 h-12 bg-gradient-to-r from-teal-400 to-indigo-300 rounded-md border-0 outline-none cursor-pointer relative overflow-hidden shadow-lg">
                            <span className="first_text text-sm uppercase tracking-tighter transition-top duration-500 absolute w-full top-6 left-0 transform -translate-y-1/2">Submit</span>
                            <span className="secound_text text-sm uppercase tracking-tighter transition-top duration-500 absolute top-full  ">Great!</span>
                        </button>
                    </div>
                    <div className="contact_social_icon">
                        <div className="social_icon">
                            <a href="https://www.linkedin.com/in/gaurav-khare-gravit" className="socialContainer linkedin">
                                <BiLogoLinkedin />
                            </a>
                            <a href="#" className="socialContainer youtube">
                                <BiLogoYoutube />
                            </a>
                            <a href="#" className="socialContainer instagram">
                                <BiLogoInstagram />
                            </a>
                            <a href="#" className="socialContainer whatsapp">
                                <BiLogoWhatsapp />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className=' w-full flex items-center justify-center relative'>
                <input type="text" className=' text-white absolute top-11 w-2/4 p-5 border-4 rounded-md border-gray-500 bg-gray-800 bg-opacity-60' placeholder='Ask To Jarvis Your Command Category' />
                <img className='w-4/5' src={VsCodeimg} alt="" />
            </div>
            <div className='text-white flex flex-col items-center justify-center gap-1.5  '>
                <h3 className='font-bold text-xl text-zinc-500 leading-7'>Trusted by tens of thousands of engineers, including ones at</h3>
                <ul className='text-zinc-400 font-bold text-4xl w-3/4 flex items-center justify-center gap-10 mt-16 flex-wrap'>
                    <li>Music Controll</li>
                    <li>Todo CRUD</li>
                    <li>Greeting</li>
                    <li>AboutJarvis</li>
                    <li>SidhuAlston</li>
                    <li>Jokes</li>
                    <li>Quize Game</li>
                    <li>Translate</li>
                    <li>Date/Time</li>
                </ul>
            </div>


            <div className='text-center w-full text-white'>
                <div>
                    <h3 className='text-4xl mt-8 mb-2'>Getting Started is eassy</h3>
                    <p>Welcome to AlstonDoc. This landing page is an explain how to intrect with voice assistant with full explaintion documentation.</p>
                </div>
                <div className='flex flex-col items-center justify-center mt-16'>
                    {/* {docData.map((data, index) => (
                        <div key={index} className='flex flex-row items-center justify-center gap-24 w-10/12' style={{ flexDirection: index % 2 != 0 ? "row-reverse" : "" }}>
                            <img src={data.img} alt="img" className='w-1/4' />

                            <div className="w-4/5 text-left">
                                <h3>{data.heading}</h3>
                                {data.dec.map((dec, index) => (
                                    <div key={index}>
                                        

                                        <p>{dec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))} */}
                </div>
            </div>
        </div>
    )
}
