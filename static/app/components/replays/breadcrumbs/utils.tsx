import {BreadcrumbType, Crumb} from 'sentry/types/breadcrumbs';

/**
 * Generate breadcrumb descriptions based on type
 */
export function getDescription(crumb: Crumb, startTimestampMs?: number) {
  if (crumb.data && 'action' in crumb.data) {
    switch (crumb.data.action) {
      case 'largest-contentful-paint':
        if (crumb.timestamp && startTimestampMs) {
          return `${new Date(crumb.timestamp).getTime() - startTimestampMs}ms`;
        }
        break;
      default:
        break;
    }
  }

  switch (crumb.type) {
    case BreadcrumbType.NAVIGATION:
      return `${crumb.data?.to ?? ''}`;
    case BreadcrumbType.DEFAULT:
      return JSON.stringify(crumb.data);
    default:
      return crumb.message || '';
  }
}

/**
 * Get title of breadcrumb
 */
export function getTitle(crumb: Crumb) {
  const [type, action] = crumb.category?.split('.') || [];

  // Supports replay specific breadcrumbs
  if (crumb.data && 'label' in crumb.data) {
    return crumb.data.label;
  }

  return `${type === 'ui' ? 'User' : type} ${action || ''}`;
}

/**
 * Generate breadcrumb title + descriptions
 */
export function getDetails(crumb: Crumb, startTimestampMs?: number) {
  return {title: getTitle(crumb), description: getDescription(crumb, startTimestampMs)};
}
