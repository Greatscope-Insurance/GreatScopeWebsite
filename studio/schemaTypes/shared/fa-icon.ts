import { defineField } from 'sanity'

// Font Awesome icon class, e.g. "fas fa-heartbeat". Shown as a plain string
// because the frontend renders these with Font Awesome directly.
export const faIcon = defineField({
  name: 'icon',
  title: 'Icon (Font Awesome)',
  type: 'string',
  description: 'Font Awesome class, e.g. "fas fa-heartbeat"',
  validation: (rule) => rule.required(),
})
