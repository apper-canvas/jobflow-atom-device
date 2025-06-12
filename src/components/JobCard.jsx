import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from './ApperIcon'

const JobCard = ({ job, isSelected, isSaved, onClick, onSave, company }) => {
  const [showCompanyDetails, setShowCompanyDetails] = useState(false)
  const handleSaveClick = (e) => {
    e.stopPropagation()
    onSave()
  }

  const toggleCompanyDetails = (e) => {
    e.stopPropagation()
    setShowCompanyDetails(!showCompanyDetails)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <ApperIcon key={i} name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <ApperIcon key="half" name="Star" className="w-4 h-4 text-yellow-400 fill-current opacity-50" />
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <ApperIcon key={`empty-${i}`} name="Star" className="w-4 h-4 text-surface-300" />
      )
    }

    return stars
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`bg-white rounded-lg p-6 shadow-sm border-2 cursor-pointer transition-all ${
        isSelected 
          ? 'border-primary shadow-md' 
          : 'border-transparent hover:border-surface-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-surface-800 mb-1 break-words">
            {job.title}
          </h3>
          <div className="flex items-center mb-2">
            <p className="text-surface-600 break-words mr-3">{job.company}</p>
            {company && (
              <button
                onClick={toggleCompanyDetails}
                className="text-primary hover:text-primary-dark text-sm font-medium flex items-center"
              >
                View Company
                <ApperIcon 
                  name={showCompanyDetails ? "ChevronUp" : "ChevronDown"} 
                  className="w-4 h-4 ml-1" 
                />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center text-sm text-surface-500 gap-4">
            <span className="flex items-center">
              <ApperIcon name="MapPin" className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="break-words">{job.location}</span>
            </span>
            <span className="flex items-center">
              <ApperIcon name="Clock" className="w-4 h-4 mr-1 flex-shrink-0" />
              <span>{job.type}</span>
            </span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSaveClick}
          className={`ml-4 p-2 rounded-full transition-colors flex-shrink-0 ${
            isSaved 
              ? 'bg-accent/10 text-accent' 
              : 'bg-surface-100 text-surface-400 hover:bg-surface-200 hover:text-surface-600'
          }`}
        >
          <ApperIcon name={isSaved ? "Bookmark" : "BookmarkPlus"} className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Company Profile Section */}
      <AnimatePresence>
        {showCompanyDetails && company && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 p-4 bg-surface-50 rounded-lg border border-surface-200"
          >
            <div className="flex items-start space-x-4">
              <img 
                src={company.logo} 
                alt={`${company.name} logo`}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-surface-800 mb-1">{company.name}</h4>
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-3">
                    {renderStars(company.rating)}
                    <span className="ml-1 text-sm text-surface-600">
                      {company.rating} ({company.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                <p className="text-sm text-surface-600 mb-3 line-clamp-2">
                  {company.mission}
                </p>
                {company.quickFacts && company.quickFacts.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-surface-700">Quick Facts:</p>
                    <div className="flex flex-wrap gap-2">
                      {company.quickFacts.slice(0, 2).map((fact, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white text-surface-600 text-xs rounded border"
                        >
                          {fact}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-surface-700 text-sm mb-4 line-clamp-2 break-words">
        {job.description}
      </p>

      <div className="flex items-center justify-between">
        {job.salary && (
          <div className="text-primary font-semibold">
            ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()}
          </div>
        )}
        <div className="flex items-center text-xs text-surface-500">
          <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
          <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
        </div>
      </div>

      {job.requirements && job.requirements.length > 0 && (
        <div className="mt-4 pt-4 border-t border-surface-200">
          <div className="flex flex-wrap gap-2">
            {job.requirements.slice(0, 3).map((req, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-surface-100 text-surface-600 text-xs rounded-full break-words"
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className="px-2 py-1 bg-surface-100 text-surface-600 text-xs rounded-full">
                +{job.requirements.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default JobCard