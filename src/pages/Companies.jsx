import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import CompanyCard from '@/components/CompanyCard'
import { companyService } from '@/services'

const Companies = () => {
  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [sortBy, setSortBy] = useState('name')

  const industries = [
    'Technology',
    'Finance', 
    'Healthcare',
    'Renewable Energy',
    'Data & Analytics'
  ]

  const companySizes = [
    '1-50',
    '51-200', 
    '201-1000',
    '1000-5000',
    '5000+'
  ]

  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true)
      setError(null)
      try {
        const companiesData = await companyService.getAll()
        setCompanies(companiesData)
        setFilteredCompanies(companiesData)
      } catch (err) {
        setError(err.message || 'Failed to load companies')
        toast.error('Failed to load companies')
      } finally {
        setLoading(false)
      }
    }

    loadCompanies()
  }, [])

  useEffect(() => {
    let filtered = companies

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by industry
    if (selectedIndustry) {
      filtered = filtered.filter(company => company.industry === selectedIndustry)
    }

    // Filter by company size
    if (selectedSize) {
      filtered = filtered.filter(company => company.size === selectedSize)
    }

    // Sort companies
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return b.rating - a.rating
        case 'size':
          return b.reviewCount - a.reviewCount
        case 'founded':
          return b.founded - a.founded
        default:
          return 0
      }
    })

    setFilteredCompanies(filtered)
  }, [companies, searchQuery, selectedIndustry, selectedSize, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedIndustry('')
    setSelectedSize('')
    setSortBy('name')
  }

  const handleCompanyClick = (company) => {
    // Future: Navigate to detailed company page
    console.log('Company clicked:', company.name)
    toast.info(`${company.name} - Full profile coming soon!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-surface-600">Loading companies...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Company Research</h1>
          <p className="text-surface-600">
            Discover companies, read reviews, and learn about company culture before you apply.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Industry Filter */}
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>

            {/* Size Filter */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Sizes</option>
              {companySizes.map(size => (
                <option key={size} value={size}>{size} employees</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="name">Name A-Z</option>
              <option value="rating">Highest Rated</option>
              <option value="size">Most Reviews</option>
              <option value="founded">Recently Founded</option>
            </select>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedIndustry || selectedSize || sortBy !== 'name') && (
            <div className="flex items-center justify-between pt-4 border-t border-surface-200">
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    Search: "{searchQuery}"
                  </span>
                )}
                {selectedIndustry && (
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    Industry: {selectedIndustry}
                  </span>
                )}
                {selectedSize && (
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    Size: {selectedSize}
                  </span>
                )}
                {sortBy !== 'name' && (
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    Sort: {sortBy}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-surface-500 hover:text-surface-700 text-sm font-medium flex items-center"
              >
                <ApperIcon name="X" className="w-4 h-4 mr-1" />
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-surface-600">
            Showing {filteredCompanies.length} of {companies.length} companies
          </p>
        </div>

        {/* Company Grid */}
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Building2" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">No companies found</h3>
            <p className="text-surface-500 mb-4">
              Try adjusting your search criteria or clearing the filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CompanyCard
                  company={company}
                  onClick={() => handleCompanyClick(company)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Companies