import { ContentType, Locale } from "contentful";
interface Options {
    namespace?: string;
    localization?: boolean;
}
export default function render(contentTypes: ContentType[], locales: Locale[], { namespace, localization }?: Options): Promise<string>;
export {};
