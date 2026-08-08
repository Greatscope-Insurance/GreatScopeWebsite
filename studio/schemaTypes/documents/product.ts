import { defineType, defineField } from 'sanity'
import { PackageIcon } from '@sanity/icons'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'key',
      title: 'Key (stable identifier)',
      type: 'string',
      description: 'Stable slug used to identify/upsert this product across imports, e.g. "motor-insurance"',
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'productCategory' }],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? (subtitle as unknown as { title?: string }).title : '' }
    },
  },
})
