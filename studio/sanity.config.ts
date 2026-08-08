import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'
import { structure } from './structure'

const projectId = '10dparpu'
const dataset = 'production'

export default defineConfig({
  name: 'greatscope',
  title: 'Greatscope Insurance Agency',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool({ structure })],
  schema: { types: schemaTypes },
})
