import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const productCategory = defineType({
  name: 'productCategory',
  title: 'Product Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug (URL anchor)',
      type: 'slug',
      description: 'Must match the section anchor on the products page, e.g. "health-insurance"',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'icon', title: 'Icon (Font Awesome)', type: 'string', description: 'e.g. "fas fa-heartbeat"', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'bannerImageUrl',
      title: 'Banner Image URL',
      type: 'url',
      description: 'URL of the category banner image',
      validation: (r) => r.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
  ],
})
