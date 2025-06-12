import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { applicationService, jobService } from '../services'

const Applications = () => {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true)
      setError(null)
      try {
        const [applicationsData, jobsData] = await Promise.all([
          applicationService.getAll(),
          jobService.getAll()
        ])

        setApplications(applicationsData)
        
        // Create a lookup object for jobs
        const jobsLookup = {}
        jobsData.forEach(job => {
          jobsLookup[job.id] = job
        })
        setJobs(jobsLookup)

      } catch (err) {
        setError(err.message || 'Failed to load applications')
        toast.error('Failed to load applications')
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'accepted':
        return 'bg-success/10 text-success border-success/20'
      case 'rejected':
        return 'bg-error/10 text-error border-error/20'
      case 'interview':
        return 'bg-info/10 text-info border-info/20'
      default:
        return 'bg-surface-100 text-surface-600 border-surface-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'Clock'
      case 'accepted':
        return 'CheckCircle'
      case 'rejected':
        return 'XCircle'
      case 'interview':
        return 'Calendar'
      default:
        return 'FileText'
    }
  }

  const filteredAndSortedApplications = applications
    .filter(app => {
      if (filter === 'all') return true
      return app.status === filter
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.appliedDate) - new Date(a.appliedDate)
      } else if (sortBy === 'oldest') {
        return new Date(a.appliedDate) - new Date(b.appliedDate)
      } else if (sortBy === 'company') {
        const jobA = jobs[a.jobId]
        const jobB = jobs[b.jobId]
        return (jobA?.company || '').localeCompare(jobB?.company || '')
      }
      return 0
    })

  const handleViewJob = (jobId) => {
    navigate(`/jobs?id=${jobId}`)
  }

  const handleWithdrawApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return
    }

    try {
      await applicationService.delete(applicationId)
      setApplications(prev => prev.filter(app => app.id !== applicationId))
      toast.success('Application withdrawn successfully')
    } catch (err) {
      toast.error('Failed to withdraw application')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/3 mb-4"></div>
          <div className="flex gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-surface-200 rounded w-24"></div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="animate-pulse space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="h-6 bg-surface-200 rounded w-3/4"></div>
                    <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-surface-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-surface-200 rounded w-1/4"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-800 mb-2">Failed to load applications</h3>
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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold font-heading text-surface-800 mb-2">
            My Applications
          </h1>
          <p className="text-surface-600">
            Track your job applications and their status
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-90 transition-all"
          >
            Apply to More Jobs
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: applications.length, color: 'bg-primary' },
          { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, color: 'bg-warning' },
          { label: 'Interview', value: applications.filter(a => a.status === 'interview').length, color: 'bg-info' },
          { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, color: 'bg-success' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${stat.color} mr-3`}></div>
              <div>
                <p className="text-2xl font-bold text-surface-800">{stat.value}</p>
                <p className="text-surface-600 text-sm">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All Applications' },
            { value: 'pending', label: 'Pending' },
            { value: 'interview', label: 'Interview' },
            { value: 'accepted', label: 'Accepted' },
            { value: 'rejected', label: 'Rejected' }
          ].map((filterOption) => (
            <button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === filterOption.value
                  ? 'bg-primary text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest First</option>
          <option value="company">Company Name</option>
        </select>
      </div>

      {/* Applications List */}
      {filteredAndSortedApplications.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="FileText" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-800">
            {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
          </h3>
          <p className="mt-2 text-surface-600">
            {filter === 'all' 
              ? 'Start applying to jobs to track your progress here'
              : `You don't have any ${filter} applications at the moment`
            }
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/jobs')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-90 transition-all"
          >
            Browse Jobs
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedApplications.map((application, index) => {
            const job = jobs[application.jobId]
            
            return (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-surface-800 mb-1">
                          {job?.title || 'Unknown Position'}
                        </h3>
                        <p className="text-surface-600 mb-2">
                          {job?.company || 'Unknown Company'}
                        </p>
                        <div className="flex items-center text-sm text-surface-500 space-x-4">
                          <span className="flex items-center">
                            <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                            {job?.location || 'Unknown Location'}
                          </span>
                          <span className="flex items-center">
                            <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                            Applied {new Date(application.appliedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center ml-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                          <ApperIcon name={getStatusIcon(application.status)} className="w-4 h-4 mr-2" />
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {application.coverLetter && (
                      <div className="mt-3 p-3 bg-surface-50 rounded-lg">
                        <p className="text-sm text-surface-700 line-clamp-2">
                          <strong>Cover Letter:</strong> {application.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mt-4 md:mt-0 md:ml-4">
                    <button
                      onClick={() => handleViewJob(application.jobId)}
                      className="flex items-center px-3 py-2 text-primary hover:text-secondary transition-colors"
                    >
                      <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                      View Job
                    </button>
                    
                    {application.status === 'pending' && (
                      <button
                        onClick={() => handleWithdrawApplication(application.id)}
                        className="flex items-center px-3 py-2 text-error hover:text-error/80 transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Applications