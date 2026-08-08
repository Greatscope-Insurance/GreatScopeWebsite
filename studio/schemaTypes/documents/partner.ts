import { defineType, defineField } from 'sanity'
import { HeartIcon } from '@sanity/icons'

export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  icon: HeartIcon,
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'logoUrl',
      title: 'Logo URL',
      type: 'url',
      validation: (r) => r.uri({ scheme: ['http', 'https'] }).required(),
    }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
  ],
})
