export const getCurrentEvent = () => {
    const currentDate = new Date();

    const dateMap: { [key: string]: string } = {
        '2024-11-01': '2024mttd',
        '2024-10-18': '2024cacc',
        '2024-07-17': '2024sunshow',
        '2024-04-12': '2024joh',
        '2024-03-30': '2024cabe',
        '2024-03-11': '2024azgl',
        '2024-02-24': '2024casj',
    };

    let result = '2024casj'; // silicon
    for (const dateStr in dateMap) {
        const date = new Date(dateStr);
        if (currentDate > date) {
            result = dateMap[dateStr];
            break;
        }
    }
    return result;
};
