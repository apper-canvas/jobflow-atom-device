import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { jobService, savedJobService, applicationService } from '../services'

const Home = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    savedJobs: 0,
    applications: 0,
    pendingApplications: 0
  })
  const [recentJobs, setRecentJobs] = useState([])
  const [recentApplications, setRecentApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [jobs, saved, applications] = await Promise.all([
          jobService.getAll(),
          savedJobService.getAll(),
          applicationService.getAll()
        ])

        // Calculate stats
        const pendingApps = applications.filter(app => app.status === 'pending').length
        setStats({
          savedJobs: saved.length,
          applications: applications.length,
          pendingApplications: pendingApps
        })

        // Get recent jobs (last 5)
        const sortedJobs = jobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
        setRecentJobs(sortedJobs.slice(0, 5))

        // Get recent applications (last 3)
        const sortedApps = applications.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
        setRecentApplications(sortedApps.slice(0, 3))

      } catch (err) {
        setError(err.message || 'Failed to load dashboard data')
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const handleJobClick = (jobId) => {
    navigate(`/jobs?id=${jobId}`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                <div className="h-8 bg-surface-200 rounded w-1/3"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-surface-200 rounded w-1/3"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-16 bg-surface-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
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
          <h3 className="text-lg font-semibold text-surface-800 mb-2">Something went wrong</h3>
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
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6"
      >
        <h1 className="text-2xl font-bold font-heading mb-2">Welcome back!</h1>
        <p className="text-blue-100">Ready to find your next career opportunity?</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/jobs')}
          className="mt-4 px-6 py-2 bg-white text-primary font-semibold rounded-lg hover:bg-surface-50 transition-colors"
        >
          Search Jobs
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-accent"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 text-sm">Saved Jobs</p>
              <p className="text-2xl font-bold text-surface-800">{stats.savedJobs}</p>
            </div>
            <div className="bg-accent/10 p-3 rounded-full">
              <ApperIcon name="Bookmark" className="w-6 h-6 text-accent" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-primary"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 text-sm">Total Applications</p>
              <p className="text-2xl font-bold text-surface-800">{stats.applications}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <ApperIcon name="FileText" className="w-6 h-6 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-warning"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 text-sm">Pending Applications</p>
              <p className="text-2xl font-bold text-surface-800">{stats.pendingApplications}</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-full">
              <ApperIcon name="Clock" className="w-6 h-6 text-warning" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-800">Recent Jobs</h2>
            <button
              onClick={() => navigate('/jobs')}
              className="text-primary hover:text-secondary text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>

          {recentJobs.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Briefcase" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-600">No recent jobs found</p>
              <button
                onClick={() => navigate('/jobs')}
                className="mt-2 text-primary hover:text-secondary font-medium transition-colors"
              >
                Explore Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleJobClick(job.id)}
                  className="p-4 border border-surface-200 rounded-lg hover:border-primary hover:shadow-md transition-all cursor-pointer"
                >
                  <h3 className="font-medium text-surface-800 mb-1">{job.title}</h3>
                  <p className="text-surface-600 text-sm mb-2">{job.company}</p>
                  <div className="flex items-center text-xs text-surface-500">
                    <ApperIcon name="MapPin" className="w-3 h-3 mr-1" />
                    <span className="mr-4">{job.location}</span>
                    <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                    <span>{new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-800">Recent Applications</h2>
            <button
              onClick={() => navigate('/applications')}
              className="text-primary hover:text-secondary text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>

          {recentApplications.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="FileText" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-600">No applications yet</p>
              <button
                onClick={() => navigate('/jobs')}
                className="mt-2 text-primary hover:text-secondary font-medium transition-colors"
              >
                Start Applying
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-surface-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-surface-800">{application.jobTitle}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      application.status === 'pending' ? 'bg-warning/10 text-warning' :
                      application.status === 'accepted' ? 'bg-success/10 text-success' :
                      application.status === 'rejected' ? 'bg-error/10 text-error' :
                      'bg-surface-100 text-surface-600'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                  <p className="text-surface-600 text-sm mb-2">{application.company}</p>
                  <div className="flex items-center text-xs text-surface-500">
                    <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                    <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Home