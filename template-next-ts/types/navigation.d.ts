interface navlink {
    name: string,
    route: string
}

interface sidebarLinks extends navlink {
    icon:string;
}

type NAV_LINKSDto = navlink[]

type NavItem = {
    name: string;
    href?: string;
    icon?: string;
    subItems?: Omit<NavItem[], 'subItems'>;
} 

type Language = {
    icon: string,
    locale: string,
    name: string
}

type LANGUAGESDto = Language[]