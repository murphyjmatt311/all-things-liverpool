export const getSourceStyles = (source: string): string => {
    switch (source) {
        case 'BBC Sport':
            return 'bg-[#FFD100] text-black';
        case 'The Guardian':
            return 'bg-[#052962] text-white';
        case 'Liverpool Echo':
            return 'bg-[#3C1053] text-white'; // Echo purple
        case 'Liverpool.com':
            return 'bg-[#C8102E] text-white'; // LFC Red
        case 'This Is Anfield':
            return 'bg-[#D00027] text-white';
        case 'Empire of the Kop':
            return 'bg-black text-white';
        case 'Anfield Watch':
            return 'bg-red-700 text-white';
        case 'Reddit':
            return 'bg-[#FF4500] text-white'; // Reddit Orange
        case 'Sky Sports':
            return 'bg-[#003594] text-white'; // Sky Blue/Navy
        default:
            return 'bg-gray-100 text-gray-700';
    }
};
