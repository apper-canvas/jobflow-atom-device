import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from './ApperIcon'
import { jobService } from '../services'

const MainFeature = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedJobs = async () => {
      try {
        const jobs = await jobService.getAll()
        // Get the 3 most recent jobs as featured
        const featured = jobs
          .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
          .slice(0, 3)
        setFeaturedJobs(featured)
      } catch (err) {
        console.error('Failed to load featured jobs:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedJobs()
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (location) params.set('location', location)
    
    navigate(`/jobs?${params.toString()}`)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-white"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Find Your Dream Job Today
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover thousands of job opportunities and take the next step in your career
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-2 shadow-lg">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <ApperIcon name="Search" className="absolute left-3 top-3 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Job title, company, or keywords"
                  className="w-full pl-10 pr-4 py-3 text-surface-800 rounded-lg border-0 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="flex-1 relative">
                <ApperIcon name="MapPin" className="absolute left-3 top-3 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="City, state, or remote"
                  className="w-full pl-10 pr-4 py-3 text-surface-800 rounded-lg border-0 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:brightness-90 transition-all flex items-center justify-center"
              >
                <ApperIcon name="Search" className="w-5 h-5 mr-2" />
                Search Jobs
              </motion.button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
          {[
            { label: 'Active Jobs', value: '500+', icon: 'Briefcase' },
            { label: 'Companies', value: '150+', icon: 'Building' },
            { label: 'Job Seekers', value: '10K+', icon: 'Users' },
            { label: 'Success Rate', value: '95%', icon: 'TrendingUp' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="text-center"
            >
              <div className="bg-white/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-blue-100 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Featured Jobs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-heading text-surface-800">
            Featured Jobs
          </h2>
          <button
            onClick={() => navigate('/jobs')}
            className="text-primary hover:text-secondary font-medium transition-colors"
          >
            View All Jobs →
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-surface-200 rounded w-3/4"></div>
                  <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                  <div className="h-4 bg-surface-200 rounded w-full"></div>
                  <div className="h-4 bg-surface-200 rounded w-2/3"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/jobs?id=${job.id}`)}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <ApperIcon name="Briefcase" className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                    New
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-surface-800 mb-2 group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <p className="text-surface-600 mb-3">{job.company}</p>

                <div className="flex items-center text-sm text-surface-500 mb-4">
                  <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                  <span className="mr-4">{job.location}</span>
                  <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                  <span>{job.type}</span>
                </div>

                <p className="text-surface-700 text-sm mb-4 line-clamp-2">
                  {job.description}
                </p>

                {job.salary && (
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary">
                      ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-primary hover:text-secondary transition-colors"
                    >
                      <ApperIcon name="ArrowRight" className="w-5 h-5" />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-accent/10 rounded-xl p-8 text-center"
      >
        <h2 className="text-2xl font-bold font-heading text-surface-800 mb-4">
          Ready to Start Your Job Search?
        </h2>
        <p className="text-surface-600 mb-6 max-w-2xl mx-auto">
          Create your profile, upload your resume, and start applying to jobs that match your skills and interests.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/profile')}
            className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:brightness-90 transition-all"
          >
            Complete Your Profile
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/jobs')}
            className="border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-white transition-all"
          >
            Browse All Jobs
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default MainFeature