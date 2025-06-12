import usersData from '../mockData/users.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class UserService {
  constructor() {
    this.users = [...usersData]
  }

  async getAll() {
    await delay(300)
    return [...this.users]
  }

  async getById(id) {
    await delay(200)
    const user = this.users.find(u => u.id === id)
    if (!user) {
      throw new Error('User not found')
    }
    return { ...user }
  }

  async create(userData) {
    await delay(400)
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    }
    this.users.push(newUser)
    return { ...newUser }
  }

  async update(id, updates) {
    await delay(350)
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    this.users[index] = { ...this.users[index], ...updates }
    return { ...this.users[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    this.users.splice(index, 1)
    return { success: true }
  }
}

export default new UserService()