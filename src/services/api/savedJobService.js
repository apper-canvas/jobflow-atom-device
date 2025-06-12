import savedJobsData from '../mockData/savedJobs.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class SavedJobService {
  constructor() {
    this.savedJobs = [...savedJobsData]
  }

  async getAll() {
    await delay(250)
    return [...this.savedJobs]
  }

  async getById(id) {
    await delay(200)
    const savedJob = this.savedJobs.find(s => s.jobId === id)
    if (!savedJob) {
      throw new Error('Saved job not found')
    }
    return { ...savedJob }
  }

  async create(savedJobData) {
    await delay(300)
    const newSavedJob = {
      id: Date.now().toString(),
      ...savedJobData,
      savedDate: savedJobData.savedDate || new Date().toISOString()
    }
    this.savedJobs.push(newSavedJob)
    return { ...newSavedJob }
  }

  async update(id, updates) {
    await delay(300)
    const index = this.savedJobs.findIndex(s => s.jobId === id)
    if (index === -1) {
      throw new Error('Saved job not found')
    }
    this.savedJobs[index] = { ...this.savedJobs[index], ...updates }
    return { ...this.savedJobs[index] }
  }

  async delete(jobId) {
    await delay(250)
    const index = this.savedJobs.findIndex(s => s.jobId === jobId)
    if (index === -1) {
      throw new Error('Saved job not found')
    }
    this.savedJobs.splice(index, 1)
    return { success: true }
  }
}

export default new SavedJobService()