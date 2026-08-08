import { defineType, defineField } from 'sanity'
import { HomeIcon } from '@sanity/icons'
import { faIcon } from '../shared/fa-icon'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'heroSlides',
      title: 'Hero slides',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Eyebrow label', type: 'string' }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3 }),
            defineField({ name: 'imageUrl', title: 'Background image URL', type: 'url', validation: (r) => r.uri({ scheme: ['http', 'https'] }) }),
            defineField({ name: 'exploreHref', title: 'Explore products link', type: 'string', description: 'e.g. insurance.html#health-insurance' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            faIcon,
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'href', title: 'Link', type: 'string', description: 'e.g. insurance.html#health-insurance' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'howItWorks',
      title: 'How it works (steps)',
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
      name: 'whyUs',
      title: 'Why choose us',
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
      name: 'stats',
      title: 'Stats strip',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', description: 'e.g. 12+', validation: (r) => r.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
          ],
        },
      ],
    }),
  ],
})
