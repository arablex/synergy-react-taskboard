import { formatEstimate } from '../../utils/time'

/** Время выполнения в виде «6ч» или «1д.6ч» */
export function EstimateBadge({ hours }: { hours: number }) {
  return (
    <span className="badge badge--time" title={`${hours} ч`}>
      {formatEstimate(hours)}
    </span>
  )
}
