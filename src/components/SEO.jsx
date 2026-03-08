import { Helmet } from "react-helmet-async";

/**
 * SEO Component — drop into any page component.
 *
 * Props:
 *  - title        : Page-specific title (appended with site name)
 *  - description  : Meta description for this page
 *  - keywords     : Comma-separated extra keywords (merged with site defaults)
 *  - image        : OG image URL (defaults to site OG image)
 *  - canonical    : Canonical URL for this page
 *  - noIndex      : If true, sets noindex,nofollow (e.g. admin/auth pages)
 */

const SITE_NAME = "TN Temples";
const DEFAULT_DESCRIPTION =
    "Explore thousands of ancient Hindu temples across Tamil Nadu. A community-driven platform to document, preserve, and celebrate Tamil Nadu's sacred architectural heritage.";
const DEFAULT_IMAGE = "https://tntemples.in/og-image.jpg";
const BASE_URL = "https://tntemples.in";

const SEO = ({
    title,
    description = DEFAULT_DESCRIPTION,
    keywords = "",
    image = DEFAULT_IMAGE,
    canonical,
    noIndex = false,
}) => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Discover Tamil Nadu's Sacred Heritage`;
    const baseKeywords = "Tamil Nadu temples, Hindu temples, south India temples, temple heritage, gopuram, Tamil culture, sacred sites";
    const allKeywords = keywords ? `${keywords}, ${baseKeywords}` : baseKeywords;
    const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined;

    return (
        <Helmet>
            {/* Primary */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={allKeywords} />
            <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={SITE_NAME} />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;
