import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { applicationService, userService } from '../services'

const JobDetails = ({ job, isSaved, onSave }) => {
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resumeUrl: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleApply = async () => {
    if (!applicationData.coverLetter.trim()) {
      toast.error('Please write a cover letter')
      return
    }

    setSubmitting(true)
    try {
      // In a real app, we'd get the current user's resume
      const user = await userService.getById('user1')
      
      const application = await applicationService.create({
        userId: 'user1',
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        resumeUrl: user.resumeUrl || 'default-resume.pdf',
        coverLetter: applicationData.coverLetter,
        status: 'pending',
        appliedDate: new Date().toISOString()
      })

      toast.success('Application submitted successfully!')
      setShowApplicationModal(false)
      setApplicationData({ coverLetter: '', resumeUrl: '' })
    } catch (err) {
      toast.error('Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="h-full overflow-y-auto p-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold font-heading text-surface-800 mb-2 break-words">
              {job.title}
            </h1>
            <p className="text-xl text-surface-600 mb-4 break-words">{job.company}</p>
            <div className="flex flex-wrap items-center gap-4 text-surface-500">
              <span className="flex items-center">
                <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                {job.location}
              </span>
              <span className="flex items-center">
                <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
                {job.type}
              </span>
              <span className="flex items-center">
                <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                Posted {new Date(job.postedDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSave}
              className={`p-2 rounded-lg transition-colors ${
                isSaved 
                  ? 'bg-accent/10 text-accent' 
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              <ApperIcon name={isSaved ? "Bookmark" : "BookmarkPlus"} className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Salary */}
        {job.salary && (
          <div className="bg-primary/5 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <ApperIcon name="DollarSign" className="w-5 h-5 text-primary mr-2" />
              <span className="text-lg font-semibold text-primary">
                ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()}
              </span>
              <span className="text-surface-600 ml-2">per year</span>
            </div>
          </div>
        )}

        {/* Apply Button */}
        <div className="mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowApplicationModal(true)}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:brightness-90 transition-all"
          >
            Apply for this Position
          </motion.button>
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-surface-800 mb-3">Job Description</h2>
          <div className="prose prose-sm max-w-none text-surface-700 break-words">
            {job.description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-3">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-surface-800 mb-3">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <ApperIcon name="CheckCircle" className="w-4 h-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-surface-700 break-words">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Application Deadline */}
        {job.applicationDeadline && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-center">
              <ApperIcon name="AlertCircle" className="w-5 h-5 text-warning mr-2" />
              <span className="text-warning font-medium">
                Application deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Application Modal */}
      <AnimatePresence>
        {showApplicationModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowApplicationModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-surface-800">
                      Apply to {job.title}
                    </h2>
                    <button
                      onClick={() => setShowApplicationModal(false)}
                      className="text-surface-400 hover:text-surface-600 transition-colors"
                    >
                      <ApperIcon name="X" className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Job Summary */}
                    <div className="bg-surface-50 rounded-lg p-4">
                      <h3 className="font-medium text-surface-800 mb-2">{job.title}</h3>
                      <p className="text-surface-600 mb-2">{job.company}</p>
                      <div className="flex items-center text-sm text-surface-500">
                        <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                        <span>{job.location}</span>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Cover Letter *
                      </label>
                      <textarea
                        value={applicationData.coverLetter}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                        rows={6}
                        placeholder="Write a compelling cover letter that highlights your relevant experience and why you're interested in this position..."
                        className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Resume Info */}
                    <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                      <div className="flex items-center">
                        <ApperIcon name="FileText" className="w-5 h-5 text-info mr-2" />
                        <div>
                          <p className="text-info font-medium">Your resume will be attached</p>
                          <p className="text-info/80 text-sm">Make sure your profile is complete and resume is up to date</p>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowApplicationModal(false)}
                        className="px-4 py-2 text-surface-600 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleApply}
                        disabled={submitting || !applicationData.coverLetter.trim()}
                        className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:brightness-90 transition-all disabled:opacity-50"
                      >
                        {submitting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </div>
                        ) : (
                          'Submit Application'
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default JobDetails