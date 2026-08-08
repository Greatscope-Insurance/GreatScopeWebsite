import { defineType, defineField } from 'sanity'
import { HeartIcon } from '@sanity/icons'

export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  icon: HeartIcon,
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
  ],
})
