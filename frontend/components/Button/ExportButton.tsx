import React, { FC } from 'react'
import { Icon } from '@iconify/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface buttonProps{
    handleClick: () => void;
}

const ExportButton: FC<buttonProps> = ({ handleClick }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        className="ml-4 w-[38px] justify-center h-[38px] space-x-2 bg-subprimary text-[#2C3038] flex items-center rounded-md cursor-pointer"
                        onClick={handleClick}
                    >
                        <Icon icon={"octicon:download-16"} fontSize={21} />
                    </button>
                </TooltipTrigger>
                <TooltipContent className='border-none'>
                    <p>Export CSV</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default ExportButton