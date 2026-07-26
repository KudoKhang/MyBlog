/**
 * Reading Time Helper
 * Calculates estimated reading time based on word count
 * Average reading speed: 200 words per minute
 */

hexo.extend.helper.register('reading_time', function (content) {
    if (!content) return '';

    // Strip HTML tags and get plain text
    const plainText = content.replace(/<[^>]+>/g, '');

    // Count words (works for both English and Vietnamese)
    // For Vietnamese, we count characters and divide by average word length
    const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;

    // Calculate reading time (200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);

    // Return formatted reading time
    if (readingTime < 1) {
        return '<span class="reading-time">< 1 min read</span>';
    } else if (readingTime === 1) {
        return '<span class="reading-time">1 min read</span>';
    } else {
        return `<span class="reading-time">${readingTime} min read</span>`;
    }
});

/**
 * Word Count Helper
 * Returns the word count of content
 */
hexo.extend.helper.register('word_count', function (content) {
    if (!content) return 0;

    const plainText = content.replace(/<[^>]+>/g, '');
    return plainText.split(/\s+/).filter(word => word.length > 0).length;
});
