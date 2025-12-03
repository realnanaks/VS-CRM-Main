import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    securityLevel: 'loose',
    themeVariables: {
        fontFamily: 'Inter, sans-serif',
        primaryColor: '#e0e7ff',
        primaryTextColor: '#3730a3',
        primaryBorderColor: '#6366f1',
        lineColor: '#64748b',
        secondaryColor: '#f0fdf4',
        tertiaryColor: '#fff1f2',
    }
});

interface MermaidProps {
    chart: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderChart = async () => {
            if (containerRef.current) {
                try {
                    containerRef.current.innerHTML = chart;
                    await mermaid.run({
                        nodes: [containerRef.current]
                    });
                } catch (error) {
                    console.error("Mermaid rendering failed:", error);
                }
            }
        };

        renderChart();
    }, [chart]);

    return <div ref={containerRef} className="w-full flex justify-center" />;
};
