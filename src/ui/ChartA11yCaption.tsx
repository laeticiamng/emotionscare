import { useEffect, useId } from 'react';

export interface ChartA11yCaptionProps {
  figureId: string;
  title: string;
  description: string;
  insights?: string[];
  recommendations?: string[];
}

export function ChartA11yCaption({
  figureId,
  title,
  description,
  insights = [],
  recommendations = []
}: ChartA11yCaptionProps) {
  const captionId = useId();

  useEffect(() => {
    const figure = document.getElementById(figureId);
    if (!figure) {
      return;
    }

    const existing = new Set(
      (figure.getAttribute('aria-describedby') ?? '')
        .split(' ')
        .map((value) => value.trim())
        .filter(Boolean)
    );
    existing.add(captionId);
    figure.setAttribute('aria-describedby', Array.from(existing).join(' '));

    return () => {
      const finalFigure = document.getElementById(figureId);
      if (!finalFigure) {
        return;
      }
      const withoutCaption = (finalFigure.getAttribute('aria-describedby') ?? '')
        .split(' ')
        .map((value) => value.trim())
        .filter((value) => value && value !== captionId);
      if (withoutCaption.length > 0) {
        finalFigure.setAttribute('aria-describedby', withoutCaption.join(' '));
      } else {
        finalFigure.removeAttribute('aria-describedby');
      }
    };
  }, [captionId, figureId]);

  return (
    <figcaption id={captionId} className="ec-chart-caption">
      <strong>{title}</strong>
      <p>{description}</p>
      {insights.length > 0 ? (
        <ul>
          {insights.map((insight) => (
            <li key={insight}>{insight}</li>
          ))}
        </ul>
      ) : null}
      {recommendations.length > 0 ? (
        <ul>
          {recommendations.map((recommendation) => (
            <li key={recommendation}>{recommendation}</li>
          ))}
        </ul>
      ) : null}
    </figcaption>
  );
}
