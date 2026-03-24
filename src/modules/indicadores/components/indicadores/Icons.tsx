import React from 'react';
import {
    LightBulbIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    AcademicCapIcon,
    CheckBadgeIcon,
    ChevronDownIcon,
    ChartBarIcon,
    UserGroupIcon, // Replacement for Handshake
    UsersIcon,
    TrophyIcon,
    CheckIcon,
    XMarkIcon,
    ArrowDownTrayIcon,
    ArrowsRightLeftIcon, // Replacement for GitCompareArrows
    SunIcon,
    MoonIcon,
    QuestionMarkCircleIcon, // Fallback icon
} from '@heroicons/react/24/outline';

// A map of icon names to their corresponding Heroicons components
const ICONS: { [key: string]: React.ElementType<React.SVGProps<SVGSVGElement>> } = {
  lightbulb: LightBulbIcon,
  loader: ArrowPathIcon,
  alertTriangle: ExclamationTriangleIcon,
  search: MagnifyingGlassIcon,
  academicCap: AcademicCapIcon,
  mortarboard: AcademicCapIcon, // Alias
  badgeCheck: CheckBadgeIcon,
  chevronDown: ChevronDownIcon,
  barChart: ChartBarIcon,
  handshake: UserGroupIcon,
  people: UsersIcon,
  trophy: TrophyIcon,
  check: CheckIcon,
  x: XMarkIcon,
  download: ArrowDownTrayIcon,
  compare: ArrowsRightLeftIcon,
  sun: SunIcon,
  moon: MoonIcon,
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

export const Icon: React.FC<IconProps> = ({ name, strokeWidth = 1.5, ...props }) => {
  const HeroIcon = ICONS[name] || QuestionMarkCircleIcon;
  return <HeroIcon strokeWidth={strokeWidth} {...props} />;
};