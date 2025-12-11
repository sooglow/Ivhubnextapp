//public/components/SafeHtmlComponent.tsx
import React from "react";
import DOMPurify from "dompurify";

interface SafeHtmlProps {
    html: string;
    className?: string;
}

function SafeHtmlComponent({
    html,
    className = "pt-4 whitespace-pre-wrap",
}: SafeHtmlProps): React.ReactElement {
    const cleanHtml = html ? DOMPurify.sanitize(html) : "";

    return <div className={className} dangerouslySetInnerHTML={{ __html: cleanHtml }}></div>;
}

export default SafeHtmlComponent;
