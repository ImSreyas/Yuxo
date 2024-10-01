'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search as SearchIcon } from "lucide-react"

const Search = ({className}: {className: string}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  return (
    <form onSubmit={handleSearch} className={`relative w-full md:max-w-md xl:max-w-lg ${className}`}>
      <Input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pe-24 ps-6 py-6 rounded-full"
      />
      <Button 
        type="submit" 
        size="icon"
        className="absolute right-0 top-0 rounded-full h-full aspect-square w-20"
      >
        <SearchIcon className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  )
}

export default Search;