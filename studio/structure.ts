import type { StructureBuilder } from 'sanity/structure'
import { CogIcon, HomeIcon, DocumentIcon } from '@sanity/icons'

const singletonIds = ['siteSettings', 'homePage', 'aboutPage']

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Site-wide settings first
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),
      S.listItem()
        .title('Home Page')
        .icon(HomeIcon)
        .child(
          S.document().schemaType('homePage').documentId('homePage').title('Home Page')
        ),
      S.listItem()
        .title('About Page')
        .icon(DocumentIcon)
        .child(
          S.document().schemaType('aboutPage').documentId('aboutPage').title('About Page')
        ),
      S.divider(),
      // Ordinary documents
      ...S.documentTypeListItems().filter(
        (item) => !singletonIds.includes(String(item.getId()))
      ),
    ])
