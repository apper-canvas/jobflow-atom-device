import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from './ApperIcon'

const CompanyCard = ({ company, onClick }) => {
  const [showDetails, setShowDetails] = useState(false)

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

  const toggleDetails = (e) => {
    e.stopPropagation()
    setShowDetails(!showDetails)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="bg-white rounded-lg p-6 shadow-sm border-2 border-transparent hover:border-surface-200 hover:shadow-md cursor-pointer transition-all"
    >
      {/* Company Header */}
      <div className="flex items-start space-x-4 mb-4">
        <img 
          src={company.logo} 
          alt={`${company.name} logo`}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-surface-800 mb-1 break-words">
            {company.name}
          </h3>
          <p className="text-surface-600 text-sm mb-2">{company.industry}</p>
          <div className="flex items-center mb-2">
            <div className="flex items-center mr-4">
              {renderStars(company.rating)}
              <span className="ml-1 text-sm text-surface-600">
                {company.rating}
              </span>
            </div>
            <span className="text-xs text-surface-500">
              {company.reviewCount} reviews
            </span>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="flex flex-wrap items-center text-sm text-surface-500 gap-4 mb-4">
        <span className="flex items-center">
          <ApperIcon name="MapPin" className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="break-words">{company.location}</span>
        </span>
        <span className="flex items-center">
          <ApperIcon name="Users" className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>{company.size} employees</span>
        </span>
        <span className="flex items-center">
          <ApperIcon name="Calendar" className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>Founded {company.founded}</span>
        </span>
      </div>

      {/* Mission */}
      <p className="text-surface-700 text-sm mb-4 line-clamp-2 break-words">
        {company.mission}
      </p>

      {/* Quick Facts */}
      {company.quickFacts && company.quickFacts.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {company.quickFacts.slice(0, 2).map((fact, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-surface-100 text-surface-600 text-xs rounded-full break-words"
              >
                {fact}
              </span>
            ))}
            {company.quickFacts.length > 2 && (
              <span className="px-2 py-1 bg-surface-100 text-surface-600 text-xs rounded-full">
                +{company.quickFacts.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Expandable Details */}
      <div className="flex items-center justify-between">
        <button
          onClick={toggleDetails}
          className="text-primary hover:text-primary-dark text-sm font-medium flex items-center"
        >
          {showDetails ? 'Hide Details' : 'View Details'}
          <ApperIcon 
            name={showDetails ? "ChevronUp" : "ChevronDown"} 
            className="w-4 h-4 ml-1" 
          />
        </button>
        
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-surface-500 hover:text-surface-700 p-1"
          >
            <ApperIcon name="ExternalLink" className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-surface-200 space-y-4"
          >
            {/* History */}
            {company.history && (
              <div>
                <h4 className="font-medium text-surface-800 mb-2">Company History</h4>
                <p className="text-sm text-surface-600">{company.history}</p>
              </div>
            )}

            {/* All Quick Facts */}
            {company.quickFacts && company.quickFacts.length > 2 && (
              <div>
                <h4 className="font-medium text-surface-800 mb-2">Quick Facts</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {company.quickFacts.map((fact, index) => (
                    <div key={index} className="flex items-center text-sm text-surface-600">
                      <ApperIcon name="Check" className="w-3 h-3 mr-2 text-primary flex-shrink-0" />
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Reviews */}
            {company.reviews && company.reviews.length > 0 && (
              <div>
                <h4 className="font-medium text-surface-800 mb-2">Recent Reviews</h4>
                <div className="space-y-3">
                  {company.reviews.slice(0, 2).map((review) => (
                    <div key={review.id} className="bg-surface-50 p-3 rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                          <span className="ml-2 font-medium text-sm text-surface-800">
                            {review.title}
                          </span>
                        </div>
                        <span className="text-xs text-surface-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-surface-600 mb-1">{review.content}</p>
                      <p className="text-xs text-surface-500">- {review.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default CompanyCard