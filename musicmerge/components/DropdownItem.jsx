'use client'

import {useState, useRef} from 'react';

const DropdownItem = ({title, content}) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef(null);

    return (
        <div className='border border-gray-700 rounded-md overflow-hidden'>
            <button
            className='w-full text-left px-4 py-2 bg-brand-navy rounded-t-md focus:outline-none hover:bg-brand-sky'
            onClick={() => setIsOpen(!isOpen)}
            >
                {title}
            </button>
            <div
            ref={contentRef}
            className={`transition-height duration-500 ease-in-out ${isOpen ? 'h-auto' : 'h-0'}`}
            style={{height: isOpen ? `${contentRef.current.scrollHeight}px` : '0'}}
            >
                <div className='px-4 py-2 bg-gray-900 rounded-b-md'>
                    {content}
                </div>
            </div>
        </div>
    )
}

export default DropdownItem