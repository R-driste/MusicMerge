'use client'

import { useState, useMemo } from 'react'
import DropdownItem from "./DropdownItem"

const DropdownList = ({listData}) => {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredItems = useMemo(() => {
        if (!searchQuery) return listData
        return listData.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [searchQuery, listData])

    return (
        <div className="space-y-4">
            <input
                type="text"
                placeholder="Search schools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-sky text-black"
            />
            {
                filteredItems.map((item) => (
                    <DropdownItem key={item.title} title={item.title} content={item.content} />
                ))
            }
            {filteredItems.length === 0 && (
                <p className="text-center text-gray-500 py-4">No schools found matching "{searchQuery}"</p>
            )}
        </div>
    )
}

export default DropdownList