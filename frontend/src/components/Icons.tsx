'use client';

/**
 * Icon Components - Using Hugeicons
 * Centralized icon exports with proper component syntax
 */
import { HugeiconsIcon } from '@hugeicons/react';
import {
    BarChartIcon,
    Camera01Icon,
    AlertCircleIcon,
    CloudUploadIcon,
    Target01Icon,
    FilterHorizontalIcon,
    Database01Icon,
    SecurityCheckIcon,
    ArrowUpRight01Icon,
    Tick01Icon,
    Cancel01Icon,
    Loading03Icon,
    GameController01Icon,
    GridIcon,
    PieChartIcon,
} from '@hugeicons/core-free-icons';

// Type for icon props
interface IconWrapperProps {
    size?: number;
    color?: string;
    className?: string;
}

// Pre-configured icon components
export function ChartIcon({ size = 20, color = 'currentColor', className }: IconWrapperProps) {
    return <HugeiconsIcon icon={BarChartIcon} size={size} color={color} className={className} />;
}

export function CameraIcon({ size = 20, color = 'currentColor', className }: IconWrapperProps) {
    return <HugeiconsIcon icon={Camera01Icon} size={size} color={color} className={className} />;
}

export function AlertIcon({ size = 20, color = 'currentColor', className }: IconWrapperProps) {
    return <HugeiconsIcon icon={AlertCircleIcon} size={size} color={color} className={className} />;
}

export function UploadIcon({ size = 20, color = 'currentColor', className }: IconWrapperProps) {
    return <HugeiconsIcon icon={CloudUploadIcon} size={size} color={color} className={className} />;
}

export function TargetIcon({ size = 20, color = 'currentColor', className }: IconWrapperProps) {
    return <HugeiconsIcon icon={Target01Icon} size={size} color={color} className={className} />;
}

export function FilterIcon({ size = 20, color = 'currentColor', className }: IconWrapperProps) {
    return <HugeiconsIcon icon={FilterHorizontalIcon} size={size} color={color} className={className} />;
}

export function DatabaseIcon({ size = 20, color = 'currentColor', className }: IconWrapperProps) {
    return <HugeiconsIcon icon={Database01Icon} size={size} color={color} className={className} />;
}

export function ShieldIcon({ size = 20, color = 'currentColor', className }: IconWrapperProps) {
    return <HugeiconsIcon icon={SecurityCheckIcon} size={size} color={color} className={className} />;
}

export function ExternalLinkIcon({ size = 20, color = 'currentColor', className }: IconWrapperProps) {
    return <HugeiconsIcon icon={ArrowUpRight01Icon} size={size} color={color} className={className} />;
}

export function CheckIcon({ size = 20, color = 'currentColor', className }: IconWrapperProps) {
    return <HugeiconsIcon icon={Tick01Icon} size={size} color={color} className={className} />;
}

export function CloseIcon({ size = 20, color = 'currentColor', className }: IconWrapperProps) {
    return <HugeiconsIcon icon={Cancel01Icon} size={size} color={color} className={className} />;
}

export function SpinnerIcon({ size = 20, color = 'currentColor', className }: IconWrapperProps) {
    return <HugeiconsIcon icon={Loading03Icon} size={size} color={color} className={className} />;
}

export function DiceIcon({ size = 20, color = 'currentColor', className }: IconWrapperProps) {
    return <HugeiconsIcon icon={GameController01Icon} size={size} color={color} className={className} />;
}

export function GridViewIcon({ size = 20, color = 'currentColor', className }: IconWrapperProps) {
    return <HugeiconsIcon icon={GridIcon} size={size} color={color} className={className} />;
}

export function PieIcon({ size = 20, color = 'currentColor', className }: IconWrapperProps) {
    return <HugeiconsIcon icon={PieChartIcon} size={size} color={color} className={className} />;
}
