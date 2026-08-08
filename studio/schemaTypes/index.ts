import type { SchemaTypeDefinition } from 'sanity'

import { productCategory } from './documents/product-category'
import { product } from './documents/product'
import { partner } from './documents/partner'
import { testimonial } from './documents/testimonial'
import { faq } from './documents/faq'
import { siteSettings } from './singletons/site-settings'
import { homePage } from './singletons/home-page'
import { aboutPage } from './singletons/about-page'

export const schemaTypes: SchemaTypeDefinition[] = [
  productCategory,
  product,
  partner,
  testimonial,
  faq,
  siteSettings,
  homePage,
  aboutPage,
]
