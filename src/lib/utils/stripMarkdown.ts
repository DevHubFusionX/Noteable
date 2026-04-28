/** Remove markdown syntax and HTML tags for plain-text previews */
export const stripMarkdown = (md: string): string =>
  md
    .replace(/<[^>]+>/g, " ")          // strip HTML tags
    .replace(/#{1,6}\s+/g, "")          // headings
    .replace(/\*\*(.+?)\*\*/g, "$1")    // bold
    .replace(/_(.+?)_/g, "$1")          // italic
    .replace(/~~(.+?)~~/g, "$1")        // strikethrough
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // code
    .replace(/^>\s+/gm, "")            // blockquotes
    .replace(/^[-*+]\s+/gm, "")        // bullet lists
    .replace(/^\d+\.\s+/gm, "")        // numbered lists
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")// links
    .replace(/!\[.*?\]\(.+?\)/g, "")   // images
    .replace(/[-]{3,}/g, "")           // hr
    .replace(/\n+/g, " ")              // newlines → space
    .replace(/\s+/g, " ")              // collapse spaces
    .trim();
