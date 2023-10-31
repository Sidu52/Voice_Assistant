import React from 'react'
import Card from './component/card';
import './component/card.scss';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { BsArrowRightCircle } from 'react-icons/bs';
import { BiLogoLinkedin, BiLogoYoutube, BiLogoInstagram, BiLogoWhatsapp, } from 'react-icons/bi';
import './Documentation.scss';

export default function Documentaion() {
    return (
        <div className='flex flex-col items-center justify-center gap-1.5 '>
            <div className='text-center py-16 bg-slate-500 text-white border-t-8 border-teal-400 w-full'>
                <div>
                    <div className='flex flex-row items-center justify-center gap-1.5 text-4xl mb-5 '>
                        <HiOutlineClipboardDocumentList />
                        <h3 className='font-bold'><span className='text-teal-400'>ALSTON</span>DOCS</h3>
                    </div>
                    <div className='leading-normal text-sm font-semibold mb-5'>
                        <p>Full Documation for guid how to use Application</p>
                        <p>Full Documation for Application</p>
                    </div>
                    <div className='mb-5'>
                        <input className='w-96 text-sm rounded-3xl p-2' type="search" placeholder='Enter Command and find command cate' />
                    </div>
                    <div className='flex flex-row items-center justify-center mb-5'>
                        <button class="cursor-pointer font-helvetica transition-all duration-200 px-10 py-2 rounded-full bg-white text-black border border-transparent flex items-center text-base hover:bg-white active:transform scale-95">
                            <span>Continue</span>
                            <BsArrowRightCircle className="w-8 h-8 ml-2" />
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
            <div className='text-center w-2/3'>
                <div>
                    <h3 className='text-4xl mt-8 mb-2'>Getting Started is eassy</h3>
                    <p>Welcome to AlstonDoc. This landing page is an explain how to intrect with voice assistant with full explaintion documentation.</p>
                </div>
                {/* <div className='grid grid-cols-3 items-center justify-center gap-1.5 text-4xl mb-5 '>
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                </div> */}
            </div>
        </div>
    )
}
