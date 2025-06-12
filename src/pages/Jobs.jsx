import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import JobCard from '../components/JobCard'
import JobDetails from '../components/JobDetails'
import { jobService, savedJobService } from '../services'

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [savedJobs, setSavedJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    salaryMin: '',
    salaryMax: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true)
      setError(null)
      try {
        const [jobsData, savedData] = await Promise.all([
          jobService.getAll(),
          savedJobService.getAll()
        ])
        setJobs(jobsData)
        setFilteredJobs(jobsData)
        setSavedJobs(savedData)

        // Check if there's a job ID in the URL
        const jobId = searchParams.get('id')
        if (jobId) {
          const job = jobsData.find(j => j.id === jobId)
          if (job) {
            setSelectedJob(job)
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load jobs')
        toast.error('Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [searchParams])

  useEffect(() => {
    // Apply filters and search
    let filtered = jobs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Job type filter
    if (filters.type) {
      filtered = filtered.filter(job => job.type === filters.type)
    }

    // Salary filter
    if (filters.salaryMin || filters.salaryMax) {
      filtered = filtered.filter(job => {
        if (!job.salary || !job.salary.min) return false
        
        const jobSalary = job.salary.min
        const minSalary = filters.salaryMin ? parseInt(filters.salaryMin) : 0
        const maxSalary = filters.salaryMax ? parseInt(filters.salaryMax) : Infinity
        
        return jobSalary >= minSalary && jobSalary <= maxSalary
      })
    }

    setFilteredJobs(filtered)
  }, [jobs, searchTerm, filters])

  const handleJobClick = (job) => {
    setSelectedJob(job)
    setSearchParams({ id: job.id })
  }

  const handleSaveJob = async (jobId) => {
    try {
      const isAlreadySaved = savedJobs.some(saved => saved.jobId === jobId)
      
      if (isAlreadySaved) {
        await savedJobService.delete(jobId)
        setSavedJobs(prev => prev.filter(saved => saved.jobId !== jobId))
        toast.success('Job removed from saved jobs')
      } else {
        const savedJob = await savedJobService.create({
          userId: 'user1', // In a real app, this would come from auth
          jobId,
          savedDate: new Date().toISOString()
        })
        setSavedJobs(prev => [...prev, savedJob])
        toast.success('Job saved successfully')
      }
    } catch (err) {
      toast.error('Failed to save job')
    }
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      type: '',
      salaryMin: '',
      salaryMax: ''
    })
    setSearchTerm('')
  }

  if (loading) {
    return (
      <div className="flex h-full">
        {/* Sidebar Skeleton */}
        <div className="w-80 bg-white border-r border-surface-200 p-6 overflow-y-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-surface-200 rounded"></div>
            <div className="h-8 bg-surface-200 rounded w-1/2"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-surface-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Job List Skeleton */}
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-surface-200 rounded w-3/4"></div>
                    <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                    <div className="h-4 bg-surface-200 rounded w-full"></div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Job Details Skeleton */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-surface-200 rounded w-3/4"></div>
                <div className="h-6 bg-surface-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-4 bg-surface-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-800 mb-2">Failed to load jobs</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-90 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden fixed top-20 left-4 z-30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="bg-primary text-white p-3 rounded-full shadow-lg"
        >
          <ApperIcon name="Filter" className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Filters Sidebar */}
      <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-80 bg-white border-r border-surface-200 p-6 overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-surface-800">Search & Filter</h2>
          <button
            onClick={() => setShowFilters(false)}
            className="lg:hidden text-surface-500 hover:text-surface-700"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Search Jobs
          </label>
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-3 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Job title, company, or keyword"
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Location Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            placeholder="City, state, or remote"
            className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Job Type Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Job Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        {/* Salary Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Salary Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={filters.salaryMin}
              onChange={(e) => setFilters(prev => ({ ...prev, salaryMin: e.target.value }))}
              placeholder="Min"
              className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="number"
              value={filters.salaryMax}
              onChange={(e) => setFilters(prev => ({ ...prev, salaryMax: e.target.value }))}
              placeholder="Max"
              className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="w-full px-4 py-2 text-surface-600 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="p-6">
          {/* Results Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold font-heading text-surface-800 mb-2">
              Job Opportunities
            </h1>
            <p className="text-surface-600">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {filteredJobs.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="Briefcase" className="w-16 h-16 text-surface-300 mx-auto" />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-surface-800">No jobs found</h3>
              <p className="mt-2 text-surface-600">Try adjusting your search criteria</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-90 transition-all"
              >
                Clear Filters
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Job List */}
              <div className="space-y-4 overflow-y-auto max-h-full">
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <JobCard
                      job={job}
                      isSelected={selectedJob?.id === job.id}
                      isSaved={savedJobs.some(saved => saved.jobId === job.id)}
                      onClick={() => handleJobClick(job)}
                      onSave={() => handleSaveJob(job.id)}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Job Details */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <AnimatePresence mode="wait">
                  {selectedJob ? (
                    <JobDetails
                      key={selectedJob.id}
                      job={selectedJob}
                      isSaved={savedJobs.some(saved => saved.jobId === selectedJob.id)}
                      onSave={() => handleSaveJob(selectedJob.id)}
                    />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center h-full p-12 text-center"
                    >
                      <div>
                        <ApperIcon name="MousePointer" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-surface-800 mb-2">
                          Select a job to view details
                        </h3>
                        <p className="text-surface-600">
                          Click on any job from the list to see full details and apply
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Jobs