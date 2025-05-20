import React, { FC } from 'react'
import { Icon } from '@iconify/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface buttonProps {
    handleClick: () => void;
    hoverText: string
}

const AddButton: FC<buttonProps> = ({ handleClick, hoverText }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={handleClick}
                        className="main-dark-button"
                    >
                        <Icon icon="zondicons:add-outline" />
                    </button>
                </TooltipTrigger>
                <TooltipContent className='border-none'>
                    <p>{hoverText}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default AddButton