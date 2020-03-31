import render from "../../src/renderers/render"
import { ContentType, Sys, Locale } from "contentful"

describe("render()", () => {
  const contentTypes: ContentType[] = [
    {
      sys: {
        id: "myContentType",
      } as Sys,
      fields: [
        {
          id: "arrayField",
          name: "Array field",
          required: true,
          validations: [{}],
          items: {
            type: "Symbol",
            validations: [
              {
                in: ["one", "of", "the", "above"],
              },
            ],
          },
          disabled: false,
          omitted: false,
          localized: false,
          type: "Array",
        },
      ],
      description: "",
      displayField: "",
      name: "",
      toPlainObject: () => ({} as ContentType),
    },
  ]

  const locales: Locale[] = [
    {
      name: "English (US)",
      fallbackCode: null,
      code: "en-US",
      default: true,
      sys: {} as Locale["sys"],
    },
    {
      name: "Brazilian Portuguese",
      fallbackCode: "en-US",
      code: "pt-BR",
      default: false,
      sys: {} as Locale["sys"],
    },
  ]

  it("renders a given content type", async () => {
    expect(await render(contentTypes, locales)).toMatchInlineSnapshot(`
            "// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY IT.

            import { Asset, Entry } from \\"contentful\\"
            import { Document } from \\"@contentful/rich-text-types\\"

            export interface IMyContentTypeFields {
              /** Array field */
              arrayField: (\\"one\\" | \\"of\\" | \\"the\\" | \\"above\\")[]
            }

            export interface IMyContentType extends Entry<IMyContentTypeFields> {
              sys: {
                id: string
                type: string
                createdAt: string
                updatedAt: string
                locale: string
                contentType: {
                  sys: {
                    id: \\"myContentType\\"
                    linkType: \\"ContentType\\"
                    type: \\"Link\\"
                  }
                }
              }
            }

            export type CONTENT_TYPE = \\"myContentType\\"

            export type LOCALE_CODE = \\"en-US\\" | \\"pt-BR\\"

            export type CONTENTFUL_DEFAULT_LOCALE_CODE = \\"en-US\\"
            "
        `)
  })

  it("renders a given localized content type", async () => {
    const contentTypes: ContentType[] = [
      {
        sys: {
          id: "myContentType",
        } as Sys,
        fields: [
          {
            id: "arrayField",
            name: "Array field",
            required: true,
            validations: [{}],
            items: {
              type: "Symbol",
              validations: [
                {
                  in: ["one", "of", "the", "above"],
                },
              ],
            },
            disabled: false,
            omitted: false,
            localized: false,
            type: "Array",
          },
        ],
        description: "",
        displayField: "",
        name: "",
        toPlainObject: () => ({} as ContentType),
      },
    ]

    expect(await render(contentTypes, locales, { localization: true })).toMatchInlineSnapshot(`
      "// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY IT.

      import { Entry } from \\"contentful\\"
      import { Document } from \\"@contentful/rich-text-types\\"

      export interface IMyContentTypeFields {
        /** Array field */
        arrayField: LocalizedField<(\\"one\\" | \\"of\\" | \\"the\\" | \\"above\\")[]>
      }

      export interface IMyContentType extends Entry<IMyContentTypeFields> {
        sys: {
          id: string
          type: string
          createdAt: string
          updatedAt: string
          locale: string
          contentType: {
            sys: {
              id: \\"myContentType\\"
              linkType: \\"ContentType\\"
              type: \\"Link\\"
            }
          }
        }
      }

      export type CONTENT_TYPE = \\"myContentType\\"

      export type LOCALE_CODE = \\"en-US\\" | \\"pt-BR\\"

      export type CONTENTFUL_DEFAULT_LOCALE_CODE = \\"en-US\\"

      export type LocalizedField<T> = Partial<Record<LOCALE_CODE, T>>

      // We have to use our own localized version of Asset because of a bug in contentful https://github.com/contentful/contentful.js/issues/208
      export interface Asset {
        sys: Sys
        fields: {
          title: string
          description: string
          file: {
            url: string
            details: {
              size: number
              image?: {
                width: number
                height: number
              }
            }
            fileName: string
            contentType: string
          }
        }
        toPlainObject(): object
      }
      "
    `)
  })

  it("renders given a content type inside a namespace", async () => {
    expect(await render(contentTypes, locales, { namespace: "Codegen" })).toMatchInlineSnapshot(`
      "// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY IT.

      import { Asset, Entry } from \\"contentful\\"
      import { Document } from \\"@contentful/rich-text-types\\"

      declare namespace Codegen {
        export interface IMyContentTypeFields {
          /** Array field */
          arrayField: (\\"one\\" | \\"of\\" | \\"the\\" | \\"above\\")[]
        }

        export interface IMyContentType extends Entry<IMyContentTypeFields> {
          sys: {
            id: string
            type: string
            createdAt: string
            updatedAt: string
            locale: string
            contentType: {
              sys: {
                id: \\"myContentType\\"
                linkType: \\"ContentType\\"
                type: \\"Link\\"
              }
            }
          }
        }

        export type CONTENT_TYPE = \\"myContentType\\"

        export type LOCALE_CODE = \\"en-US\\" | \\"pt-BR\\"

        export type CONTENTFUL_DEFAULT_LOCALE_CODE = \\"en-US\\"
      }

      export as namespace Codegen
      export = Codegen
      "
    `)
  })
})
