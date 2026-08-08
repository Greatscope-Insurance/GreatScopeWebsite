import { defineType, defineField } from 'sanity'
import { CommentIcon } from '@sanity/icons'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (r) => r.min(0).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'avatarUrl',
      title: 'Avatar Image URL',
      type: 'url',
      validation: (r) => r.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
  ],
})
