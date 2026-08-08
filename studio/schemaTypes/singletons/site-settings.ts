import { defineType, defineField } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({ name: 'phone1', title: 'Phone 1 (display)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'phone1Tel', title: 'Phone 1 (E.164 for links)', type: 'string', description: 'e.g. +254719151288', validation: (r) => r.required() }),
    defineField({ name: 'phone2', title: 'Phone 2 (display)', type: 'string' }),
    defineField({ name: 'phone2Tel', title: 'Phone 2 (E.164 for links)', type: 'string', description: 'e.g. +254797313199' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp number (digits only)', type: 'string', description: 'e.g. 254719151288', validation: (r) => r.required() }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (r) => r.email() }),
    defineField({ name: 'address', title: 'Address', type: 'string' }),
    defineField({ name: 'hours', title: 'Working hours', type: 'string' }),
    defineField({ name: 'footerText', title: 'Footer description', type: 'text', rows: 3 }),
    defineField({
      name: 'socials',
      title: 'Social links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label (twitter/facebook/linkedin/instagram)', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'url', title: 'URL', type: 'url', validation: (r) => r.uri({ scheme: ['http', 'https'] }) }),
          ],
        },
      ],
    }),
  ],
})
