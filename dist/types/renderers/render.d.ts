import { ContentType, Locale } from "contentful";
interface Options {
    localization?: boolean;
    namespace?: string;
}
export default function render(contentTypes: ContentType[], locales: Locale[], { localization, namespace }?: Options): Promise<string>;
export {};
