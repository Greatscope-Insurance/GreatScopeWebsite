import { defineCliConfig } from 'sanity/cli'

const projectId = '10dparpu'
const dataset = 'production'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
})
