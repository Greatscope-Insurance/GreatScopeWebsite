import { defineType, defineField } from 'sanity'
import { DocumentIcon } from '@sanity/icons'
import { faIcon } from '../shared/fa-icon'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({ name: 'leaderName', title: 'Leader name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'leaderTitle', title: 'Leader title', type: 'string' }),
    defineField({ name: 'leaderImage', title: 'Leader image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'leaderBio',
      title: 'Leader bio (paragraphs)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'aboutParagraphs',
      title: 'About paragraphs',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'visionTitle', title: 'Vision title', type: 'string' }),
    defineField({ name: 'visionText', title: 'Vision text', type: 'text', rows: 4 }),
    defineField({ name: 'missionTitle', title: 'Mission title', type: 'string' }),
    defineField({ name: 'missionText', title: 'Mission text', type: 'text', rows: 4 }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            faIcon,
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          ],
        },
      ],
    }),
    defineField({
      name: 'keyNumbers',
      title: 'Key numbers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', description: 'e.g. 234+', validation: (r) => r.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
          ],
        },
      ],
    }),
  ],
})
