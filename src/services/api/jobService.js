import jobsData from '../mockData/jobs.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class JobService {
  constructor() {
    this.jobs = [...jobsData]
  }

  async getAll() {
    await delay(300)
    return [...this.jobs]
  }

  async getById(id) {
    await delay(200)
    const job = this.jobs.find(j => j.id === id)
    if (!job) {
      throw new Error('Job not found')
    }
    return { ...job }
  }

  async create(jobData) {
    await delay(400)
    const newJob = {
      id: Date.now().toString(),
      ...jobData,
      postedDate: new Date().toISOString()
    }
    this.jobs.push(newJob)
    return { ...newJob }
  }

  async update(id, updates) {
    await delay(350)
    const index = this.jobs.findIndex(j => j.id === id)
    if (index === -1) {
      throw new Error('Job not found')
    }
    this.jobs[index] = { ...this.jobs[index], ...updates }
    return { ...this.jobs[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.jobs.findIndex(j => j.id === id)
    if (index === -1) {
      throw new Error('Job not found')
    }
    this.jobs.splice(index, 1)
    return { success: true }
  }
}

export default new JobService()