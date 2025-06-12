import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
          className="mb-8"
        >
          <ApperIcon name="FileQuestion" className="w-24 h-24 text-surface-400 mx-auto" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold text-surface-800 mb-4"
        >
          404
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-surface-700 mb-2"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-surface-600 mb-8 max-w-md mx-auto"
        >
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:brightness-90 transition-all"
          >
            <ApperIcon name="Home" className="w-4 h-4 mr-2" />
            Go to Dashboard
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/jobs')}
            className="flex items-center justify-center px-6 py-3 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-all"
          >
            <ApperIcon name="Briefcase" className="w-4 h-4 mr-2" />
            Browse Jobs
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound